import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { smartLinkRequestSchema } from '../shared.js';

export const smartLinksRoute: RouteDefinition = {
  method: 'POST',
  path: '/smart-links',
  summary: 'Create or update smart link',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, smartLinkRequestSchema);
    const smartLink = await services.smartLinks.upsert(currentUser!, input);
    return {
      status: 200,
      body: { smartLink },
    };
  },
};