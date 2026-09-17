import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { isDevelopmentEnvironment, requireSetting, type AppConfig } from '../../config.js';
import type { BlobClientProvider } from '../interfaces.js';

export class LocalBlobClientProvider implements BlobClientProvider {
  constructor(private readonly config: AppConfig) {}

  getClient(): BlobServiceClient {
    return BlobServiceClient.fromConnectionString(
      requireSetting('AZURITE_CONNECTION_STRING', this.config.azuriteConnectionString),
    );
  }

  describe(): string {
    return 'blob:azurite';
  }
}

export class ManagedIdentityBlobClientProvider implements BlobClientProvider {
  private readonly credential = new DefaultAzureCredential();

  constructor(private readonly config: AppConfig) {}

  getClient(): BlobServiceClient {
    const account = requireSetting('AZURE_STORAGE_ACCOUNT', this.config.azureStorageAccount);
    return new BlobServiceClient(`https://${account}.blob.core.windows.net`, this.credential);
  }

  describe(): string {
    return 'blob:managed-identity';
  }
}

export function createBlobClientProvider(config: AppConfig): BlobClientProvider {
  if (isDevelopmentEnvironment(config.environment)) {
    return new LocalBlobClientProvider(config);
  }

  return new ManagedIdentityBlobClientProvider(config);
}