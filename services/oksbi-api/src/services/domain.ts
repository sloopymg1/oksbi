import { ForbiddenError, NotFoundError } from '../errors/errorTypes.js';
import { randomUUID } from 'node:crypto';
import type {
  AdminService,
  CompositionService,
  DatabaseService,
  OnboardingService,
  PayoutService,
  RecordingService,
  ReleaseService,
  RightsService,
  RoyaltyService,
  SmartLinkService,
  SupportService,
  TakedownService,
} from './interfaces.js';
import type {
  AdminOperation,
  AdminOperationRequest,
  Composition,
  CompositionUpsertRequest,
  OnboardingProfile,
  OnboardingRequest,
  PayoutRequest,
  PayoutRequestBody,
  Recording,
  RecordingUpsertRequest,
  Release,
  ReleaseUpsertRequest,
  RightsSplit,
  RightsSplitUpdateRequest,
  RoyaltyStatement,
  RoyaltyStatementQuery,
  SmartLink,
  SmartLinkRequestBody,
  SupportCase,
  SupportCaseRequestBody,
  TakedownRequest,
  TakedownRequestBody,
  MusicianStatusRequest,
  MusicSubmission,
  User,
} from '../shared.js';
import { createAuditFields, touchAuditFields } from '../utils/records.js';

function withoutUndefined(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, candidate]) => candidate !== undefined));
}

class OwnedEntityService {
  constructor(protected readonly database: DatabaseService) {}

  protected async ensureOwned<T extends { ownerUserId?: string; userId?: string }>(
    collection: string,
    id: string,
    actor: User,
  ): Promise<T> {
    const entity = await this.database.findById<T>(collection, id);
    if (!entity) {
      throw new NotFoundError(collection, id);
    }

    const ownerId = entity.ownerUserId ?? entity.userId;
    if (ownerId && ownerId !== actor.id && !actor.roles.includes('admin')) {
      throw new ForbiddenError();
    }

    return entity;
  }
}

export class DefaultOnboardingService extends OwnedEntityService implements OnboardingService {
  async upsert(actor: User, input: OnboardingRequest): Promise<OnboardingProfile> {
    if (input.status === 'approved' && !actor.roles.includes('admin')) throw new ForbiddenError('Only OKSBI can approve membership.');
    const existing = await this.database.findFirst<OnboardingProfile>('onboardingProfile', { userId: actor.id });
    if (existing) {
      const updated = await this.database.update<OnboardingProfile>('onboardingProfile', existing.id, {
        ...input,
        ...touchAuditFields(actor),
      });
      return updated ?? existing;
    }

    return this.database.create<OnboardingProfile>('onboardingProfile', {
      ...createAuditFields(actor),
      userId: actor.id,
      ...input,
    });
  }
}

export class DefaultReleaseService extends OwnedEntityService implements ReleaseService {
  async list(actor: User): Promise<Release[]> {
    return this.database.findMany<Release>('release', {
      filter: { ownerUserId: actor.id },
      orderBy: 'releaseDate',
      orderDirection: 'desc',
    });
  }

  async upsert(actor: User, input: ReleaseUpsertRequest): Promise<Release> {
    return this.database.transaction(async (transaction) => {
      if (input.id) {
        const { id: _id, ...releaseChanges } = input;
        await this.ensureOwned<Release>('release', input.id, actor);
        const releaseUpdate = {
          ...withoutUndefined(releaseChanges),
          ...touchAuditFields(actor),
        } as Partial<Release>;
        const updated = await transaction.update<Release>('release', input.id, releaseUpdate);
        if (!updated) {
          throw new NotFoundError('release', input.id);
        }

        return updated;
      }

      const { id: _id, ...releaseValues } = input;
      const releaseCreate = {
        ...createAuditFields(actor),
        ownerUserId: actor.id,
        ...withoutUndefined(releaseValues),
      } as Release;
      return transaction.create<Release>('release', releaseCreate);
    });
  }
}

export class DefaultRecordingService extends OwnedEntityService implements RecordingService {
  async list(actor: User, releaseId?: string): Promise<Recording[]> {
    if (releaseId) {
      const release = await this.ensureOwned<Release>('release', releaseId, actor);
      return this.database.findMany<Recording>('recording', { filter: { releaseId: release.id } });
    }

    const releases = await this.database.findMany<Release>('release', { filter: { ownerUserId: actor.id } });
    if (releases.length === 0) {
      return [];
    }

    const allRecordings = await Promise.all(releases.map((release) => this.database.findMany<Recording>('recording', { filter: { releaseId: release.id } })));
    return allRecordings.flat();
  }

