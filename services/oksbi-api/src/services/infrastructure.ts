import type { Logger } from 'pino';
import type { Pool, PoolClient, QueryResult } from 'pg';
import { ServiceUnavailableError } from '../errors/errorTypes.js';
import type {
  BlobClientProvider,
  CacheService,
  DatabaseConnectionProvider,
  DatabaseService,
  QueryOptions,
  RedisClientLike,
  RedisConnectionProvider,
  StorageService,
} from './interfaces.js';

type QueryExecutor = Pick<Pool, 'query'> | PoolClient;

const collectionTableMap: Record<string, string> = {
  musicSubmission: 'music_submissions',
  user: 'users',
  session: 'sessions',
  onboardingProfile: 'onboarding_profiles',
  release: 'releases',
  recording: 'recordings',
  composition: 'compositions',
  rightsSplit: 'rights_splits',
  royaltyStatement: 'royalty_statements',
  payoutRequest: 'payout_requests',
  smartLink: 'smart_links',
  supportCase: 'support_cases',
  takedownRequest: 'takedown_requests',
  adminOperation: 'admin_operations',
};

function toSnake(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function toCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function keysToSnake(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [toSnake(key), value]));
}

function keysToCamel<T>(record: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [toCamel(key), value])) as T;
}

function collectionToTable(collection: string): string {
  return collectionTableMap[collection] ?? `${toSnake(collection)}s`;
}

function stripManagedFields<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  const clone = { ...data };
  delete clone.id;
  delete clone.createdAt;
  delete clone.updatedAt;
  return clone;
}

export class PostgresDatabaseService implements DatabaseService {
  private poolPromise?: Promise<Pool>;

  constructor(
    private readonly provider: DatabaseConnectionProvider,
    private readonly logger: Logger,
    private readonly executor?: QueryExecutor,
  ) {}

  async findMany<T>(collection: string, options: QueryOptions = {}): Promise<T[]> {
    const table = collectionToTable(collection);
    const filterEntries = Object.entries(options.filter ?? {});
    const params: unknown[] = [];
    const where = filterEntries.length > 0
      ? ` WHERE ${filterEntries.map(([key, value], index) => {
          params.push(value);
          return `${toSnake(key)} = $${index + 1}`;
        }).join(' AND ')}`
      : '';
    const orderBy = options.orderBy ? ` ORDER BY ${toSnake(options.orderBy)} ${options.orderDirection ?? 'asc'}` : '';
    const limit = options.limit ? ` LIMIT ${options.limit}` : '';
    const offset = options.offset ? ` OFFSET ${options.offset}` : '';
    const result = await this.execute<Record<string, unknown>>(`SELECT * FROM ${table}${where}${orderBy}${limit}${offset}`, params);
    return result.rows.map((row: Record<string, unknown>) => keysToCamel<T>(row));
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const table = collectionToTable(collection);
    const result = await this.execute<Record<string, unknown>>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0] ? keysToCamel<T>(result.rows[0]) : null;
  }

  async findFirst<T>(collection: string, filter: Record<string, unknown>): Promise<T | null> {
    const rows = await this.findMany<T>(collection, { filter, limit: 1 });
    return rows[0] ?? null;
  }

  async create<T>(collection: string, data: T): Promise<T> {
    const table = collectionToTable(collection);
    const record = data as Record<string, unknown>;
    const payload = keysToSnake(stripManagedFields(record));
    const columns = Object.keys(payload);
    const values = Object.values(payload);
    const params = columns.map((_, index) => `$${index + 1}`).join(', ');
    const result = await this.execute<Record<string, unknown>>(
      `INSERT INTO ${table} (id, created_at, updated_at, ${columns.join(', ')}) VALUES ($${values.length + 1}, $${values.length + 2}, $${values.length + 3}, ${params}) RETURNING *`,
      [...values, record.id, record.createdAt, record.updatedAt],
    );
    return keysToCamel<T>(result.rows[0] ?? {});
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const table = collectionToTable(collection);
    const payload = keysToSnake(stripManagedFields(data as Record<string, unknown>));
    const entries = Object.entries(payload);
    if (entries.length === 0) {
      return this.findById<T>(collection, id);
    }

    const params = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);
    const result = await this.execute<Record<string, unknown>>(
      `UPDATE ${table} SET ${params}, updated_at = $${values.length + 1} WHERE id = $${values.length + 2} RETURNING *`,
      [...values, (data as Record<string, unknown>).updatedAt, id],
    );
    return result.rows[0] ? keysToCamel<T>(result.rows[0]) : null;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const table = collectionToTable(collection);
    const result = await this.execute(`DELETE FROM ${table} WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.execute<Record<string, unknown>>(sql, params);
    return result.rows.map((row: Record<string, unknown>) => keysToCamel<T>(row));
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.execute('SELECT 1');
      return true;
    } catch (error) {
      this.logger.warn({ error }, 'PostgreSQL health check failed');
      return false;
    }
  }

  async transaction<T>(fn: (transactionalDatabase: DatabaseService) => Promise<T>): Promise<T> {
    const pool = await this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const transactional = new PostgresDatabaseService(this.provider, this.logger, client);
      const result = await fn(transactional);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async getPool(): Promise<Pool> {
    if (!this.poolPromise) {
      this.poolPromise = this.provider.createPool();
    }

    return this.poolPromise;
  }

  private async getExecutor(): Promise<QueryExecutor> {
    if (this.executor) {
      return this.executor;
    }

    return this.getPool();
  }

  private async execute<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
    const executor = await this.getExecutor();
    return executor.query<T>(sql, params);
  }
}

export class BlobStorageService implements StorageService {
  constructor(private readonly provider: BlobClientProvider, private readonly logger: Logger) {}

  async uploadBuffer(container: string, blobName: string, data: Buffer, contentType?: string): Promise<string> {
    const containerClient = this.provider.getClient().getContainerClient(container);
    await containerClient.createIfNotExists();
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadData(
      data,
      contentType ? { blobHTTPHeaders: { blobContentType: contentType } } : {},
    );
    return blobClient.url;
  }

  async deleteObject(container: string, blobName: string): Promise<void> {
    const containerClient = this.provider.getClient().getContainerClient(container);
    await containerClient.deleteBlob(blobName);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.provider.getClient().getProperties();
      return true;
    } catch (error) {
      this.logger.warn({ error }, 'Blob health check failed');
      return false;
    }
  }
}

export class RedisCacheService implements CacheService {
  private clientPromise?: Promise<RedisClientLike>;

  constructor(private readonly provider: RedisConnectionProvider, private readonly logger: Logger) {}

  async get<T>(key: string): Promise<T | null> {
    const client = await this.getClient();
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const client = await this.getClient();
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await client.set(key, payload, { EX: ttlSeconds });
      return;
    }

    await client.set(key, payload);
  }

  async delete(key: string): Promise<void> {
    const client = await this.getClient();
    await client.del(key);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.ping();
      return true;
    } catch (error) {
      this.logger.warn({ error }, 'Redis health check failed');
      return false;
    }
  }

  private async getClient(): Promise<RedisClientLike> {
    if (!this.clientPromise) {
      this.clientPromise = this.provider.createClient().catch((error: unknown) => {
        this.logger.error({ error }, 'Redis client initialization failed');
        throw new ServiceUnavailableError('Redis client initialization failed');
      });
    }

    return this.clientPromise;
  }
}