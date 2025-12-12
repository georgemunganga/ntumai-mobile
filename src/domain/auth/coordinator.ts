// @ts-nocheck
import {
  requestChallenge,
  verifyChallenge,
  refreshSession,
  revokeSession,
  completePostAuthSync,
} from '../../api/modules/auth';
import type {
  AuthChallengeRequest,
  AuthChallengeResponse,
  AuthChallengeVerificationRequest,
  AuthSession,
} from '../../api/modules/auth';
import type {
  AuthMachineListener,
  AuthDomainConfig,
  AuthMachineState,
  PersistedAuthSnapshot,
} from './types';
import { AuthStateMachine } from './stateMachine';
import { storageManager } from '../../persistence';

class AuthStateRepository {
  private store;

  constructor(config?: AuthDomainConfig['persistence']) {
    const storageKey = config?.storageKey ?? 'auth.session';
    const version = config?.version ?? 1;
    this.store = storageManager.createStore<PersistedAuthSnapshot>(storageKey, undefined, {
      version,
    });
  }

  async load(): Promise<PersistedAuthSnapshot | null> {
    try {
      return await this.store.load();
    } catch (error) {
      console.warn('[AuthDomain] Failed to load persisted auth state:', error);
      return null;
    }
  }

  async save(snapshot: PersistedAuthSnapshot): Promise<void> {
    try {
      await this.store.save(snapshot);
    } catch (error) {
      console.warn('[AuthDomain] Failed to persist auth state:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.store.clear();
    } catch (error) {
      console.warn('[AuthDomain] Failed to clear persisted auth state:', error);
    }
  }
}

export class AuthCoordinator {
  private machine: AuthStateMachine;
  private repository?: AuthStateRepository;

  constructor(machine?: AuthStateMachine, config?: AuthDomainConfig) {
    this.machine = machine ?? new AuthStateMachine();

    if (config?.persistence?.enabled !== false) {
      this.repository = new AuthStateRepository(config.persistence);
    }
  }

  private async persistState(): Promise<void> {
    if (!this.repository) return;

    const state = this.machine.getState();
    const snapshot: PersistedAuthSnapshot = {
      updatedAt: new Date().toISOString(),
    };

    if (state.session) {
      snapshot.session = state.session;
    }

    if (state.user) {
      snapshot.user = state.user;
    }

    if (state.challenge) {
      snapshot.challenge = state.challenge;
    }

    if (state.request) {
      snapshot.request = state.request;
    }

    await this.repository.save(snapshot);
  }

  subscribe(listener: AuthMachineListener): () => void {
    return this.machine.subscribe(listener);
  }

  getState(): AuthMachineState {
    return this.machine.getState();
  }

  async initialize(): Promise<AuthMachineState> {
    if (!this.repository) {
      return this.machine.getState();
    }

    const snapshot = await this.repository.load();

    if (snapshot?.session && snapshot.user) {
      this.machine.transition('authenticated', {
        session: snapshot.session,
        user: snapshot.user,
        challenge: snapshot.challenge,
        request: snapshot.request,
      });
    } else if (snapshot?.challenge && snapshot.request) {
      this.machine.transition('challenge-sent', {
        challenge: snapshot.challenge,
        request: snapshot.request,
      });
    } else {
      this.machine.reset();
    }

    return this.machine.getState();
  }

  async startChallenge(request: AuthChallengeRequest): Promise<AuthChallengeResponse> {
    this.machine.transition('requesting-challenge', { request });

    try {
      const challenge = await requestChallenge(request);
      this.machine.transition('challenge-sent', { challenge, request });
      await this.persistState();
      return challenge;
    } catch (error: any) {
      this.machine.transition('error', { error: error?.message ?? 'Failed to request verification code' });
      await this.persistState();
      throw error;
    }
  }

  async verifyCode(request: AuthChallengeVerificationRequest): Promise<AuthMachineState> {
    this.machine.transition('verifying', { verification: request });

    try {
      const verification = await verifyChallenge(request);
      const result = await completePostAuthSync(verification);

      this.machine.transition('authenticated', {
        session: result.session,
        user: result.user,
      });

      await this.persistState();

      return this.machine.getState();
    } catch (error: any) {
      this.machine.transition('error', { error: error?.message ?? 'Verification failed' });
      await this.persistState();
      throw error;
    }
  }

  async refresh(): Promise<AuthSession> {
    const current = this.machine.getState();
    const refreshToken = current.session?.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const session = await refreshSession({ refreshToken });

    this.machine.transition('authenticated', {
      session,
    });

    await this.persistState();

    return session;
  }

  async logout(options?: { allDevices?: boolean }): Promise<void> {
    try {
      await revokeSession({ allDevices: options?.allDevices });
    } finally {
      this.machine.reset();
      if (this.repository) {
        await this.repository.clear();
      }
    }
  }

  clearError(): void {
    const current = this.machine.getState();
    if (current.status === 'error') {
      this.machine.transition('idle');
      void this.persistState();
    }
  }
}

export const createAuthCoordinator = (config?: AuthDomainConfig): AuthCoordinator =>
  new AuthCoordinator(new AuthStateMachine(), config);

