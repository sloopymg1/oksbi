import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { registerRequestSchema } from '../shared.js';

export const authRegisterRoute: RouteDefinition = {
  method: 'POST',
  path: '/auth/register',
  summary: 'Register account',
  handler: async ({ req, services }) => {
    const input = await parseJsonBody(req, registerRequestSchema);
    const result = await services.auth.register(input);
    return {
      status: 201,
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