import 'dotenv/config';
import { spawnSync } from 'node:child_process';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('_test') || url === process.env.DATABASE_URL) throw new Error('Separate TEST_DATABASE_URL ending in _test required');
const result = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: url } });
process.exitCode = result.status ?? 1;
