import pino, { type Logger } from 'pino';

const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function getLogger(bindings?: Record<string, string | number | boolean>): Logger {
  return bindings ? baseLogger.child(bindings) : baseLogger;
}