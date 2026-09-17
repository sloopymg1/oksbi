import type { RouteDefinition } from '../http.js';

export const authCurrentUserRoute: RouteDefinition = {
  method: 'GET',
  path: '/auth/me',
  summary: 'Current user',
  requiresAuth: true,
  handler: async ({ currentUser }) => ({
    status: 200,
    body: {
      user: currentUser,
    },
  }),
};