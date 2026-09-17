import { DefaultAzureCredential } from '@azure/identity';
import { createClient } from 'redis';
import { isDevelopmentEnvironment, requireSetting, type AppConfig } from '../../config.js';
import type { RedisClientLike, RedisConnectionProvider } from '../interfaces.js';

export class LocalRedisConnectionProvider implements RedisConnectionProvider {
  constructor(private readonly config: AppConfig) {}

  async createClient(): Promise<RedisClientLike> {
    const client = createClient({
      url: requireSetting('REDIS_URL', this.config.redisUrl),
    });
    await client.connect();
    return client as unknown as RedisClientLike;
  }

  describe(): string {
    return 'redis:local';
  }
}

export class ManagedIdentityRedisConnectionProvider implements RedisConnectionProvider {
  private readonly credential = new DefaultAzureCredential();

  constructor(private readonly config: AppConfig) {}

  async createClient(): Promise<RedisClientLike> {
    const token = await this.credential.getToken(this.config.redisAadScope);
    if (!token?.token) {
      throw new Error('Managed identity did not return a Redis access token');
    }

    const client = createClient({
      socket: this.config.redisTls
        ? {
            host: requireSetting('REDIS_HOST', this.config.redisHost),
            port: this.config.redisPort,
            tls: true,
          }
        : {
            host: requireSetting('REDIS_HOST', this.config.redisHost),
            port: this.config.redisPort,
          },
      username: requireSetting('REDIS_USER', this.config.redisUser),
      password: token.token,
    });
    await client.connect();
    return client as unknown as RedisClientLike;
  }

  describe(): string {
    return 'redis:managed-identity';
  }
}

export function createRedisConnectionProvider(config: AppConfig): RedisConnectionProvider {
  if (isDevelopmentEnvironment(config.environment)) {
    return new LocalRedisConnectionProvider(config);
  }

  return new ManagedIdentityRedisConnectionProvider(config);
}