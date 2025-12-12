import { useEffect, useMemo, useState } from 'react';
import { AuthCoordinator, createAuthCoordinator } from './coordinator';
import type { AuthDomainConfig, AuthMachineState } from './types';

export interface UseAuthDomainResult {
  state: AuthMachineState;
  coordinator: AuthCoordinator;
  isInitializing: boolean;
  initializationError: string | null;
  reinitialize: () => Promise<AuthMachineState>;
}

export const useAuthDomain = (
  config?: AuthDomainConfig,
  coordinator?: AuthCoordinator
): UseAuthDomainResult => {
  const configKey = useMemo(() => (config ? JSON.stringify(config) : 'default'), [config]);

  const authCoordinator = useMemo(
    () => coordinator ?? createAuthCoordinator(config),
    [coordinator, configKey]
  );

  const [state, setState] = useState<AuthMachineState>(authCoordinator.getState());
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = authCoordinator.subscribe((nextState) => {
      if (isMounted) {
        setState(nextState);
      }
    });

    const initialize = async () => {
      try {
        const initialState = await authCoordinator.initialize();
        if (!isMounted) return;
        setState(initialState);
        setInitializationError(null);
      } catch (error: any) {
        console.warn('[AuthDomain] Failed to initialize coordinator:', error);
        if (!isMounted) return;
        setInitializationError(error?.message ?? 'Failed to initialize authentication');
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [authCoordinator]);

  const reinitialize = async (): Promise<AuthMachineState> => {
    setIsInitializing(true);
    try {
      const initialState = await authCoordinator.initialize();
      setState(initialState);
      setInitializationError(null);
      return initialState;
    } catch (error: any) {
      console.warn('[AuthDomain] Failed to reinitialize coordinator:', error);
      setInitializationError(error?.message ?? 'Failed to initialize authentication');
      throw error;
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    state,
    coordinator: authCoordinator,
    isInitializing,
    initializationError,
    reinitialize,
  };
};
