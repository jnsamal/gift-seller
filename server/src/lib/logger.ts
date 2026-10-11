import pino from 'pino';
import type { Environment } from '../config/env.js';

export function createLogger(level: Environment['LOG_LEVEL']) {
  return pino({
    level,
    base: { service: 'gifty-api' },
    redact: { paths: ['password', 'token', 'secret', 'DATABASE_URL', 'req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'], censor: '[REDACTED]' },
  });
}
