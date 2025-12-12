// @ts-nocheck
// Navigation management hook
import { useCallback, useEffect, useState } from 'react';
import { useNavigation as useRNNavigation, useRoute, useFocusEffect, NavigationProp, RouteProp } from '@react-navigation/native';
import { BackHandler } from 'react-native';

// Navigation types
export interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  routeName: string;
  params: any;
  isLoading: boolean;
  isFocused: boolean;
}

export interface UseNavigationOptions {
  onFocus?: () => void;
  onBlur?: () => void;
  onBeforeRemove?: () => boolean | Promise<boolean>;
  handleBackPress?: () => boolean;
  preventGoBack?: boolean;
}

export interface UseNavigationResult {
  // Navigation state
  state: NavigationState;
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
  
  // Navigation actions
  goBack: () => void;
  goForward: () => void;
  navigate: (name: string, params?: any) => void;
  replace: (name: string, params?: any) => void;
  reset: (state: any) => void;
  push: (name: string, params?: any) => void;
  pop: (count?: number) => void;
  popToTop: () => void;
  
  // Utility functions
  setParams: (params: any) => void;
  setOptions: (options: any) => void;
  addListener: (type: string, callback: () => void) => () => void;
  
  // Route helpers
  getParam: <T = any>(key: string, defaultValue?: T) => T;
  hasParam: (key: string) => boolean;
  
  // Navigation guards
  canNavigate: () => boolean;
  confirmNavigation: (message?: string) => Promise<boolean>;
}