  async upsert(actor: User, input: RecordingUpsertRequest): Promise<Recording> {
    await this.ensureOwned<Release>('release', input.releaseId, actor);
    return this.database.transaction(async (transaction) => {
      if (input.id) {
        const { id: _id, ...recordingChanges } = input;
        const existing = await transaction.findById<Recording>('recording', input.id);
        if (!existing) {
          throw new NotFoundError('recording', input.id);
        }

        const recordingUpdate = {
          ...withoutUndefined(recordingChanges),
          ...touchAuditFields(actor),
        } as Partial<Recording>;
        const updated = await transaction.update<Recording>('recording', input.id, recordingUpdate);
        if (!updated) {
          throw new NotFoundError('recording', input.id);
        }

        return updated;
      }

      const { id: _id, ...recordingValues } = input;
      const recordingCreate = {
        ...createAuditFields(actor),
        ...withoutUndefined(recordingValues),
      } as Recording;
      return transaction.create<Recording>('recording', recordingCreate);
    });
  }
}

export class DefaultCompositionService extends OwnedEntityService implements CompositionService {
  async list(actor: User): Promise<Composition[]> {
    return this.database.findMany<Composition>('composition', { filter: { ownerUserId: actor.id } });
  }

  async upsert(actor: User, input: CompositionUpsertRequest): Promise<Composition> {
    return this.database.transaction(async (transaction) => {
      if (input.id) {
        const { id: _id, ...compositionChanges } = input;
        await this.ensureOwned<Composition>('composition', input.id, actor);
        const compositionUpdate = {
          ...withoutUndefined(compositionChanges),
          ...touchAuditFields(actor),
        } as Partial<Composition>;
        const updated = await transaction.update<Composition>('composition', input.id, compositionUpdate);
        if (!updated) {
          throw new NotFoundError('composition', input.id);
        }

        return updated;
      }

      const { id: _id, ...compositionValues } = input;
      const compositionCreate = {
        ...createAuditFields(actor),
        ownerUserId: actor.id,
        ...withoutUndefined(compositionValues),
      } as Composition;
      return transaction.create<Composition>('composition', compositionCreate);
    });
  }
}

export class DefaultRightsService extends OwnedEntityService implements RightsService {
  async list(actor: User): Promise<RightsSplit[]> {
    const compositions = await this.database.findMany<Composition>('composition', { filter: { ownerUserId: actor.id } });
    if (compositions.length === 0) {
      return [];
    }

    return this.database.query<RightsSplit>(
      'SELECT * FROM rights_splits WHERE composition_id = ANY($1::text[]) ORDER BY updated_at DESC',
      [compositions.map((composition) => composition.id)],
    );
  }

  async saveSplit(actor: User, input: RightsSplitUpdateRequest): Promise<RightsSplit> {
    await this.ensureOwned<Composition>('composition', input.compositionId, actor);
    return this.database.transaction(async (transaction) => {
      if (input.id) {
        const { id: _id, ...splitChanges } = input;
        const updated = await transaction.update<RightsSplit>('rightsSplit', input.id, {
          ...splitChanges,
          ...touchAuditFields(actor),
        });
        if (!updated) {
          throw new NotFoundError('rightsSplit', input.id);
        }

        return updated;
      }

      const { id: _id, ...splitValues } = input;
      return transaction.create<RightsSplit>('rightsSplit', {
        ...createAuditFields(actor),
        ...splitValues,
      });
    });
  }
}

