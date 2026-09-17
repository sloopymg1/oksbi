import type { RouteDefinition } from '../http.js';

export const healthRoute: RouteDefinition = {
  method: 'GET',
  path: '/health',
  summary: 'Health check',
  handler: async ({ services }) => {
    const checks = {
      postgres: await services.database.healthCheck(),
      blob: await services.storage.healthCheck(),
      redis: await services.cache.healthCheck(),
    };

    return {
      status: checks.postgres && checks.blob && checks.redis ? 200 : 503,
      body: {
        status: {
          ok: Object.values(checks).every(Boolean),
          checks,
        },
      },
    };
  },
};