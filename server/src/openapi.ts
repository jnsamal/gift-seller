const errorResponse = {
  description: 'Safe error response',
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
};
const healthResponse = {
  description: 'Service health',
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Health' } } },
};
export const openapi = {
  openapi: '3.1.0',
  info: { title: 'Gifty REST API', version: '0.1.0', description: 'Phase 1 foundation only. No customer/admin/payment APIs are implemented yet.' },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/health/live': { get: { summary: 'Process liveness (does not require MySQL)', responses: { '200': healthResponse, '400': errorResponse, '429': errorResponse } } },
    '/health/ready': { get: { summary: 'MySQL readiness (SELECT 1)', responses: { '200': healthResponse, '400': errorResponse, '429': errorResponse, '503': errorResponse } } },
    '/openapi.json': { get: { summary: 'This API specification', responses: { '200': { description: 'OpenAPI 3.1 document' }, '429': errorResponse } } },
  },
  components: { schemas: {
    Error: { type: 'object', required: ['error', 'requestId'], properties: { error: { type: 'object', required: ['code', 'message'], properties: { code: { type: 'string' }, message: { type: 'string' } } }, requestId: { type: 'string', format: 'uuid' } } },
    Health: { type: 'object', required: ['data', 'requestId'], properties: { data: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['ok', 'ready'] } } }, requestId: { type: 'string', format: 'uuid' } } },
  } },
} as const;
