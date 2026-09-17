import type { Logger } from 'pino';
import { ZodError } from 'zod';
import type { ErrorResponse } from '../shared.js';
import { AppError } from './AppError.js';

function zodDetails(error: ZodError): Record<string, unknown> {
  return {
    issues: error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.join('.'),
    })),
  };
}

export function toErrorResponse(error: unknown, logger: Logger): { status: number; body: ErrorResponse } {
  if (error instanceof AppError) {
    logger.warn({ code: error.code, details: error.details }, error.message);
    return {
      status: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details ?? null,
        },
      },
    };
  }

  if (error instanceof ZodError) {
    logger.warn({ issues: error.issues }, 'Request validation failed');
    return {
      status: 422,
      body: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: zodDetails(error),
        },
      },
    };
  }

  logger.error({ error }, 'Unhandled request failure');
  return {
    status: 500,
    body: {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: null,
      },
    },
  };
}