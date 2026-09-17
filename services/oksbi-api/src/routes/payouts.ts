import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { payoutRequestSchema } from '../shared.js';

export const payoutsRoute: RouteDefinition = {
  method: 'POST',
  path: '/payouts',
  summary: 'Create payout request',
  requiresAuth: true,
  handler: async ({ req, services, currentUser }) => {
    const input = await parseJsonBody(req, payoutRequestSchema);
    const payout = await services.payouts.createRequest(currentUser!, input);
    return {
      status: 201,
      body: { payout },
    };
  },
};

export const payoutsListRoute: RouteDefinition = {
  method: 'GET',
  path: '/payouts',
  summary: 'List payout requests',
  requiresAuth: true,
  handler: async ({ services, currentUser }) => {
    const items = await services.payouts.list(currentUser!);
    return { status: 200, body: { items, total: items.length } };
  },
};