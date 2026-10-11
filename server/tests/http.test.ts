import { describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { Writable } from 'node:stream';
import pino from 'pino';
import { createApp } from '../src/app.js';
import { parseEnvironment } from '../src/config/env.js';
import { createLogger } from '../src/lib/logger.js';
import { errorHandler } from '../src/middleware/errors.js';

function fixture(checkDatabase: () => Promise<void> = async () => {}, limit = '120') {
  const env = parseEnvironment({ NODE_ENV: 'test', FRONTEND_URL: 'http://localhost:3000', DATABASE_URL: 'mysql://test:unused@127.0.0.1/gifty_test', RATE_LIMIT_MAX: limit });
  return createApp({ env, logger: createLogger('silent'), checkDatabase });
}
describe('foundation HTTP boundary', () => {
  it('liveness, request IDs and safe headers', async () => {
    const res = await request(fixture()).get('/api/v1/health/live').set('X-Request-Id', 'attacker-controlled');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(res.headers['x-request-id']).toBe(res.body.requestId);
    expect(res.body.requestId).not.toBe('attacker-controlled');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
  it('rejects unexpected query input', async () => {
    const res = await request(fixture()).get('/api/v1/health/live?secret=untrusted');
    expect(res.status).toBe(400); expect(res.body.error.code).toBe('INVALID_QUERY');
    expect(JSON.stringify(res.body)).not.toContain('untrusted');
  });
  it('readiness calls the dependency and fails safely', async () => {
    let called = false;
    const res = await request(fixture(async () => { called = true; throw new Error('mysql://password@host SQL private data'); })).get('/api/v1/health/ready');
    expect(called).toBe(true); expect(res.status).toBe(503);
    expect(JSON.stringify(res.body)).not.toMatch(/password|SQL/);
    expect((await request(fixture()).get('/api/v1/health/ready')).body.data.status).toBe('ready');
  });
  it('bounds a stalled readiness probe', async () => {
    const res = await request(fixture(() => new Promise(() => {}))).get('/api/v1/health/ready');
    expect(res.status).toBe(503);
  }, 7000);
  it('allows only the configured browser origin and preflight', async () => {
    const app = fixture();
    const good = await request(app).options('/api/v1/health/live').set('Origin', 'http://localhost:3000').set('Access-Control-Request-Method', 'GET');
    expect(good.status).toBe(204); expect(good.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    const bad = await request(app).get('/api/v1/health/live').set('Origin', 'https://evil.example');
    expect(bad.status).toBe(403); expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });
  it('requires trusted Origin for mutations', async () => {
    const res = await request(fixture()).post('/api/v1/unknown').send({ value: 1 });
    expect(res.status).toBe(403); expect(res.body.error.code).toBe('ORIGIN_REQUIRED');
  });
  it('handles malformed and oversized JSON centrally', async () => {
    const app = fixture();
    const malformed = await request(app).post('/api/v1/unknown').set('Origin', 'http://localhost:3000').set('Content-Type', 'application/json').send('{');
    expect(malformed.status).toBe(400); expect(malformed.body.error.code).toBe('INVALID_JSON');
    const big = await request(app).post('/api/v1/unknown').set('Origin', 'http://localhost:3000').send({ value: 'x'.repeat(40000) });
    expect(big.status).toBe(413);
  });
  it('returns consistent 404 and OpenAPI without future APIs pretending to exist', async () => {
    const app = fixture();
    const absent = await request(app).get('/api/v1/products');
    expect(absent.status).toBe(404); expect(absent.body.error.code).toBe('NOT_FOUND');
    const spec = await request(app).get('/api/v1/openapi.json');
    expect(spec.body.openapi).toBe('3.1.0'); expect(Object.keys(spec.body.paths)).toHaveLength(3);
  });
  it('rate limits without trusting spoofed forwarding headers', async () => {
    const app = fixture(undefined, '2');
    await request(app).get('/api/v1/health/live');
    await request(app).get('/api/v1/health/live');
    const res = await request(app).get('/api/v1/health/live');
    expect(res.status).toBe(429); expect(res.headers['retry-after']).toBeDefined();
  });
  it('does not leak unexpected exception details to responses or logs', async () => {
    let output = '';
    const stream = new Writable({ write(chunk, _encoding, done) { output += String(chunk); done(); } });
    const app = express();
    app.get('/', () => { throw new Error('SECRET_DATABASE_PASSWORD'); });
    app.use(errorHandler(pino({}, stream)));
    const res = await request(app).get('/');
    expect(res.status).toBe(500); expect(JSON.stringify(res.body) + output).not.toContain('SECRET_DATABASE_PASSWORD');
  });
});
