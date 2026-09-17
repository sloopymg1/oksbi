import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { onboardingRequestSchema } from '../shared.js';

export const onboardingRoute: RouteDefinition = {
  method: 'POST',
  path: '/onboarding',
  summary: 'Upsert onboarding profile',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, onboardingRequestSchema);
    const profile = await services.onboarding.upsert(currentUser!, input);
    return {
      status: 200,
      body: { profile },
    };
  },
};