# Existing implementation inventory

9 October 2026. Findings refer to the supplied frontend, not a completed backend. Source paths below are relative to the project root. Browser evidence is in `evidence/`; source-only findings are identified explicitly.

## Structure

102 files under `src/`, including one favicon, 11 App Router page files, one category error boundary, shared components and 12 static data modules. `src/lib/utils.ts` supplies class-name merging. There is no `server/`, Prisma schema, database migration, REST route handler, middleware/proxy authentication layer, test suite or CI configuration in the supplied project. `public/` contains hero/logo PNGs and starter SVGs. `README.md` is starter documentation and incorrectly describes Geist rather than the actual Playfair font.

The root layout wraps pages in AuthProvider, CartProvider, TooltipProvider and Toaster. Home is a client component composing the hero, announcement, navigation, delivery intent and merchandising sections. Category/product pages resolve async params on the server from static arrays; search resolves query parameters on the server. Interactive children use client state. Checkout has its own layout; headers and footers are composed within page/component trees rather than a shared storefront route-group layout. Reuse these structures where practical.

Installed Next 16.4.0 and React 19.3.0 match package declarations. TypeScript 5.9.3 is installed; strict mode is enabled. The dependency set has no Express, Prisma, MySQL connector, Cloudinary/Razorpay SDK, Zod, Pino, Vitest, Supertest or project Playwright installation. The audit uses the desktop's bundled Playwright without adding app dependencies. No dependency upgrades were performed; registry vulnerability auditing and full package-maintenance verification remain NOT TESTED.

## Routes

| Route | Current behavior |
|---|---|
| `/` | Composed merchandising frontend, static content, hero buttons without navigation handlers. |
| `/category/[slug]` | Eight supported category slugs; identical six products repeated four times; displays 142 total. |
| `/product/[slug]` | Six supported product slugs; injected generic description/specs, stock=25, same-day=true, sample gallery. Invalid slug calls notFound. |
| `/search` | Basic title/special-case matching, triple-duplicated results and inflated count; no server filtering beyond q. Empty results render. Extra decodeURIComponent on already-decoded input risks malformed-percent errors (source finding, not exercised). |
| `/cart` | Intended context cart; observed HTTP 500 from unconfigured remote next/image hostname. |
| `/checkout` | Local form and payment-method controls; no payment provider; missing image fallback; mock submit redirects to sample order. |
| `/login`, `/verify-otp` | Simulated OTP sending/verification and localStorage identity. Verification expects `id` query parameter. Default success destination `/account` does not exist. |
| `/order/success/[id]` | Async static-order lookup without ownership; sample confirmation hits runtime image error in browser. |
| `/track-order`, `/track-order/[id]` | Local sample lookup by order ID plus email/phone; timeline data and carrier reference are hardcoded. |

Valid category slugs: personalised-gifts, gift-hampers, flowers, cakes, home-living, chocolates, plants, keepsakes. Valid product slugs: personalised-photo-frame, artisan-chocolates, mens-watch, ceramic-vase-lilies, celebration-hamper, minimalist-necklace.

## Feature and mock inventory

