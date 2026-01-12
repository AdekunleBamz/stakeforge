/**
 * Format a wallet address to show first and last characters
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a token amount with specified decimals
 */
export function formatTokenAmount(
  amount: bigint,
  decimals = 18,
  displayDecimals = 4
): string {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const displayFractional = fractionalStr.slice(0, displayDecimals);
  
  return `${integerPart}.${displayFractional}`;
}

/**
 * Format ETH amount
 */
export function formatEth(wei: bigint, decimals = 6): string {
  return formatTokenAmount(wei, 18, decimals);
}

/**
 * Parse token amount from string
 */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  const [integer = '0', fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFraction);
}

/**
 * Format a timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return new Date(timestamp * 1000).toLocaleDateString();
}

/**
 * Format duration in seconds to human readable
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

/**
 * Shorten a transaction hash
 */
export function shortenTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/**
 * Get BaseScan URL for a transaction
 */
export function getBaseScanTxUrl(hash: string): string {
  return `https://basescan.org/tx/${hash}`;
}

/**
 * Get BaseScan URL for an address
 */
export function getBaseScanAddressUrl(address: string): string {
  return `https://basescan.org/address/${address}`;
}

/**
 * Get BaseScan URL for a token
 */
export function getBaseScanTokenUrl(address: string): string {
  return `https://basescan.org/token/${address}`;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}
