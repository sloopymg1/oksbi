import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { rightsSplitUpdateSchema } from '../shared.js';

export const rightsSplitsRoute: RouteDefinition = {
  method: 'POST',
  path: '/rights/splits',
  summary: 'Save rights split',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, rightsSplitUpdateSchema);
    const split = await services.rights.saveSplit(currentUser!, input);
    return {
      status: 200,
      body: { split },
    };
  },
};

export const rightsSplitsListRoute: RouteDefinition = {
  method: 'GET',
  path: '/rights/splits',
  summary: 'List rights splits',
  requiresAuth: true,
  handler: async ({ services, currentUser }) => {
    const items = await services.rights.list(currentUser!);
    return { status: 200, body: { items, total: items.length } };
  },
};