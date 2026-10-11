import type { PrismaClient } from '../generated/prisma/client.js';

export async function seedDevelopment(db: PrismaClient) {
  // Idempotent create-only data: never overwrite catalog edits or inventory on reseed.
  await db.$transaction(async tx => {
    for (const code of ['CUSTOMER', 'ADMIN']) await tx.role.upsert({ where: { code }, update: {}, create: { code } });
    const category = await tx.category.upsert({ where: { slug: 'personalised-gifts' }, update: {}, create: { slug: 'personalised-gifts', name: 'Personalised Gifts' } });
    const product = await tx.product.upsert({ where: { slug: 'development-photo-frame' }, update: {}, create: {
      slug: 'development-photo-frame', title: 'Development photo frame', description: 'Development fixture only. Not published or connected to the storefront.', status: 'DRAFT',
    } });
    const variant = await tx.productVariant.upsert({ where: { sku: 'DEV-FRAME-001' }, update: {}, create: { productId: product.id, sku: 'DEV-FRAME-001', name: 'Default', pricePaise: 129900 } });
    await tx.productCategory.upsert({ where: { productId_categoryId: { productId: product.id, categoryId: category.id } }, update: {}, create: { productId: product.id, categoryId: category.id } });
    const location = await tx.fulfilmentLocation.upsert({ where: { code: 'DEV' }, update: {}, create: { code: 'DEV', name: 'Development location' } });
    await tx.inventory.upsert({ where: { variantId_locationId: { variantId: variant.id, locationId: location.id } }, update: {}, create: { variantId: variant.id, locationId: location.id, onHand: 10 } });
    await tx.siteSetting.upsert({ where: { key: 'timezone' }, update: {}, create: { key: 'timezone', value: 'Asia/Kolkata' } });
  });
}
