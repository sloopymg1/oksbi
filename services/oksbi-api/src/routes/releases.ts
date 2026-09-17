import type { RouteDefinition } from '../http.js';

export const releasesRoute: RouteDefinition = {
  method: 'GET',
  path: '/releases',
  summary: 'List releases',
  requiresAuth: true,
  handler: async ({ services, currentUser }) => {
    const items = await services.releases.list(currentUser!);
    return {
      status: 200,
      body: { items, total: items.length },
    };
  },
};