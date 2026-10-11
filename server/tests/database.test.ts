import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { createDatabase } from '../src/lib/database.js';
import { parseEnvironment } from '../src/config/env.js';
import { seedDevelopment } from '../src/lib/seed.js';
import { createApp } from '../src/app.js';
import { createLogger } from '../src/lib/logger.js';
import request from 'supertest';

const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl || !new URL(testUrl).pathname.endsWith('_test') || testUrl === process.env.DATABASE_URL) {
  throw new Error('A separate TEST_DATABASE_URL ending in _test is required. No fallback to development/production is allowed.');
}
const env = parseEnvironment({ ...process.env, NODE_ENV: 'test', DATABASE_URL: testUrl });
const db = createDatabase(env);
afterAll(async () => { await db.$disconnect(); });
describe('real MySQL foundation', () => {
  it('connects through Prisma and serves ready', async () => {
    const app = createApp({ env, logger: createLogger('silent'), checkDatabase: async () => { await db.$queryRaw`SELECT 1`; } });
    expect((await request(app).get('/api/v1/health/ready')).status).toBe(200);
  });
  it('seeds twice without duplicates or overwriting stock', async () => {
    await seedDevelopment(db);
    const first = await db.product.count();
    await seedDevelopment(db);
    expect(await db.product.count()).toBe(first);
    expect(await db.product.count({ where: { slug: 'development-photo-frame', status: 'DRAFT' } })).toBe(1);
    expect(await db.user.count()).toBe(0);
    expect(await db.role.count()).toBe(2);
  });
  it('rolls back a transaction and enforces a unique slug', async () => {
    const slug = `test-${randomUUID()}`;
    await expect(db.$transaction(async tx => {
      await tx.product.create({ data: { slug, title: 'Test', description: 'Rollback fixture' } });
      await tx.product.create({ data: { slug, title: 'Duplicate', description: 'Rejected' } });
    })).rejects.toMatchObject({ code: 'P2002' });
    expect(await db.product.count({ where: { slug } })).toBe(0);
  });
  it('enforces foreign keys', async () => {
    await expect(db.identity.create({ data: { userId: 'nonexistent-user', type: 'EMAIL', value: `test-${randomUUID()}@example.com` } })).rejects.toMatchObject({ code: 'P2003' });
  });
  it('rejects inconsistent order totals', async () => {
    await expect(db.order.create({ data: {
      publicId: `TEST-${randomUUID()}`, checkoutKey: randomUUID(), subtotalPaise: 10000, totalPaise: 1,
      customerSnapshot: {}, addressSnapshot: {}, deliverySnapshot: {},
    } })).rejects.toThrow();
  });
  it('protects sold variants and keeps order snapshots within a transaction', async () => {
    const marker = new Error('rollback-order-test');
    await expect(db.$transaction(async tx => {
      const product = await tx.product.create({ data: { slug: `test-${randomUUID()}`, title: 'Original title', description: 'Test' } });
      const variant = await tx.productVariant.create({ data: { productId: product.id, sku: `TEST-${randomUUID()}`, name: 'Default', pricePaise: 10000 } });
      const order = await tx.order.create({ data: {
        publicId: `TEST-${randomUUID()}`, checkoutKey: randomUUID(), subtotalPaise: 10000, totalPaise: 10000,
        customerSnapshot: { name: 'Test' }, addressSnapshot: {}, deliverySnapshot: {},
        items: { create: { variantId: variant.id, titleSnapshot: product.title, skuSnapshot: variant.sku, unitPricePaise: 10000, quantity: 1, personalisationSnapshot: {} } },
      } });
      await tx.product.update({ where: { id: product.id }, data: { title: 'Changed catalog title' } });
      expect((await tx.orderItem.findFirstOrThrow({ where: { orderId: order.id } })).titleSnapshot).toBe('Original title');
      await expect(tx.productVariant.delete({ where: { id: variant.id } })).rejects.toMatchObject({ code: 'P2003' });
      throw marker;
    })).rejects.toBe(marker);
  });
  it('preserves Unicode and exact paise inside a rollback transaction', async () => {
    const marker = new Error('rollback-test');
    await expect(db.$transaction(async tx => {
      const product = await tx.product.create({ data: { slug: `test-${randomUUID()}`, title: 'उपहार 🎁', description: 'Unicode' } });
      const variant = await tx.productVariant.create({ data: { productId: product.id, sku: `TEST-${randomUUID()}`, name: 'Default', pricePaise: 129901 } });
      expect(product.title).toBe('उपहार 🎁'); expect(variant.pricePaise).toBe(129901);
      throw marker;
    })).rejects.toBe(marker);
  });
  it('rejects inventory reservations above on-hand and negative prices', async () => {
    const variant = await db.productVariant.findUniqueOrThrow({ where: { sku: 'DEV-FRAME-001' } });
    const inventory = await db.inventory.findFirstOrThrow({ where: { variantId: variant.id } });
    await expect(db.inventory.update({ where: { id: inventory.id }, data: { reserved: inventory.onHand + 1 } })).rejects.toThrow();
    await expect(db.productVariant.update({ where: { id: variant.id }, data: { pricePaise: -1 } })).rejects.toThrow();
    expect((await db.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).pricePaise).toBe(129900);
  });
});
