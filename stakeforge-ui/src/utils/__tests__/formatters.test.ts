import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatEther, formatAddress, formatNumber, formatDate, formatDuration, formatPercentage } from '../formatters';

describe('formatters', () => {
  describe('formatEther', () => {
    it('should format wei to ether with default decimals', () => {
      const result = formatEther(1000000000000000000n);
      expect(result).toBe('1.0000');
    });

    it('should format wei to ether with custom decimals', () => {
      const result = formatEther(1234567890000000000n, 2);
      expect(result).toBe('1.23');
    });

    it('should handle zero', () => {
      const result = formatEther(0n);
      expect(result).toBe('0.0000');
    });

    it('should handle large numbers', () => {
      const result = formatEther(1000000000000000000000000n, 2);
      expect(result).toBe('1000000.00');
    });

    it('should handle small numbers', () => {
      const result = formatEther(1000000000000n, 6);
      expect(result).toBe('0.000001');
    });
  });

  describe('formatAddress', () => {
    it('should shorten address with default length', () => {
      const result = formatAddress('0x1234567890abcdef1234567890abcdef12345678');
      expect(result).toBe('0x1234...5678');
    });

    it('should shorten address with custom length', () => {
      const result = formatAddress('0x1234567890abcdef1234567890abcdef12345678', 6);
      expect(result).toBe('0x123456...345678');
    });

    it('should handle empty string', () => {
      const result = formatAddress('');
      expect(result).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(formatAddress(null as any)).toBe('');
      expect(formatAddress(undefined as any)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format number with default decimals', () => {
      const result = formatNumber(1234.5678);
      expect(result).toBe('1,234.57');
    });

    it('should format number with custom decimals', () => {
      const result = formatNumber(1234.5678, 4);
      expect(result).toBe('1,234.5678');
    });

    it('should format large numbers', () => {
      const result = formatNumber(1234567890);
      expect(result).toBe('1,234,567,890.00');
    });

    it('should format zero', () => {
      const result = formatNumber(0);
      expect(result).toBe('0.00');
    });

    it('should format negative numbers', () => {
      const result = formatNumber(-1234.56);
      expect(result).toBe('-1,234.56');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    it('should format timestamp to readable date', () => {
      const timestamp = 1705320000; // 2024-01-15
      const result = formatDate(timestamp);
      expect(result).toContain('2024');
    });

    it('should handle zero timestamp', () => {
      const result = formatDate(0);
      expect(result).toContain('1970');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds to readable duration', () => {
      expect(formatDuration(60)).toBe('1 minute');
      expect(formatDuration(3600)).toBe('1 hour');
      expect(formatDuration(86400)).toBe('1 day');
    });

    it('should format multiple units', () => {
      expect(formatDuration(90)).toBe('1 minute');
      expect(formatDuration(3660)).toBe('1 hour');
    });

    it('should handle days', () => {
      expect(formatDuration(86400 * 7)).toBe('7 days');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0 seconds');
    });
  });

  describe('formatPercentage', () => {
    it('should format number to percentage', () => {
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(1)).toBe('100.00%');
      expect(formatPercentage(0.123)).toBe('12.30%');
    });

    it('should handle custom decimals', () => {
      expect(formatPercentage(0.12345, 1)).toBe('12.3%');
      expect(formatPercentage(0.12345, 3)).toBe('12.345%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });

    it('should handle values over 100%', () => {
      expect(formatPercentage(1.5)).toBe('150.00%');
    });
  });
});
