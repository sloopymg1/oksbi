import type { RouteDefinition } from '../http.js';

export const compositionsRoute: RouteDefinition = {
  method: 'GET',
  path: '/compositions',
  summary: 'List compositions',
  requiresAuth: true,
  handler: async ({ services, currentUser }) => {
    const items = await services.compositions.list(currentUser!);
    return {
      status: 200,
      body: { items, total: items.length },
    };
  },
};