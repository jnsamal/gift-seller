import 'dotenv/config';
import { parseEnvironment } from '../src/config/env.js';
import { createDatabase } from '../src/lib/database.js';
import { seedDevelopment } from '../src/lib/seed.js';

const env = parseEnvironment(process.env);
if (env.NODE_ENV === 'production') throw new Error('Development seed is disabled in production');
const database = createDatabase(env);
try { await seedDevelopment(database); console.log('Development seed completed (no users or credentials created)'); }
finally { await database.$disconnect(); }
