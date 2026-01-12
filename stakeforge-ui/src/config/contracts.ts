// Contract addresses on Base Mainnet
export const CONTRACTS = {
  FORGE_NFT: '0x0000000000000000000000000000000000000000', // Update after deployment
  FORGE_TOKEN: '0x0000000000000000000000000000000000000000', // Update after deployment
  STAKING_POOL: '0x0000000000000000000000000000000000000000', // Update after deployment
  TREASURY: '0x0000000000000000000000000000000000000000', // Update after deployment
};

// Base Mainnet Configuration
export const CHAIN_CONFIG = {
  chainId: 8453,
  chainIdHex: '0x2105',
  name: 'Base',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
};

// Gas Configuration - Ultra low for Base
export const GAS_CONFIG = {
  maxFeePerGas: 5000000n, // 0.000005 gwei - extremely low for Base
  maxPriorityFeePerGas: 1000000n, // 0.000001 gwei
  gasLimit: {
    mint: 150000n,
    mintBatch: 250000n,
    stake: 120000n,
    stakeMultiple: 200000n,
    unstake: 150000n,
    claimRewards: 100000n,
    approve: 60000n,
  },
};

// App Configuration
export const APP_CONFIG = {
  name: 'StakeForge',
  description: 'NFT Staking Platform on Base',
  mintPrice: '0.001', // ETH
  maxMintPerTx: 10,
  minStakeDuration: 86400, // 1 day in seconds
};
