import { randomUUID } from 'node:crypto';
import type { User } from '../shared.js';

export function nowIso(): string {
  return new Date().toISOString();
}

export function createAuditFields(actor?: User): { id: string; createdAt: string; updatedAt: string; createdBy?: string; updatedBy?: string } {
  const timestamp = nowIso();
  const auditFields: { id: string; createdAt: string; updatedAt: string; createdBy?: string; updatedBy?: string } = {
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (actor?.id) {
    auditFields.createdBy = actor.id;
    auditFields.updatedBy = actor.id;
  }

  return auditFields;
}

export function touchAuditFields(actor?: User): { updatedAt: string; updatedBy?: string } {
  const auditFields: { updatedAt: string; updatedBy?: string } = {
    updatedAt: nowIso(),
  };

  if (actor?.id) {
    auditFields.updatedBy = actor.id;
  }

  return auditFields;
}