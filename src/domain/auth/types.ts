// @ts-nocheck
import type { AuthChallengeResponse, AuthSession } from '@/src/api/modules/auth';
import type { AuthChallengeRequest, AuthChallengeVerificationRequest } from '@/src/api/modules/auth';
import type { User } from '@/src/api/types';

export type AuthFlowStatus =
  | 'idle'
  | 'requesting-challenge'
  | 'challenge-sent'
  | 'verifying'
  | 'authenticated'
  | 'error';

export interface AuthMachineContext {
  challenge?: AuthChallengeResponse;
  session?: AuthSession;
  user?: User;
  request?: AuthChallengeRequest;
  verification?: AuthChallengeVerificationRequest;
  error?: string | null;
}

export interface AuthMachineState extends AuthMachineContext {
  status: AuthFlowStatus;
}

export type AuthMachineListener = (state: AuthMachineState) => void;

export interface AuthDomainConfig {
  persistence?: {
    enabled: boolean;
    storageKey?: string;
    version?: number;
  };
}

export interface PersistedAuthSnapshot {
  session?: AuthSession;
  user?: User;
  challenge?: AuthChallengeResponse;
  request?: AuthChallengeRequest;
  updatedAt: string;
}

