import { loadConfig } from '../config.js';
import { getLogger } from '../logger.js';
import { SessionAuthService } from './auth.js';
import {
  DefaultAdminService,
  DefaultCompositionService,
  DefaultOnboardingService,
  DefaultPayoutService,
  DefaultRecordingService,
  DefaultReleaseService,
  DefaultRightsService,
  DefaultRoyaltyService,
  DefaultSmartLinkService,
  DefaultSupportService,
  DefaultTakedownService,
} from './domain.js';
import { BlobStorageService, PostgresDatabaseService, RedisCacheService } from './infrastructure.js';
import type { ServiceRegistry } from './interfaces.js';
import { createBlobClientProvider } from './providers/blob.js';
import { createPostgresConnectionProvider } from './providers/postgres.js';
import { createRedisConnectionProvider } from './providers/redis.js';

let services: ServiceRegistry | null = null;

export function registerServices(nextServices: ServiceRegistry): void {
  services = nextServices;
}

export function clearServices(): void {
  services = null;
}

export async function getServices(): Promise<ServiceRegistry> {
  if (!services) {
    services = await initializeServices();
  }

  return services;
}

async function initializeServices(): Promise<ServiceRegistry> {
  const config = loadConfig();
  const logger = getLogger({ component: 'registry' });

  const database = new PostgresDatabaseService(
    createPostgresConnectionProvider(config),
    logger.child({ provider: 'postgres' }),
  );
  const storage = new BlobStorageService(
    createBlobClientProvider(config),
    logger.child({ provider: 'blob' }),
  );
  const cache = new RedisCacheService(
    createRedisConnectionProvider(config),
    logger.child({ provider: 'redis' }),
  );
  const auth = new SessionAuthService(database, cache, config);

  return {
    config,
    database,
    storage,
    cache,
    auth,
    onboarding: new DefaultOnboardingService(database),
    releases: new DefaultReleaseService(database),
    recordings: new DefaultRecordingService(database),
    compositions: new DefaultCompositionService(database),
    rights: new DefaultRightsService(database),
    royalties: new DefaultRoyaltyService(database),
    payouts: new DefaultPayoutService(database),
    smartLinks: new DefaultSmartLinkService(database),
    support: new DefaultSupportService(database),
    takedowns: new DefaultTakedownService(database),
    admin: new DefaultAdminService(database),
  };
}