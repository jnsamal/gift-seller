import type { ErrorRequestHandler, RequestHandler } from 'express';
import { z } from 'zod';
import type { Logger } from 'pino';

export class HttpError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}

export function validateQuery(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) return next(new HttpError(400, 'INVALID_QUERY', 'Invalid query parameters'));
    next();
  };
}

export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _req, res, next) => {
    if (res.headersSent) return next(error);
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    if (error instanceof HttpError) ({ status, code, message } = error);
    else if (typeof error === 'object' && error !== null && 'type' in error) {
      if (error.type === 'entity.parse.failed') { status = 400; code = 'INVALID_JSON'; message = 'Invalid JSON body'; }
      if (error.type === 'entity.too.large') { status = 413; code = 'PAYLOAD_TOO_LARGE'; message = 'Request body is too large'; }
      if (error.type === 'encoding.unsupported' || error.type === 'charset.unsupported') { status = 415; code = 'UNSUPPORTED_ENCODING'; message = 'Unsupported request encoding'; }
    }
    // Raw errors may contain SQL, credentials or personal data. Log only safe classification.
    logger[status >= 500 ? 'error' : 'warn']({ requestId: res.locals.requestId, status, code }, 'Request failed');
    res.status(status).json({ error: { code, message }, requestId: res.locals.requestId });
  };
}
