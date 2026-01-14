import { useEffect, useRef } from 'react';

/**
 * A hook that locks body scroll when active
 * Useful for modals, drawers, and overlays
 * @param locked Whether scroll should be locked
 */
export function useScrollLock(locked: boolean): void {
  const originalStyle = useRef<string>('');

  useEffect(() => {
    if (!locked) return;

    // Save original body overflow style
    originalStyle.current = document.body.style.overflow;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Lock scroll and compensate for scrollbar
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyle.current;
      document.body.style.paddingRight = '';
    };
  }, [locked]);
}

/**
 * A hook that returns functions to manually control scroll lock
 */
export function useScrollLockControl(): {
  lock: () => void;
  unlock: () => void;
  isLocked: boolean;
} {
  const isLockedRef = useRef(false);
  const originalStyleRef = useRef<string>('');

  const lock = () => {
    if (isLockedRef.current) return;
    
    originalStyleRef.current = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    isLockedRef.current = true;
  };

  const unlock = () => {
    if (!isLockedRef.current) return;
    
    document.body.style.overflow = originalStyleRef.current;
    document.body.style.paddingRight = '';
    isLockedRef.current = false;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        document.body.style.overflow = originalStyleRef.current;
        document.body.style.paddingRight = '';
      }
    };
  }, []);

  return {
    lock,
    unlock,
    get isLocked() {
      return isLockedRef.current;
    }
  };
}