export class DefaultRoyaltyService extends OwnedEntityService implements RoyaltyService {
  async listStatements(actor: User, query: RoyaltyStatementQuery): Promise<RoyaltyStatement[]> {
    const organizationId = query.organizationId ?? actor.organizationId;
    return this.database.findMany<RoyaltyStatement>('royaltyStatement', {
      filter: {
        ...(organizationId ? { organizationId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      limit: query.limit,
      offset: query.offset,
      orderBy: 'statementMonth',
      orderDirection: 'desc',
    });
  }
}

export class DefaultPayoutService extends OwnedEntityService implements PayoutService {
  async list(actor: User): Promise<PayoutRequest[]> {
    return this.database.findMany<PayoutRequest>('payoutRequest', {
      filter: { userId: actor.id },
      orderBy: 'createdAt',
      orderDirection: 'desc',
    });
  }

  async createRequest(actor: User, input: PayoutRequestBody): Promise<PayoutRequest> {
    return this.database.create<PayoutRequest>('payoutRequest', {
      ...createAuditFields(actor),
      userId: actor.id,
      status: 'pending',
      ...input,
    });
  }
}

export class DefaultSmartLinkService extends OwnedEntityService implements SmartLinkService {
  async upsert(actor: User, input: SmartLinkRequestBody): Promise<SmartLink> {
    await this.ensureOwned<Release>('release', input.releaseId, actor);
    return this.database.transaction(async (transaction) => {
      if (input.id) {
        const { id: _id, ...smartLinkChanges } = input;
        const updated = await transaction.update<SmartLink>('smartLink', input.id, {
          ...smartLinkChanges,
          ...touchAuditFields(actor),
        });
        if (!updated) {
          throw new NotFoundError('smartLink', input.id);
        }

        return updated;
      }

      const { id: _id, ...smartLinkValues } = input;
      return transaction.create<SmartLink>('smartLink', {
        ...createAuditFields(actor),
        ...smartLinkValues,
      });
    });
  }
}

export class DefaultSupportService extends OwnedEntityService implements SupportService {
  async list(actor: User): Promise<SupportCase[]> {
    return this.database.findMany<SupportCase>('supportCase', {
      filter: { userId: actor.id },
      orderBy: 'updatedAt',
      orderDirection: 'desc',
    });
  }

  async createCase(actor: User, input: SupportCaseRequestBody): Promise<SupportCase> {
    return this.database.create<SupportCase>('supportCase', {
      ...createAuditFields(actor),
      userId: actor.id,
      status: 'open',
      ...input,
    });
  }
}

export class DefaultTakedownService extends OwnedEntityService implements TakedownService {
  async createRequest(actor: User, input: TakedownRequestBody): Promise<TakedownRequest> {
    return this.database.create<TakedownRequest>('takedownRequest', {
      ...createAuditFields(actor),
      userId: actor.id,
      status: 'submitted',
      ...input,
    });
  }
}

export class DefaultAdminService extends OwnedEntityService implements AdminService {
  constructor(database: DatabaseService) {
    super(database);
  }

  async recordOperation(actor: User, input: AdminOperationRequest): Promise<AdminOperation> {
    if (!actor.roles.includes('admin')) {
      throw new ForbiddenError('Administrator role required');
    }

    const operationValues = {
      operationType: input.operationType,
      targetId: input.targetId,
      ...(input.notes ? { notes: input.notes } : {}),
    };

    return this.database.create<AdminOperation>('adminOperation', {
      ...createAuditFields(actor),
      actorUserId: actor.id,
      ...operationValues,
    });
  }

  async listMusicians(actor: User) {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Administrator role required');
    return this.database.query<{ id: string; email: string; displayName: string; createdAt: string; onboardingStatus: string; artistName?: string; countryCode?: string }>(
      `SELECT u.id, u.email, u.display_name, u.created_at, COALESCE(op.status, 'in_process') AS onboarding_status, op.artist_name, op.country_code
       FROM users u LEFT JOIN onboarding_profiles op ON op.user_id = u.id
       WHERE NOT ('admin' = ANY(u.roles)) ORDER BY u.created_at DESC`,
    );
  }

  async getMusician(actor: User, musicianId: string) {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Administrator role required');
    const musicians = await this.database.query<{ id: string; email: string; displayName: string; createdAt: string; onboardingStatus: string; artistName?: string; countryCode?: string }>(
      `SELECT u.id, u.email, u.display_name, u.created_at, COALESCE(op.status, 'in_process') AS onboarding_status, op.artist_name, op.country_code
       FROM users u LEFT JOIN onboarding_profiles op ON op.user_id = u.id
       WHERE u.id = $1 AND NOT ('admin' = ANY(u.roles))`,
      [musicianId],
    );
    const musician = musicians[0];
    if (!musician) throw new NotFoundError('Musician', musicianId);
    const songs = await this.database.findMany<MusicSubmission>('musicSubmission', { filter: { ownerUserId: musicianId }, orderBy: 'createdAt', orderDirection: 'desc' });
    return { musician, songs };
  }

  async updateMusicianStatus(actor: User, musicianId: string, input: MusicianStatusRequest): Promise<void> {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Administrator role required');
    const musician = await this.database.findById<User>('user', musicianId);
    if (!musician || musician.roles.includes('admin')) throw new ForbiddenError('Only musician accounts can be managed here.');
    const profile = await this.database.findFirst<{ id: string }>('onboardingProfile', { userId: musicianId });
    const timestamp = new Date().toISOString();
    if (!profile) {
      await this.database.create('onboardingProfile', { id: randomUUID(), userId: musicianId, organizationName: 'Independent', artistName: musician.displayName, countryCode: 'XX', taxResidenceCountry: 'XX', status: input.status, createdAt: timestamp, updatedAt: timestamp, createdBy: actor.id, updatedBy: actor.id });
      return;
    }
    await this.database.update('onboardingProfile', profile.id, { status: input.status, updatedAt: timestamp, updatedBy: actor.id });
  }
}