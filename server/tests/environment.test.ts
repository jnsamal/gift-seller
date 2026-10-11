import { describe, expect, it } from 'vitest';
import { parseEnvironment } from '../src/config/env.js';

const valid = { FRONTEND_URL: 'http://localhost:3000', DATABASE_URL: 'mysql://test:private-password@127.0.0.1:3307/gifty_test' };
describe('configuration validation', () => {
  it('applies bounded development defaults', () => {
    expect(parseEnvironment(valid)).toMatchObject({ PORT: 5000, DATABASE_TLS: false, TRUST_PROXY_HOPS: 0 });
  });
  it.each([
    { PORT: '0' }, { PORT: 'wat' }, { FRONTEND_URL: 'https://example.com/path' },
    { DATABASE_URL: 'postgres://test:secret@localhost/db' }, { DATABASE_URL: 'mysql://test:secret@localhost/db?sslaccept=accept_invalid_certs' },
    { RATE_LIMIT_MAX: '-1' }, { DATABASE_TLS: 'no' }, { TRUST_PROXY_HOPS: '99' },
  ])('rejects unsafe values without disclosing inputs: %j', overrides => {
    expect(() => parseEnvironment({ ...valid, ...overrides })).toThrow('Invalid configuration');
  });
  it('does not include secrets in configuration errors', () => {
    try { parseEnvironment({ ...valid, DATABASE_URL: 'TOP_SECRET_INVALID_URL' }); }
    catch (error) { expect(String(error)).not.toContain('TOP_SECRET'); expect(String(error)).toContain('DATABASE_URL'); }
  });
  it('requires HTTPS and verified database TLS in production', () => {
    expect(() => parseEnvironment({ ...valid, NODE_ENV: 'production' })).toThrow();
    expect(parseEnvironment({ ...valid, NODE_ENV: 'production', DATABASE_TLS: 'true', FRONTEND_URL: 'https://gifty.example' }).DATABASE_TLS).toBe(true);
  });
});
