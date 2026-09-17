import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { ConflictError, UnauthorizedError } from '../errors/errorTypes.js';
import type {
  AuthService,
  CacheService,
  DatabaseService,
} from './interfaces.js';
import type {
  LoginRequest,
  RegisterRequest,
  Session,
  User,
} from '../shared.js';
import type { AppConfig } from '../config.js';
import { requireSetting } from '../config.js';
import { parseCookies } from '../utils/cookies.js';
import { nowIso } from '../utils/records.js';

interface PersistedUser extends User {
  passwordHash: string;
}

interface SessionTokenPayload {
  sessionId: string;
  sub: string;
}

function sessionCacheKey(sessionId: string): string {
  return `session:${sessionId}`;
}

function safeUser(user: PersistedUser): User {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export class SessionAuthService implements AuthService {
  private readonly signingKey: Uint8Array;

  constructor(
    private readonly database: DatabaseService,
    private readonly cache: CacheService,
    private readonly config: AppConfig,
  ) {
    this.signingKey = new TextEncoder().encode(requireSetting('AUTH_JWT_SECRET', this.config.authJwtSecret));
  }

  async register(input: RegisterRequest) {
    const existing = await this.database.findFirst<PersistedUser>('user', { email: input.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('A user with that email already exists');
    }

    const timestamp = nowIso();
    const user: PersistedUser = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      roles: ['creator'],
      onboardingCompleted: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      passwordHash: await bcrypt.hash(input.password, 12),
    };

    await this.database.create('user', user as unknown as Record<string, unknown>);
    return this.issueSession(user);
  }

  async login(input: LoginRequest) {
    const user = await this.database.findFirst<PersistedUser>('user', { email: input.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return this.issueSession(user);
  }

  async authenticateRequest(request: IncomingMessage): Promise<User> {
    const token = this.resolveToken(request);
    if (!token) {
      throw new UnauthorizedError();
    }

    const verification = await jwtVerify<SessionTokenPayload>(token, this.signingKey, {
      issuer: this.config.authJwtIssuer,
      audience: this.config.authJwtAudience,
    });

    const sessionId = verification.payload.sessionId;
    const userId = verification.payload.sub;
    if (!sessionId || !userId) {
      throw new UnauthorizedError('Malformed session token');
    }

    const cachedSession = await this.cache.get<Session>(sessionCacheKey(sessionId));
    if (!cachedSession || cachedSession.revokedAt) {
      throw new UnauthorizedError('Session is no longer active');
    }

    const user = await this.database.findById<PersistedUser>('user', userId);
    if (!user) {
      throw new UnauthorizedError('Session user no longer exists');
    }

    return safeUser(user);
  }

  async logout(request: IncomingMessage): Promise<void> {
    const token = this.resolveToken(request);
    if (!token) {
      return;
    }

    const verification = await jwtVerify<SessionTokenPayload>(token, this.signingKey, {
      issuer: this.config.authJwtIssuer,
      audience: this.config.authJwtAudience,
    });

    const sessionId = verification.payload.sessionId;
    if (!sessionId) {
      return;
    }

    await this.cache.delete(sessionCacheKey(sessionId));
    await this.database.update('session', sessionId, { revokedAt: nowIso(), updatedAt: nowIso() });
  }

  private async issueSession(user: PersistedUser) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
    const session: Session = {
      id: sessionId,
      userId: user.id,
      expiresAt,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await this.database.create('session', session as unknown as Record<string, unknown>);
    await this.cache.set(sessionCacheKey(sessionId), session, 60 * 60 * 12);

    const accessToken = await new SignJWT({ sessionId })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuer(this.config.authJwtIssuer)
      .setAudience(this.config.authJwtAudience)
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(this.signingKey);

    return {
      user: safeUser(user),
      accessToken,
      cookieHeader: `oksbi_session=${accessToken}; HttpOnly; Path=/; SameSite=Lax${this.config.appBaseUrl.startsWith('https://') ? '; Secure' : ''}`,
    };
  }

  private resolveToken(request: IncomingMessage): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length);
    }

    return parseCookies(request.headers.cookie).oksbi_session;
  }
}