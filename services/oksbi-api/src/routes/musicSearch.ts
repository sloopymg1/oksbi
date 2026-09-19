import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { musicSearchSchema } from '../shared.js';

export const musicSearchRoute: RouteDefinition = {
  method: 'POST', path: '/admin/music/search', summary: 'Search music titles and authors', requiresAuth: true,
  handler: async ({ req, services, currentUser }) => ({ status: 200, body: await services.musicSearch.search(currentUser!, await parseJsonBody(req, musicSearchSchema)) }),
};