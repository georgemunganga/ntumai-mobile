// @ts-nocheck
import type { AuthFlowStatus, AuthMachineContext, AuthMachineListener, AuthMachineState } from './types';

const DEFAULT_STATE: AuthMachineState = {
  status: 'idle',
  challenge: undefined,
  session: undefined,
  user: undefined,
  request: undefined,
  verification: undefined,
  error: null,
};

export class AuthStateMachine {
  private state: AuthMachineState = { ...DEFAULT_STATE };
  private listeners = new Set<AuthMachineListener>();

  getState(): AuthMachineState {
    return this.state;
  }

  subscribe(listener: AuthMachineListener): () => void {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  transition(status: AuthFlowStatus, patch: Partial<AuthMachineContext> = {}): AuthMachineState {
    const next: AuthMachineState = {
      ...this.state,
      ...patch,
      status,
      error: status === 'error' ? patch.error ?? 'Authentication error' : null,
    };

    if (status === 'idle') {
      next.challenge = undefined;
      next.session = undefined;
      next.user = undefined;
      next.request = undefined;
      next.verification = undefined;
      next.error = null;
    }

    if (status === 'requesting-challenge') {
      next.request = patch.request ?? this.state.request;
      next.error = null;
    }

    if (status === 'challenge-sent') {
      next.challenge = patch.challenge ?? this.state.challenge;
      next.request = patch.request ?? this.state.request;
      next.session = undefined;
      next.user = undefined;
      next.verification = undefined;
      next.error = null;
    }

    if (status === 'verifying') {
      next.verification = patch.verification ?? this.state.verification;
      next.error = null;
    }

    if (status === 'authenticated') {
      next.session = patch.session ?? this.state.session;
      next.user = patch.user ?? this.state.user;
      next.challenge = undefined;
      next.request = undefined;
      next.verification = undefined;
      next.error = null;
    }

    this.state = next;
    this.notify();
    return this.state;
  }

  reset(): void {
    this.state = { ...DEFAULT_STATE };
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const createAuthStateMachine = (): AuthStateMachine => new AuthStateMachine();

