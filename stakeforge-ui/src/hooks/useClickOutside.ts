import { useEffect, useRef, RefObject } from 'react';

/**
 * A hook that triggers a callback when clicking outside of the referenced element
 * @param callback The function to call when clicking outside
 * @param enabled Whether the hook is active (default: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    // Use mousedown for immediate response before the click completes
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);

  return ref;
}

/**
 * A hook that triggers a callback when clicking outside of multiple elements
 * @param refs Array of refs to check against
 * @param callback The function to call when clicking outside all refs
 * @param enabled Whether the hook is active (default: true)
 */
export function useClickOutsideMultiple(
  refs: RefObject<HTMLElement>[],
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const isOutside = refs.every(
        ref => ref.current && !ref.current.contains(event.target as Node)
      );
      
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [refs, callback, enabled]);
}
