import { useState, useCallback } from 'react';

interface CopyState {
  value: string | null;
  success: boolean | null;
  error: Error | null;
}

/**
 * A hook that provides copy to clipboard functionality
 * Returns the copy function and the current state
 */
export function useCopyToClipboard(): [
  CopyState,
  (text: string) => Promise<boolean>
] {
  const [state, setState] = useState<CopyState>({
    value: null,
    success: null,
    error: null
  });

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          setState({ value: text, success: true, error: null });
          return true;
        } else {
          throw new Error('Copy command failed');
        }
      } catch (error) {
        setState({ value: null, success: false, error: error as Error });
        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setState({ value: text, success: true, error: null });
      return true;
    } catch (error) {
      setState({ value: null, success: false, error: error as Error });
      return false;
    }
  }, []);

  return [state, copy];
}

/**
 * A simpler hook that just returns the copy function and copied status
 * Resets the copied status after the specified timeout
 */
export function useCopy(resetTimeout: number = 2000): {
  copied: boolean;
  copy: (text: string) => Promise<void>;
} {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, resetTimeout);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [resetTimeout]);

  return { copied, copy };
}
