import type { RouteDefinition } from '../http.js';

export const recordingsRoute: RouteDefinition = {
  method: 'GET',
  path: '/recordings',
  summary: 'List recordings',
  requiresAuth: true,
  handler: async ({ services, currentUser, query }) => {
    const releaseId = query.get('releaseId') ?? undefined;
    const items = await services.recordings.list(currentUser!, releaseId);
    return {
      status: 200,
      body: { items, total: items.length },
    };
  },
};