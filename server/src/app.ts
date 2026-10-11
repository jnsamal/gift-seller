import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import type { Logger } from 'pino';
import type { Environment } from './config/env.js';
import { errorHandler, HttpError, validateQuery } from './middleware/errors.js';
import { openapi } from './openapi.js';

export interface AppDependencies { env: Environment; logger: Logger; checkDatabase: () => Promise<void>; }

export function createApp({ env, logger, checkDatabase }: AppDependencies) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY_HOPS === 0 ? false : env.TRUST_PROXY_HOPS);
  app.use((_req, res, next) => {
    res.locals.requestId = randomUUID();
    res.setHeader('X-Request-Id', res.locals.requestId);
    res.setHeader('Cache-Control', 'no-store');
    const start = performance.now();
    res.on('finish', () => logger.info({ requestId: res.locals.requestId, status: res.statusCode, durationMs: Math.round(performance.now() - start) }, 'Request completed'));
    next();
  });
  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.FRONTEND_URL) callback(null, true);
      else callback(new HttpError(403, 'ORIGIN_NOT_ALLOWED', 'Origin is not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Idempotency-Key'],
    exposedHeaders: ['X-Request-Id'],
  }));
  app.use('/api', rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-8', legacyHeaders: false,
    handler: (_req, _res, next) => next(new HttpError(429, 'RATE_LIMITED', 'Too many requests; retry later')),
  }));
  // Defense in depth for future browser mutations. Real session-bound CSRF tokens arrive in Phase 3.
  app.use((req, _res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('Origin') !== env.FRONTEND_URL) {
      return next(new HttpError(403, 'ORIGIN_REQUIRED', 'A trusted Origin is required'));
    }
    next();
  });
  // Future Razorpay raw-body verification must be mounted BEFORE this JSON parser.
  app.use(express.json({ limit: '32kb', strict: true }));
  const query = validateQuery(z.strictObject({}));
  app.get('/api/v1/health/live', query, (_req, res) => {
    res.json({ data: { status: 'ok' }, requestId: res.locals.requestId });
  });
  app.get('/api/v1/health/ready', query, async (_req, res) => {
    let timeout: NodeJS.Timeout | undefined;
    try {
      await Promise.race([
        checkDatabase(),
        new Promise<never>((_resolve, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 5000); }),
      ]);
    } catch { throw new HttpError(503, 'DATABASE_UNAVAILABLE', 'Service is not ready'); }
    finally { clearTimeout(timeout); }
    res.json({ data: { status: 'ready' }, requestId: res.locals.requestId });
  });
  app.get('/api/v1/openapi.json', (_req, res) => { res.json(openapi); });
  app.use((_req, _res, next) => next(new HttpError(404, 'NOT_FOUND', 'Resource not found')));
  app.use(errorHandler(logger));
  return app;
}
