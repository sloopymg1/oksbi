import type { ErrorCode } from '../shared.js';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown> | null;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: Record<string, unknown> | null) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
  }
}