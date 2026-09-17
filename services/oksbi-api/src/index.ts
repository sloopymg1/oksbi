import { createApiServer } from './http.js';
import { getLogger } from './logger.js';
import { routes } from './routes/index.js';
import { getServices } from './services/registry.js';

async function main(): Promise<void> {
  const services = await getServices();
  const logger = getLogger({ component: 'bootstrap' });
  const server = createApiServer(routes);
  server.listen(services.config.port, () => {
    logger.info({ port: services.config.port }, 'OKSBI API listening');
  });
}

main().catch((error: unknown) => {
  const logger = getLogger({ component: 'bootstrap' });
  logger.error({ error }, 'Failed to start OKSBI API');
  process.exitCode = 1;
});