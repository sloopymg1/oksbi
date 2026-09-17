import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { adminOperationSchema } from '../shared.js';

export const adminOperationsRoute: RouteDefinition = {
  method: 'POST',
  path: '/admin/operations',
  summary: 'Record admin operation',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, adminOperationSchema);
    const operation = await services.admin.recordOperation(currentUser!, input);
    return {
      status: 201,
      body: { operation },
    };
  },
};