import { AppError } from './AppError.js';

export class ValidationAppError extends AppError {
  constructor(message: string, details?: Record<string, unknown> | null) {
    super(422, 'VALIDATION_ERROR', message, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, 'BAD_REQUEST', message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} '${id}' was not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, 'FORBIDDEN', message);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(503, 'SERVICE_UNAVAILABLE', message);
  }
}