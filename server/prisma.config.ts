import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
const databaseUrl = new URL(env('DATABASE_URL'));
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_TLS !== 'true') {
  throw new Error('Production migrations require DATABASE_TLS=true');
}
if (process.env.DATABASE_TLS === 'true') {
  databaseUrl.searchParams.set('sslaccept', 'strict');
  if (process.env.DATABASE_CA_FILE) databaseUrl.searchParams.set('sslcert', process.env.DATABASE_CA_FILE);
}
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' },
  datasource: { url: databaseUrl.toString() },
});
