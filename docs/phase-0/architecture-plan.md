# Gifty architecture and implementation plan

Date: 9 October 2026. Proposed design only; Phase 1 has not started.

## Preserve and integrate

Keep the existing Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Tailwind v4, base-nova shadcn/Base UI components, Framer Motion and Lucide. Preserve Playfair Display, cream #FCFAF5, foreground #183330, green #07514D / #043F3C, gold #D2A01F, muted #F4F2EA and border #E4E7E2. Keep existing layout, gallery, navigation, transitions and responsive intent. Baseline defects are documented separately; fixing them requires focused comparisons.

Introduce a separate `server/` Express/TypeScript application with `src/config`, `middleware`, `modules`, `lib`, `jobs`, `app.ts`, `server.ts`, `prisma/`, and `tests/`. Modules own routes, Zod contracts, thin controllers, services, and Prisma queries. Add shared transport contracts without exporting Prisma models or server secrets to the client. Adapt existing component props and contexts incrementally, retaining mock implementations until replacements are verified.

Use `/api/v1`. Prefer a same-origin reverse proxy for browser APIs in production; Next server rendering calls the private backend address. Support explicit credentialed CORS for separate local ports. Public catalog/CMS responses may be cached with invalidation on admin publication. Session, cart, checkout, private media and account data must never enter shared caches. Follow the installed Cache Components documentation, including async route params, runtime Suspense boundaries and explicit caching decisions. Do not introduce old route-segment caching flags.

## Initial relational model

MySQL with utf8mb4, Prisma migrations, UTC timestamps, integer INR paise, foreign keys and explicit deletion policies. Monetary totals must use safe integer arithmetic and defined rounding. Scheduling interprets calendar dates, cutoff times and slots in Asia/Kolkata.

| Domain | Initial entities and relationships | Integrity rules and indexes |
|---|---|---|
| Identity | User → Identity(email/mobile), Session, Address, Preference, DeletionRequest; Role ↔ UserRole | Unique normalized identity(type,value); hashed random session token unique; session expiry/user indexes; OTPChallenge includes identity, purpose, hashed secret, expiry, attempts, resend window and consumedAt. No client role assignment. |
| Catalog | Product → ProductVariant → Inventory; Category hierarchy; ProductCategory; Collection, Occasion, Recipient, Tag and joins | Unique product slug and variant SKU; publication/status indexes; unique product/taxonomy pairs; archive referenced products. A default variant gives every purchasable SKU one inventory/pricing model. |
| Media | MediaAsset ↔ ProductMedia / VariantMedia / CMS references; UploadIntent | Unique provider asset identity, resource type, delivery type, secure reference, format, width/height, bytes, duration, alt text, owner, lifecycle status. Keep binaries out of MySQL. |
| Personalisation | Product → PersonalisationOption with permitted values, constraints and prices; cart/order item snapshots | Stable option IDs; schema version and canonical validated selections; owned media references. Do not identify options solely by display label. |
| Shopping | Cart → CartItem; Wishlist → WishlistItem | Guest secret stored hashed; user ownership; line identity includes variant, canonical customisation, add-ons and relevant fulfilment selection. Unique wishlist(user,product); merge transaction validates stock and prices. |
| Inventory | Inventory(variant,fulfilmentLocation), InventoryMovement, InventoryReservation | Unique variant/location; nonnegative onHand/reserved; reserve via conditional update/transaction and bounded retry. Reservation expiry/status indexed; release/consume at most once. |
| Delivery | FulfilmentLocation, DeliveryZone, ServiceablePincode, DeliveryMethod, DeliveryRule, DeliverySlot, Holiday, Restriction, SlotCapacityReservation | Six-digit PIN stored as string; product/variant rules, preparation lead time, cutoff, blackout and capacity checks; unique slot/date/location capacity record. |
| Checkout/orders | CheckoutQuote → Order → OrderItem, OrderStatusHistory; order-level address/contact/pricing snapshots | Unique opaque public order identifier and checkout idempotency key scoped to owner; immutable sold-item snapshots; quote expiry; separate payment and fulfilment state machines. No cascading deletion of order history. |
| Payments | Order → Payment → PaymentEvent, Refund | Unique provider order/payment/event identifiers; refund idempotency key; enforce legal transitions and reconcile authoritative provider state. Preserve raw webhook verification boundary. |
| Fulfilment | Order → Shipment → ShipmentEvent | Persist real tracking events/provider references; expose only owner-authorized or scoped guest tracking responses. |
| Promotions | Coupon → CouponRedemption; Campaign | Unique normalized code; atomic global/customer usage limits; eligibility and date indexes; pending usage holds released with failed/expired checkout. |
| CMS/admin | HomepageSection, Banner, CMSPage, NavigationItem, SiteSetting, AuditLog | Unique page slug/settings key; typed configuration; sanitized content; ordering/publication timestamps; actor/entity/time indexes on audit history. |
| Engagement | Review → ReviewMedia; NewsletterSubscriber, ConsentEvent, CorporateInquiry, ContactInquiry, Notification/Outbox | Review tied to verified order item with duplicate constraint; moderation status; unique normalized subscriber email; hashed unsubscribe token; deduplicated notification event/channel. |

