export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const EXPLORER_URLS = {
  [BASE_CHAIN_ID]: 'https://basescan.org',
  [BASE_SEPOLIA_CHAIN_ID]: 'https://sepolia.basescan.org',
} as const;

export const RPC_URLS = {
  [BASE_CHAIN_ID]: 'https://mainnet.base.org',
  [BASE_SEPOLIA_CHAIN_ID]: 'https://sepolia.base.org',
} as const;

export const CHAIN_NAMES = {
  [BASE_CHAIN_ID]: 'Base',
  [BASE_SEPOLIA_CHAIN_ID]: 'Base Sepolia',
} as const;

export const getExplorerUrl = (chainId: number): string => {
  return EXPLORER_URLS[chainId as keyof typeof EXPLORER_URLS] || EXPLORER_URLS[BASE_CHAIN_ID];
};

export const getTxUrl = (chainId: number, txHash: string): string => {
  return `${getExplorerUrl(chainId)}/tx/${txHash}`;
};

export const getAddressUrl = (chainId: number, address: string): string => {
  return `${getExplorerUrl(chainId)}/address/${address}`;
};
