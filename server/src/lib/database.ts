import { readFileSync } from 'node:fs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';
import type { Environment } from '../config/env.js';

export function createDatabase(env: Pick<Environment, 'DATABASE_URL' | 'DATABASE_TLS' | 'DATABASE_CA_FILE' | 'DB_CONNECTION_LIMIT'>) {
  const url = new URL(env.DATABASE_URL);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: env.DB_CONNECTION_LIMIT,
    connectTimeout: 3000,
    acquireTimeout: 4000,
    ssl: env.DATABASE_TLS ? { rejectUnauthorized: true, ...(env.DATABASE_CA_FILE ? { ca: readFileSync(env.DATABASE_CA_FILE, 'utf8') } : {}) } : undefined,
  });
  return new PrismaClient({ adapter, errorFormat: 'minimal' });
}
