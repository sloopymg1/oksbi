import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { takedownRequestSchema } from '../shared.js';

export const takedownsRoute: RouteDefinition = {
  method: 'POST',
  path: '/takedowns',
  summary: 'Create takedown request',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, takedownRequestSchema);
    const takedown = await services.takedowns.createRequest(currentUser!, input);
    return {
      status: 201,
      body: { takedown },
    };
  },
};