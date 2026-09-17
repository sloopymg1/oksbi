import type { RouteDefinition } from '../http.js';

export const authLogoutRoute: RouteDefinition = {
  method: 'POST',
  path: '/auth/logout',
  summary: 'Logout',
  requiresAuth: true,
  handler: async ({ req, services }) => {
    await services.auth.logout(req);
    return {
      status: 204,
      headers: {
        'Set-Cookie': 'oksbi_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      },
    };
  },
};