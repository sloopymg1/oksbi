import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface AppConfig {
  environment: string;
  port: number;
  appBaseUrl: string;
  authJwtSecret: string | undefined;
  authJwtIssuer: string;
  authJwtAudience: string;
  databaseUrl: string | undefined;
  postgresHost: string | undefined;
  postgresPort: number;
  postgresDatabase: string | undefined;
  postgresUser: string | undefined;
  postgresSslMode: 'disable' | 'require';
  azuriteConnectionString: string | undefined;
  azureStorageAccount: string | undefined;
  redisUrl: string | undefined;
  redisHost: string | undefined;
  redisPort: number;
  redisTls: boolean;
  redisAadScope: string;
  redisUser: string | undefined;
}

export function requireSetting(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadConfig(): AppConfig {
  const localSettings = loadLocalSettings();
  const setting = (name: string, fallback?: string): string | undefined => process.env[name] ?? localSettings[name] ?? fallback;

  return {
    environment: setting('AZURE_FUNCTIONS_ENVIRONMENT', 'Production')!,
    port: Number(setting('PORT', '7071')),
    appBaseUrl: setting('APP_BASE_URL', 'http://localhost:7071')!,
    authJwtSecret: setting('AUTH_JWT_SECRET'),
    authJwtIssuer: setting('AUTH_JWT_ISSUER', 'oksbi-api')!,
    authJwtAudience: setting('AUTH_JWT_AUDIENCE', 'oksbi-app')!,
    databaseUrl: setting('DATABASE_URL'),
    postgresHost: setting('POSTGRES_HOST'),
    postgresPort: Number(setting('POSTGRES_PORT', '5432')),
    postgresDatabase: setting('POSTGRES_DATABASE'),
    postgresUser: setting('POSTGRES_USER'),
    postgresSslMode: setting('POSTGRES_SSL_MODE') === 'disable' ? 'disable' : 'require',
    azuriteConnectionString: setting('AZURITE_CONNECTION_STRING'),
    azureStorageAccount: setting('AZURE_STORAGE_ACCOUNT'),
    redisUrl: setting('REDIS_URL'),
    redisHost: setting('REDIS_HOST'),
    redisPort: Number(setting('REDIS_PORT', '6380')),
    redisTls: setting('REDIS_TLS') !== 'false',
    redisAadScope: setting('REDIS_AAD_SCOPE', 'https://redis.azure.com/.default')!,
    redisUser: setting('REDIS_USER'),
  };
}

function loadLocalSettings(): Record<string, string> {
  try {
    const raw = JSON.parse(readFileSync(resolve('local.settings.json'), 'utf8')) as { Values?: Record<string, unknown> };
    return Object.fromEntries(Object.entries(raw.Values ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
  } catch {
    return {};
  }
}

export function isDevelopmentEnvironment(environment: string): boolean {
  return environment === 'Development';
}