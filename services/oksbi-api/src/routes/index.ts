import type { RouteDefinition } from '../http.js';
import { adminOperationsRoute } from './adminOperations.js';
import { authCurrentUserRoute } from './authCurrentUser.js';
import { authLoginRoute } from './authLogin.js';
import { authLogoutRoute } from './authLogout.js';
import { authRegisterRoute } from './authRegister.js';
import { compositionsRoute } from './compositions.js';
import { healthRoute } from './health.js';
import { onboardingRoute } from './onboarding.js';
import { openApiRoute } from './openapi.js';
import { payoutsListRoute, payoutsRoute } from './payouts.js';
import { recordingsRoute } from './recordings.js';
import { releasesRoute } from './releases.js';
import { rightsSplitsListRoute, rightsSplitsRoute } from './rightsSplits.js';
import { royaltiesStatementsRoute } from './royaltiesStatements.js';
import { smartLinksRoute } from './smartLinks.js';
import { supportListRoute, supportRoute } from './support.js';
import { takedownsRoute } from './takedowns.js';

export const routes: RouteDefinition[] = [
  healthRoute,
  authRegisterRoute,
  authLoginRoute,
  authCurrentUserRoute,
  authLogoutRoute,
  onboardingRoute,
  releasesRoute,
  recordingsRoute,
  compositionsRoute,
  rightsSplitsRoute,
  rightsSplitsListRoute,
  royaltiesStatementsRoute,
  payoutsRoute,
  payoutsListRoute,
  smartLinksRoute,
  supportRoute,
  supportListRoute,
  takedownsRoute,
  adminOperationsRoute,
  openApiRoute,
];