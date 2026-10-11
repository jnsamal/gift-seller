import 'dotenv/config';
import { createApp } from './app.js';
import { parseEnvironment } from './config/env.js';
import { createLogger } from './lib/logger.js';
import { createDatabase } from './lib/database.js';

async function main() {
  const env = parseEnvironment(process.env);
  const logger = createLogger(env.LOG_LEVEL);
  const database = createDatabase(env);
  try { await database.$connect(); }
  catch { logger.fatal('Database connection failed at startup'); await database.$disconnect(); process.exitCode = 1; return; }
  const app = createApp({ env, logger, checkDatabase: async () => { await database.$queryRaw`SELECT 1`; } });
  const server = app.listen(env.PORT, env.HOST, () => logger.info({ host: env.HOST, port: env.PORT }, 'Gifty API listening'));
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  let closing = false;
  const shutdown = (failed = false) => {
    if (closing) return;
    closing = true;
    logger.info('Shutting down');
    const deadline = setTimeout(() => process.exit(1), 10000).unref();
    server.close(() => {
      void database.$disconnect().then(() => { clearTimeout(deadline); process.exitCode = failed ? 1 : 0; });
    });
    server.closeIdleConnections();
  };
  process.on('SIGTERM', () => shutdown());
  process.on('SIGINT', () => shutdown());
  server.on('error', () => { logger.fatal('HTTP server failed'); shutdown(true); });
  process.on('uncaughtException', () => { logger.fatal('Uncaught exception'); shutdown(true); });
  process.on('unhandledRejection', () => { logger.fatal('Unhandled rejection'); shutdown(true); });
}
void main().catch(() => { console.error('Startup failed. Check configuration and database availability.'); process.exitCode = 1; });
