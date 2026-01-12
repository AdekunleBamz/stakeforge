import { useState, useCallback, useEffect } from 'react';

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Setter function that handles both direct values and updater functions
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        return nextValue;
      });
    },
    []
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
}

// Type-safe storage keys for the app
export const STORAGE_KEYS = {
  THEME: 'stakeforge_theme',
  WALLET_ADDRESS: 'stakeforge_wallet',
  RECENT_TRANSACTIONS: 'stakeforge_recent_txs',
  USER_PREFERENCES: 'stakeforge_preferences',
} as const;

// User preferences interface
export interface UserPreferences {
  autoConnect: boolean;
  showTestNetWarning: boolean;
  defaultGasPreset: 'low' | 'medium' | 'high';
  notificationsEnabled: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  autoConnect: true,
  showTestNetWarning: true,
  defaultGasPreset: 'low',
  notificationsEnabled: true,
};
