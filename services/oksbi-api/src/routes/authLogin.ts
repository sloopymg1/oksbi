import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { loginRequestSchema } from '../shared.js';

export const authLoginRoute: RouteDefinition = {
  method: 'POST',
  path: '/auth/login',
  summary: 'Login',
  handler: async ({ req, services }) => {
    const input = await parseJsonBody(req, loginRequestSchema);
    const result = await services.auth.login(input);
    return {
      status: 200,
      headers: {
        'Set-Cookie': result.cookieHeader,
      },
      body: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  },
};