Do not add every advanced table blindly in Phase 1. Establish identity/catalog/media/order foundations with reviewed migrations, then extend through phase-owned migrations. Validate fresh migration, upgrade migration, repeatable seed and rollback/recovery instructions against an isolated MySQL instance. Use bounded pagination and batched relation queries. Add composite indexes from actual query plans.

## API plan

| Routes under /api/v1 | Policy and responsibility |
|---|---|
| GET /health/live, /health/ready | Readiness checks database without exposing credentials or stack traces. |
| POST /auth/otp/request, /auth/otp/verify, /auth/logout; GET /auth/session | Generic request response; hashed OTP; identity/IP quotas; single-use verification; rotate opaque HttpOnly session cookie; CSRF/Origin validation for mutations. Development transport cannot run in production. |
| GET/PATCH /me; /me/addresses; /me/preferences; POST /me/deletion-requests | Session ownership on every resource; deletion preserves required order history under documented retention policy. |
| GET /products, /products/:slug, /categories, /collections, /occasions, /recipients | Published records, validated filters/sort/pagination; product detail includes variants, inventory availability and media. |
| GET /search/suggestions; POST /gift-finder/recommendations | Query-relevant suggestions; deterministic weighted rules restricted to eligible available products. |
| GET /cart; POST/PATCH/DELETE /cart/items; POST /cart/merge, /cart/coupon | Session or scoped guest-cart credential; ignore supplied prices; return recalculated totals and validation issues. |
| GET /wishlist; POST/DELETE /wishlist/items/:productId | Authenticated ownership and real persisted count. |
| POST /delivery/options; POST /checkout/quote | Validate destination, items, slots, inventory, coupons and configured taxes; quote has explicit expiry and version. |
| POST /checkout/orders; POST /orders/:id/payment-attempts | Idempotent order creation, inventory/capacity holds; one order may have multiple payment attempts; retry cannot duplicate fulfilment. |
| POST /payments/razorpay/verify, /webhooks/razorpay | Server signature verification; original raw webhook bytes before JSON middleware; webhook route narrowly exempt from browser CSRF, authenticated by provider signature. |
| GET /orders, /orders/:id; POST /orders/:id/cancellation-requests | Ownership enforced server-side; retry/refund eligibility calculated by policy. |
| POST /tracking/lookup | Rate-limited verified identity or scoped guest token; no ID-only access to personal data. |
| POST /media/upload-intents, /media/complete | Authorized purpose and owner, constrained signed upload, provider metadata validation before attachment. |
| GET/POST /products/:id/reviews; POST /newsletter/subscriptions, /newsletter/unsubscribe, /corporate-inquiries, /contact-inquiries | Consent, duplicate prevention, anti-abuse limits; reviews only display after approval. |
| /admin/* | Deny by default, permission checks for every action including media signing, exports and refunds; audit sensitive writes. |

Errors: stable machine code, safe message, field validation details where appropriate, request ID. HTTP 400/401/403/404/409/422/429/500 as applicable. Lists return items and truthful pagination metadata. Bound request sizes, sort fields and page size; document in OpenAPI. Treat all IDs and uploaded references as untrusted.

## Payment and concurrency boundaries

1. Calculate authoritative quote from current data. In a short transaction create pending order, snapshot amounts/options and hold inventory, capacity and coupon usage using conditional updates.
2. Call Razorpay outside long database locks. Persist provider identity; recover ambiguous failures by reconciliation rather than creating duplicate orders.
3. Verify checkout signatures server-side and reconcile payment state. A browser callback alone cannot mark an order paid.
4. Authenticate raw webhook payload, deduplicate event, apply guarded state transitions and consume reservations transactionally. Out-of-order events cannot regress paid/refunded state. Late payment after expired stock holds requires reconciliation and a defined exception/refund path.
5. Commit a notification outbox record in the same transaction. A retryable worker sends notifications; it never reports delivered before provider acceptance.
6. Expiry/failure releases inventory, coupon and capacity holds idempotently. Preserve cart on payment failure; remove only ordered lines after confirmed success. Guard concurrent payment success/expiry/refund races in real MySQL tests.

## Cloudinary workflow

Backend creates short-lived upload intents after authenticating customer/admin or validating a constrained guest-cart capability. Bind intent to owner, purpose, allowed image/video formats, size and video duration, resource type and generated asset namespace. Return only necessary signed parameters. Verify completion with provider metadata/signature; never attach arbitrary submitted URLs/public IDs. Use public optimized delivery for catalog assets; authenticated/signed delivery for personalisation photos with authorization on access. Store provider metadata and attachment records in MySQL. Reference-aware deletion must protect historical order assets; asynchronous cleanup removes verified abandoned assets after retention. Include previews, progress, retries and upload failure states. Phase 2 requires a real Cloudinary test account to validate provider behavior.

## External dependencies and operations

- MySQL development/test instances (Docker Compose or configured local service); managed production instance with backups and restore drills. Credentials and installed Docker/MySQL availability are not verified in Phase 0.
- Cloudinary cloud name/API key/secret and configured asset access policy; Razorpay test key/secret and webhook secret with reachable HTTPS endpoint.
- Configurable SMTP/email and Indian SMS provider credentials, verified sender identities/templates as required by provider. No live notification claim from local transports.
- Production DNS/TLS, frontend host supporting chosen Next features, persistent Express runtime and worker host. Optional Redis only when rate-limit/queue scaling justifies it; MySQL outbox can begin without Redis.
- Validate NODE_ENV, PORT, FRONTEND_URL, DATABASE_URL, session/OTP secrets and expiry, Cloudinary, Razorpay, SMTP and SMS settings at startup. Log with Pino redaction. Never place secrets in NEXT_PUBLIC variables. Current `.gitignore` ignores `.env*`; explicitly allow safe `.env.example` templates when introduced.
- Configure taxes, delivery costs, return/refund rules and retention with the owner. Do not assert legal compliance from an engineering audit.

## Approved sequence and acceptance focus

| Phase | Scope | Exit evidence |
|---|---|---|
| 0 | Existing analysis and baseline | This audit, failure inventory, screenshots, checks and proposed architecture. |
| 1 | Backend foundation / MySQL | Express startup, env rejection, safe errors/logs, real MySQL migration/seed, health and initial tests/OpenAPI/Compose. |
| 2 | Catalog / Cloudinary | Persistent catalog CRUD/constraints, media authorization and real test-provider upload/delivery. |
| 3 | Authentication / accounts | OTP expiry/replay/attempt limits, session/CSRF, ownership, addresses, logout; provider status explicitly reported. |
| 4 | Storefront / discovery | Real counts, filters, sorting, URL state, matching search, rules-based recommendations and valid navigation. |
| 5 | Personalisation / wishlist / cart | Distinct customisations, secure photos, variants, guest merge, persisted wishlist/cart, authoritative money. |
| 6 | Serviceability / scheduling | PIN/product/cutoff/timezone/capacity/holiday cases; checkout revalidation contract. |
| 7 | Checkout / Razorpay / orders | Sandbox payments, tamper/replay/duplicate/out-of-order tests, real MySQL concurrency, reservation release and retry. |
| 8 | Tracking / reviews / notifications | Owner isolation, persisted timelines, moderation, purchase verification, delivery/retry evidence. |
| 9 | Admin / CMS | Permission matrix, storefront updates, audit records, safe media deletion, delivery/coupons/legal pages/enquiries. |
| 10 | Production readiness | Full customer/admin journeys, security, performance, visual comparisons, CI, backup/restore, deployment and live configuration checklist. |

Each phase ends with the requested eight-category audit and explicit owner approval. No future phase is authorized by this document. Baseline lint/runtime issues must be repaired in focused prerequisite work when implementation is approved; do not pass later phase regression gates while critical routes remain broken.
