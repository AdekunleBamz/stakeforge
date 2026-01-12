import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWallet } from '../useWallet';

// Mock window.ethereum
const mockEthereum = {
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
};

describe('useWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).ethereum = mockEthereum;
  });

  afterEach(() => {
    delete (window as any).ethereum;
  });

  describe('initial state', () => {
    it('should start with disconnected state', () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.address).toBeNull();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
    });

    it('should detect if wallet is available', () => {
      const { result } = renderHook(() => useWallet());
      expect(result.current.hasWallet).toBe(true);
    });

    it('should return false for hasWallet when no ethereum', () => {
      delete (window as any).ethereum;
      const { result } = renderHook(() => useWallet());
      expect(result.current.hasWallet).toBe(false);
    });
  });

  describe('connect', () => {
    it('should connect wallet successfully', async () => {
      const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
      mockEthereum.request.mockResolvedValueOnce([mockAddress]);
      mockEthereum.request.mockResolvedValueOnce('0x2105'); // Base chainId

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.address).toBe(mockAddress);
      expect(result.current.isConnected).toBe(true);
    });

    it('should set connecting state during connection', async () => {
      const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
      mockEthereum.request.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([mockAddress]), 100))
      );

      const { result } = renderHook(() => useWallet());

      act(() => {
        result.current.connect();
      });

      expect(result.current.isConnecting).toBe(true);
    });

    it('should handle connection error', async () => {
      mockEthereum.request.mockRejectedValueOnce(new Error('User rejected'));

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        try {
          await result.current.connect();
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('disconnect', () => {
    it('should disconnect wallet', async () => {
      const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
      mockEthereum.request.mockResolvedValueOnce([mockAddress]);
      mockEthereum.request.mockResolvedValueOnce('0x2105');

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isConnected).toBe(true);

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.address).toBeNull();
    });
  });

  describe('chain handling', () => {
    it('should detect correct chain', async () => {
      mockEthereum.request.mockImplementation((args: { method: string }) => {
        if (args.method === 'eth_requestAccounts') {
          return Promise.resolve(['0x1234567890abcdef1234567890abcdef12345678']);
        }
        if (args.method === 'eth_chainId') {
          return Promise.resolve('0x2105'); // Base mainnet
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.chainId).toBe(8453);
      expect(result.current.isCorrectChain).toBe(true);
    });

    it('should detect wrong chain', async () => {
      mockEthereum.request.mockImplementation((args: { method: string }) => {
        if (args.method === 'eth_requestAccounts') {
          return Promise.resolve(['0x1234567890abcdef1234567890abcdef12345678']);
        }
        if (args.method === 'eth_chainId') {
          return Promise.resolve('0x1'); // Ethereum mainnet
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.chainId).toBe(1);
      expect(result.current.isCorrectChain).toBe(false);
    });
  });

  describe('switch chain', () => {
    it('should request chain switch', async () => {
      mockEthereum.request.mockResolvedValue(null);

      const { result } = renderHook(() => useWallet());

      await act(async () => {
        await result.current.switchToBase();
      });

      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }],
      });
    });
  });

  describe('event listeners', () => {
    it('should register account change listener', () => {
      renderHook(() => useWallet());

      expect(mockEthereum.on).toHaveBeenCalledWith(
        'accountsChanged',
        expect.any(Function)
      );
    });

    it('should register chain change listener', () => {
      renderHook(() => useWallet());

      expect(mockEthereum.on).toHaveBeenCalledWith(
        'chainChanged',
        expect.any(Function)
      );
    });

    it('should cleanup listeners on unmount', () => {
      const { unmount } = renderHook(() => useWallet());

      unmount();

      expect(mockEthereum.removeListener).toHaveBeenCalled();
    });
  });
});