export const useNavigation = (options: UseNavigationOptions = {}): UseNavigationResult => {
  const {
    onFocus,
    onBlur,
    onBeforeRemove,
    handleBackPress,
    preventGoBack = false,
  } = options;

  const navigation = useRNNavigation();
  const route = useRoute();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Navigation state
  const state: NavigationState = {
    canGoBack: navigation.canGoBack(),
    canGoForward: false, // React Navigation doesn't have forward navigation
    routeName: route.name,
    params: route.params,
    isLoading,
    isFocused,
  };

  // Handle focus events
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      onFocus?.();
      
      return () => {
        setIsFocused(false);
        onBlur?.();
      };
    }, [onFocus, onBlur])
  );

  // Handle back button press
  useEffect(() => {
    if (!handleBackPress && !preventGoBack) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (preventGoBack) {
        return true; // Prevent default back action
      }
      
      if (handleBackPress) {
        return handleBackPress();
      }
      
      return false; // Allow default back action
    });

    return () => backHandler.remove();
  }, [handleBackPress, preventGoBack]);

  // Handle before remove event
  useEffect(() => {
    if (!onBeforeRemove) return;

    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      // Prevent default behavior
      e.preventDefault();
      
      try {
        const canRemove = await onBeforeRemove();
        if (canRemove) {
          // Re-enable the default behavior
          navigation.dispatch(e.data.action);
        }
      } catch (error) {
        console.error('Error in beforeRemove handler:', error);
      }
    });

    return unsubscribe;
  }, [navigation, onBeforeRemove]);

  // Navigation actions
  const goBack = useCallback(() => {
    if (navigation.canGoBack() && !preventGoBack) {
      setIsLoading(true);
      navigation.goBack();
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [navigation, preventGoBack]);

  const goForward = useCallback(() => {
    // React Navigation doesn't support forward navigation
    console.warn('Forward navigation is not supported in React Navigation');
  }, []);

  const navigate = useCallback((name: string, params?: any) => {
    setIsLoading(true);
    navigation.navigate(name, params);
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  const replace = useCallback((name: string, params?: any) => {
    setIsLoading(true);
    navigation.replace(name, params);
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  const reset = useCallback((resetState: any) => {
    setIsLoading(true);
    navigation.reset(resetState);
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  const push = useCallback((name: string, params?: any) => {
    setIsLoading(true);
    (navigation as any).push(name, params);
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  const pop = useCallback((count: number = 1) => {
    setIsLoading(true);
    (navigation as any).pop(count);
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  const popToTop = useCallback(() => {
    setIsLoading(true);
    (navigation as any).popToTop();
    setTimeout(() => setIsLoading(false), 100);
  }, [navigation]);

  // Utility functions
  const setParams = useCallback((params: any) => {
    navigation.setParams(params);
  }, [navigation]);

  const setOptions = useCallback((options: any) => {
    navigation.setOptions(options);
  }, [navigation]);

  const addListener = useCallback((type: string, callback: () => void) => {
    return navigation.addListener(type as any, callback);
  }, [navigation]);

  // Route helpers
  const getParam = useCallback(<T = any>(key: string, defaultValue?: T): T => {
    return route.params?.[key] ?? defaultValue;
  }, [route.params]);

  const hasParam = useCallback((key: string): boolean => {
    return route.params && key in route.params;
  }, [route.params]);

  // Navigation guards
  const canNavigate = useCallback((): boolean => {
    return !isLoading && !preventGoBack;
  }, [isLoading, preventGoBack]);

  const confirmNavigation = useCallback(async (message?: string): Promise<boolean> => {
    // This would typically show a confirmation dialog
    // For now, we'll just return true
    // In a real app, you'd integrate with a modal or alert system
    return new Promise((resolve) => {
      // Example: Alert.alert(
      //   'Confirm Navigation',
      //   message || 'Are you sure you want to leave this page?',
      //   [
      //     { text: 'Cancel', onPress: () => resolve(false) },
      //     { text: 'OK', onPress: () => resolve(true) },
      //   ]
      // );
      resolve(true);
    });
  }, []);

  return {
    // Navigation state
    state,
    navigation,
    route,
    
    // Navigation actions
    goBack,
    goForward,
    navigate,
    replace,
    reset,
    push,
    pop,
    popToTop,
    
    // Utility functions
    setParams,
    setOptions,
    addListener,
    
    // Route helpers
    getParam,
    hasParam,
    
    // Navigation guards
    canNavigate,
    confirmNavigation,
  };
};

// Specialized navigation hooks
export const useTabNavigation = () => {
  const navigation = useNavigation();
  
  const jumpTo = useCallback((name: string, params?: any) => {
    (navigation.navigation as any).jumpTo(name, params);
  }, [navigation.navigation]);
  
  return {
    ...navigation,
    jumpTo,
  };
};

export const useDrawerNavigation = () => {
  const navigation = useNavigation();
  
  const openDrawer = useCallback(() => {
    (navigation.navigation as any).openDrawer();
  }, [navigation.navigation]);
  
  const closeDrawer = useCallback(() => {
    (navigation.navigation as any).closeDrawer();
  }, [navigation.navigation]);
  
  const toggleDrawer = useCallback(() => {
    (navigation.navigation as any).toggleDrawer();
  }, [navigation.navigation]);
  
  return {
    ...navigation,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

export const useModalNavigation = () => {
  const navigation = useNavigation();
  
  const presentModal = useCallback((name: string, params?: any) => {
    navigation.navigate(name, params);
  }, [navigation]);
  
  const dismissModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  return {
    ...navigation,
    presentModal,
    dismissModal,
  };
};

// Navigation history hook
export const useNavigationHistory = () => {
  const [history, setHistory] = useState<Array<{ name: string; params?: any }>>([]);
  const navigation = useNavigation();
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentRoute = navigation.route;
      setHistory(prev => [
        ...prev,
        { name: currentRoute.name, params: currentRoute.params },
      ]);
    });
    
    return unsubscribe;
  }, [navigation]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);
  
  const getLastRoute = useCallback(() => {
    return history[history.length - 2]; // -1 is current, -2 is previous
  }, [history]);
  
  return {
    history,
    clearHistory,
    getLastRoute,
  };
};

// Deep linking hook
export const useDeepLinking = () => {
  const navigation = useNavigation();
  
  const handleDeepLink = useCallback((url: string) => {
    // Parse the URL and navigate accordingly
    // This is a simplified example
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const searchParams = Object.fromEntries(urlObj.searchParams);
      
      // Example routing logic
      if (pathname.startsWith('/restaurant/')) {
        const restaurantId = pathname.split('/')[2];
        navigation.navigate('RestaurantDetail', { id: restaurantId, ...searchParams });
      } else if (pathname.startsWith('/order/')) {
        const orderId = pathname.split('/')[2];
        navigation.navigate('OrderDetail', { id: orderId, ...searchParams });
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
      navigation.navigate('Home');
    }
  }, [navigation]);
  
  const generateDeepLink = useCallback((routeName: string, params?: any): string => {
    // Generate a deep link URL for the given route and params
    const baseUrl = 'ntumai://'; // Your app's URL scheme
    
    switch (routeName) {
      case 'RestaurantDetail':
        return `${baseUrl}restaurant/${params?.id || ''}`;
      case 'OrderDetail':
        return `${baseUrl}order/${params?.id || ''}`;
      default:
        return baseUrl;
    }
  }, []);
  
  return {
    handleDeepLink,
    generateDeepLink,
  };
};
