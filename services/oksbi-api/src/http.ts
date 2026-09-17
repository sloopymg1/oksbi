import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';
import { type ZodTypeAny, type infer as ZodInfer } from 'zod';
import { toErrorResponse } from './errors/errorHandler.js';
import { getLogger } from './logger.js';
import { getServices } from './services/registry.js';
import type { ServiceRegistry } from './services/interfaces.js';
import type { User } from './shared.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface RouteContext {
  req: IncomingMessage;
  params: Record<string, string>;
  query: URLSearchParams;
  services: ServiceRegistry;
  requestId: string;
  currentUser: User | undefined;
}

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  summary: string;
  requiresAuth?: boolean;
  handler: (context: RouteContext) => Promise<RouteResponse>;
}

interface MatchedRoute {
  route: RouteDefinition;
  params: Record<string, string>;
}

export async function parseJsonBody<TSchema extends ZodTypeAny>(
  request: IncomingMessage,
  schema: TSchema,
): Promise<ZodInfer<TSchema>> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const rawBody = chunks.length > 0 ? Buffer.concat(chunks).toString('utf8') : '{}';
  const parsed = rawBody ? (JSON.parse(rawBody) as unknown) : {};
  return schema.parse(parsed);
}

export function parseQuery<TSchema extends ZodTypeAny>(searchParams: URLSearchParams, schema: TSchema): ZodInfer<TSchema> {
  const record = Object.fromEntries(searchParams.entries());
  return schema.parse(record);
}

export function createApiServer(routes: RouteDefinition[]) {
  return createServer(async (req, res) => {
    const requestId = randomUUID();
    const logger = getLogger({ requestId });
    const startedAt = Date.now();

    try {
      const method = (req.method?.toUpperCase() ?? 'GET') as HttpMethod;
      const requestUrl = new URL(req.url ?? '/', 'http://localhost');
      const matched = matchRoute(routes, method, requestUrl.pathname);

      if (!matched) {
        sendResponse(res, {
          status: 404,
          body: {
            error: {
              code: 'NOT_FOUND',
              message: `Route ${method} ${requestUrl.pathname} was not found`,
            },
          },
        });
        return;
      }

      const services = await getServices();
      const currentUser = matched.route.requiresAuth ? await services.auth.authenticateRequest(req) : undefined;

      const response = await matched.route.handler({
        req,
        params: matched.params,
        query: requestUrl.searchParams,
        services,
        requestId,
        currentUser,
      });

      sendResponse(res, response);
      logger.info({
        method,
        path: requestUrl.pathname,
        statusCode: response.status,
        durationMs: Date.now() - startedAt,
      }, matched.route.summary);
    } catch (error) {
      const response = toErrorResponse(error, logger);
      sendResponse(res, { status: response.status, body: response.body });
    }
  });
}

function sendResponse(response: ServerResponse, payload: RouteResponse): void {
  response.statusCode = payload.status;
  for (const [name, value] of Object.entries(payload.headers ?? {})) {
    response.setHeader(name, value);
  }

  if (payload.status === 204 || payload.body === undefined) {
    response.end();
    return;
  }

  if (typeof payload.body === 'string') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end(payload.body);
    return;
  }

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload.body));
}

function matchRoute(routes: RouteDefinition[], method: HttpMethod, pathname: string): MatchedRoute | null {
  const requestSegments = normalizePath(pathname).split('/');

  for (const route of routes) {
    if (route.method !== method) {
      continue;
    }

    const routeSegments = normalizePath(route.path).split('/');
    if (routeSegments.length !== requestSegments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let matched = true;

    for (const [index, segment] of routeSegments.entries()) {
      const requestSegment = requestSegments[index];
      if (segment.startsWith(':')) {
        if (requestSegment === undefined) {
          matched = false;
          break;
        }
        params[segment.slice(1)] = requestSegment;
        continue;
      }

      if (segment !== requestSegment) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return { route, params };
    }
  }

  return null;
}

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/(^\/+|\/+?$)/g, '');
  return trimmed.length > 0 ? trimmed : '';
}