import type { RouteDefinition } from '../http.js';
import { openApiDocument } from '../openapi.js';

export const openApiRoute: RouteDefinition = {
  method: 'GET',
  path: '/openapi',
  summary: 'OpenAPI document',
  handler: async () => ({
    status: 200,
    body: openApiDocument,
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
    },
  }),
};