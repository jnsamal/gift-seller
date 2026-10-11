import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeReturnPath } from '../../src/lib/safe-return-path.js';
import { sendOtp, verifyOtp } from '../../src/data/auth.js';

afterEach(() => vi.unstubAllEnvs());
describe('frontend prerequisite security fixes', () => {
  it.each(['javascript:alert(1)', '//evil.example/path', '/\\evil.example', 'https://evil.example', '/\n/evil.example'])('rejects external/unsafe return URL %s', value => {
    expect(safeReturnPath(value)).toBe('/account');
  });
  it('preserves local path/query and rejects an absent value', () => {
    expect(safeReturnPath('/checkout?step=address')).toBe('/checkout?step=address');
    expect(safeReturnPath(null)).toBe('/account');
  });
  it('cannot authenticate with the demonstration OTP in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await sendOtp('9876543210')).success).toBe(false);
    expect((await verifyOtp('9876543210', '123456')).success).toBe(false);
  });
});
