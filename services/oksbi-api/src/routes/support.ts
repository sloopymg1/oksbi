import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { supportCaseRequestSchema } from '../shared.js';

export const supportRoute: RouteDefinition = {
  method: 'POST',
  path: '/support/cases',
  summary: 'Create support case',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, supportCaseRequestSchema);
    const supportCase = await services.support.createCase(currentUser!, input);
    return {
      status: 201,
      body: { supportCase },
    };
  },
};

export const supportListRoute: RouteDefinition = {
  method: 'GET',
  path: '/support/cases',
  summary: 'List support cases',
  requiresAuth: true,
  handler: async ({ services, currentUser }) => {
    const items = await services.support.list(currentUser!);
    return { status: 200, body: { items, total: items.length } };
  },
};