import { DefaultAzureCredential } from '@azure/identity';
import { Pool } from 'pg';
import { isDevelopmentEnvironment, requireSetting, type AppConfig } from '../../config.js';
import type { DatabaseConnectionProvider } from '../interfaces.js';

export class LocalPostgresConnectionProvider implements DatabaseConnectionProvider {
  constructor(private readonly config: AppConfig) {}

  async createPool(): Promise<Pool> {
    return new Pool({
      connectionString: requireSetting('DATABASE_URL', this.config.databaseUrl),
    });
  }

  describe(): string {
    return 'postgresql:local';
  }
}

export class ManagedIdentityPostgresConnectionProvider implements DatabaseConnectionProvider {
  private readonly credential = new DefaultAzureCredential();

  constructor(private readonly config: AppConfig) {}

  async createPool(): Promise<Pool> {
    const token = await this.credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
    if (!token?.token) {
      throw new Error('Managed identity did not return a PostgreSQL access token');
    }

    return new Pool({
      host: requireSetting('POSTGRES_HOST', this.config.postgresHost),
      port: this.config.postgresPort,
      database: requireSetting('POSTGRES_DATABASE', this.config.postgresDatabase),
      user: requireSetting('POSTGRES_USER', this.config.postgresUser),
      password: token.token,
      ssl: this.config.postgresSslMode === 'require' ? { rejectUnauthorized: false } : false,
    });
  }

  describe(): string {
    return 'postgresql:managed-identity';
  }
}

export function createPostgresConnectionProvider(config: AppConfig): DatabaseConnectionProvider {
  if (isDevelopmentEnvironment(config.environment)) {
    return new LocalPostgresConnectionProvider(config);
  }

  return new ManagedIdentityPostgresConnectionProvider(config);
}