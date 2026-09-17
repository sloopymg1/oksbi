import type { RouteDefinition } from '../http.js';
import { parseQuery } from '../http.js';
import { royaltyStatementQuerySchema } from '../shared.js';

export const royaltiesStatementsRoute: RouteDefinition = {
  method: 'GET',
  path: '/royalties/statements',
  summary: 'List royalty statements',
  requiresAuth: true,
  handler: async ({ services, currentUser, query }) => {
    const input = parseQuery(query, royaltyStatementQuerySchema);
    const items = await services.royalties.listStatements(currentUser!, input);
    return {
      status: 200,
      body: { items, total: items.length },
    };
  },
};