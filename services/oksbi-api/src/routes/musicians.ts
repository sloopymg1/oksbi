import type { RouteDefinition } from '../http.js';
import { parseJsonBody } from '../http.js';
import { musicianStatusSchema } from '../shared.js';

export const musiciansListRoute: RouteDefinition = {
  method: 'GET', path: '/admin/musicians', summary: 'List registered musicians', requiresAuth: true,
  handler: async ({ services, currentUser }) => ({ status: 200, body: { items: await services.admin.listMusicians(currentUser!) } }),
};

export const musicianStatusRoute: RouteDefinition = {
  method: 'PATCH', path: '/admin/musicians/:musicianId/status', summary: 'Update musician application status', requiresAuth: true,
  handler: async ({ req, params, services, currentUser }) => { await services.admin.updateMusicianStatus(currentUser!, params.musicianId!, await parseJsonBody(req, musicianStatusSchema)); return { status: 204 }; },
};

export const musicianDetailRoute: RouteDefinition = {
  method: 'GET', path: '/admin/musicians/:musicianId', summary: 'View musician activity and songs', requiresAuth: true,
  handler: async ({ params, services, currentUser }) => ({ status: 200, body: await services.admin.getMusician(currentUser!, params.musicianId!) }),
};