| Feature / source | Exists today | Missing / false behavior | Planned phase |
|---|---|---|---|
| AnnouncementBar, MainNavbar, CategoryNavigation, Logo | Responsive navigation, desktop dropdown/mobile navigation code, cart badge from context | Unsupported delivery/payment assurances; default Bhubaneswar location; account/wishlist destinations absent | 4, 6, 9 |
| NavbarSearch | Submit q, static trending/suggestion terms | No catalog autocomplete API | 4 |
| Home hero and homepage merchandising | Existing visuals and animation | Hero CTAs inert; no editable CMS data | 4, 9 |
| `data/products.ts` | Six typed best sellers with price/rating/link fields | No SKU/variant/database authority | 2 |
| `data/categories.ts`, `occasions.ts`, `recipients.ts`, `navigation.ts` | Static taxonomy and nav config | Many destinations have no routes; taxonomy cannot be edited | 2, 4, 9 |
| `data/campaigns.ts`, `giftGuides.ts` | Static promotional, personalised/corporate content and inspiration | No campaign/CMS management or inquiry persistence | 9 |
| `data/sameDayProducts.ts` | Six separate sample products | Product URLs do not match six implemented detail pages; availability claims unverified | 2, 4, 6 |
| ProductCard / ProductInfo wishlist | Per-component heart toggle | No persistence/shared count/API; navigation wishlist badge remains static | 5 |
| ProductListing | Filter UI and URL synchronization | No actual filtering/sorting; Load More has no handler; duplicated records | 4 |
| ProductGallery | Thumbnail, arrows, fullscreen and mobile scrolling code | Image-only; external samples; video support absent; full keyboard/focus audit not performed | 2, 5 |
| ProductInfo | Quantity, text customisation, local add-to-cart | Upload input has no change/upload handler; Buy Now inert; toast View Cart only console.log; no variants; zero stock falls through `stock || 10` | 5 |
| GiftFinder | Three-question local trait scorer over inline PRODUCTS | No catalog, stock or serviceability checks; zero-match still picks first product; result URLs can be absent; budget is a trait, not a hard constraint | 4 |
| `data/auth.ts`, AuthContext | Timer-based send/verify, in-memory sample users, localStorage user | Constant OTP 123456; no provider, hashing, expiry, attempt enforcement, sessions or access control | 3 |
| `data/cart.ts`, CartContext | Seeded two-line/three-unit demo cart; local add/remove/quantity; customisation JSON comparison | Refresh restores samples; no guest merge/persistence; client pricing, zero tax and fixed shipping policy; no variant key or stock validation | 5 |
| CartSummary | Local coupon display and checkout spinner | Any nonempty code gets ₹300; checkout handler does not navigate; cart route currently prevents interaction test | 5, 7 |
| DeliveryIntent | Timer-based sample PIN lookup | Special-cases three PINs, rejects 8/9 prefixes; permissive numeric validation; not connected to product/order | 6 |
| ProductInfo delivery | Six-digit validation and timer | Rejects 4-prefix PINs, contradicting home acceptance of 400001; no date/slot/cutoff/capacity logic | 6 |
| CheckoutPage / CheckoutOrderSummary | Contact/address fields, method radio controls and local summary | Fixed shipping 99/149/249, local WELCOME10 coupon; no authoritative validation, scheduling, payment or order write; clears cart on mock success | 7 |
| `data/orders.ts` | Two fake orders, artificial lookup delay, fixed timeline/provider | Hardcoded customer data in bundled source; date/status inconsistency; no ownership or actual tracking integration | 7, 8 |
| OrderSuccessPage / ShipmentInfo | Confirmation and tracking presentation | `/track/:number` missing route; external carrier link points to example.com; no genuine receipt/payment evidence | 8 |
| `data/reviews.ts`, CustomerReviews | Static testimonials and rating display | No submission, moderation, purchase verification or rating aggregation | 8 |
| Newsletter | Email regex and simulated success after 800ms | Nothing saved or sent; no consent record, dedupe or unsubscribe | 8, 9 |
| CorporateGifting | Promotional section and links | Corporate/quotation routes and forms absent | 9 |
| Footer | Desktop groups, mobile accordion, social links | Generic social domains; missing legal/support routes; branding varies between Gifty and giftT seller | 4, 9 |
| Account/admin | Navigation entry points only | Profile, addresses, order history, preferences, deletion, admin RBAC and all management absent | 3, 9 |
| Infrastructure | Next scripts and lockfile | Backend/database/media/payment, outbox/jobs, OpenAPI, environment examples, operational docs and CI absent | 1–10 |

