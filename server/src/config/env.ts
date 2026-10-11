import { z } from 'zod';

const booleanFlag = z.enum(['true', 'false']).default('false').transform(value => value === 'true');
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  FRONTEND_URL: z.url().refine(value => {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === value && !url.username && !url.password;
  }, 'Must be an HTTP(S) origin without path or credentials'),
  DATABASE_URL: z.string().refine(value => {
    try {
      const url = new URL(value);
      return url.protocol === 'mysql:' && !!url.hostname && !!url.username && !!url.password && /^\/[a-zA-Z0-9_]+$/.test(url.pathname) && !url.search && !url.hash;
    } catch { return false; }
  }, 'Must be a MySQL URL with credentials and database; use explicit TLS settings instead of query parameters'),
  DATABASE_TLS: booleanFlag,
  DATABASE_CA_FILE: z.string().optional().transform(value => value || undefined),
  DB_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(30).default(5),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(10000).default(120),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).max(3600000).default(60000),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
}).superRefine((env, ctx) => {
  if (env.NODE_ENV === 'production') {
    if (!env.DATABASE_TLS) ctx.addIssue({ code: 'custom', path: ['DATABASE_TLS'], message: 'Production requires verified database TLS' });
    if (!env.FRONTEND_URL.startsWith('https:')) ctx.addIssue({ code: 'custom', path: ['FRONTEND_URL'], message: 'Production requires HTTPS' });
  }
});

export type Environment = z.infer<typeof schema>;
export function parseEnvironment(input: NodeJS.ProcessEnv): Environment {
  const result = schema.safeParse(input);
  if (!result.success) {
    // Never include submitted values or the raw Zod error (which can contain input).
    throw new Error(`Invalid configuration: ${[...new Set(result.error.issues.map(issue => issue.path.join('.')))].join(', ')}`);
  }
  return result.data;
}