`data/reviews.ts`, `auth.ts`, `products.ts`, `cart.ts`, `orders.ts`, `categories.ts`, `sameDayProducts.ts`, `recipients.ts`, `occasions.ts`, `navigation.ts`, `giftGuides.ts`, `campaigns.ts` are the static/mock data surfaces found (12 modules; see manifest for authoritative file enumeration). Do not replace these with an unverified backend in one step.

## Broken destinations and inert controls

Source inventory finds no routes for `/account` and descendants, `/admin`, `/faq`, `/contact`, `/about`, `/corporate`, `/gift-cards`, `/gift-finder`, `/blog` and guide pages, `/careers`, `/gifts`, `/personalised`, `/delivery/same-day`, `/delivery-information`, `/privacy`, `/privacy-policy`, `/terms`, `/shipping-policy`, `/refund-policy`, `/cancellation-policy`, `/occasion/*`, `/recipient/*`, or `/track/*`. Category all, best-sellers, bestsellers, new-arrivals and occasions are unsupported slugs. Same-day and Gift Finder link targets use products outside the detail catalog. Four representative missing destinations were verified as HTTP 404 at all three widths; the rest are source-route findings, not an exhaustive browser crawl.

Inert source controls include hero CTAs, Buy Now, category shortcut links pointing at `#`, Load More, cart checkout navigation and View Cart toast action. Filters change query strings but not results; browser interaction confirms the price-filter and Load More cases.

## Prioritized existing issues

| Priority | Finding | Evidence / remediation |
|---|---|---|
| Critical before any production use | Fixed OTP/client identity and fake payment success | auth.ts/AuthContext/CheckoutPage; implement phases 3/7, never expose mock flows as production commerce. |
| High | Cart runtime failure and confirmation image failure | Browser JSON and screenshots; configure intentional image delivery and safe fallbacks in approved prerequisite fixes. |
| High | No backend authorization, persistence or authoritative order/payment/stock | Entire frontend boundary; implement planned services before using actual customer data. |
| High | Unvalidated returnTo passed to router.push/replace | login/verify-otp source; require safe same-origin allowlisted local paths. Exploit test not performed. |
| High | Filters/counts and missing links break discovery | Source plus interaction JSON and 404 captures; phase 4 must use real records/routes. |
| Medium | Mobile grid overflow (499px document at 390px viewport) | Category and matching-search browser measurements; card carousel widths reused inside listing grid. |
| Medium | Broken/mismatched imagery and missing placeholder.jpg | Image load observations; some external failures may be transient. Photo frame currently displays a tote bag; vase displays room decor. |
| Medium | Lint errors and fragile hooks/types | 35 errors, 56 warnings; explicit any, effect state, ref mutation/read, components defined during render, unescaped JSX. |
| Medium | Cart/checkout coupons and shipping disagree | Source formulas; unify in backend quote service, remove empty-cart shipping and invalid negative totals. |
| Medium | No test/CI/operations foundation; Git absent | Scripts/filesystem; restore supplied history or initialize a deliberate baseline before future commits. |

The audit does not establish exploitability for every source concern, legal compliance, accessibility conformance, load capacity or production readiness.

## Functional references

[IGP homepage](https://www.igp.com/) was read on 9 October 2026. It exposes occasion/category discovery, personalised merchandise, delivery badges, wishlist/profile entry points, corporate gifting and newsletter. For Gifty, separate merchandising taxonomy from delivery eligibility and present only truthful record-backed badges.

[FNP homepage and customer FAQs](https://www.fnp.com/) were retrieved through search after a direct-open error. The described journey checks PIN eligibility, chooses product/date/time slot, captures recipient/message/personalisation and then checks out; options depend on product/location/cutoff. Use that dependency order for Gifty's delivery and checkout design.

Reference review was read-only. No accounts, orders, uploads, private administration or real payments were exercised. Their visual designs, assets, text and source code are not reused. Transactional behavior beyond public descriptions remains NOT TESTED.

