// Constants for StakeForge application
// Base Mainnet configuration with ultra-low gas fees

// Time constants (in seconds)
export const TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000,
} as const;

// Staking lock durations
export const LOCK_DURATIONS = {
  BRONZE: 7 * TIME.DAY,    // 7 days
  SILVER: 30 * TIME.DAY,   // 30 days
  GOLD: 90 * TIME.DAY,     // 90 days
  DIAMOND: 365 * TIME.DAY, // 365 days
} as const;

// Reward multipliers (basis points, 10000 = 1x)
export const REWARD_MULTIPLIERS = {
  BRONZE: 10000,  // 1.00x
  SILVER: 12500,  // 1.25x
  GOLD: 15000,    // 1.50x
  DIAMOND: 20000, // 2.00x
} as const;

// Maximum values
export const MAX_VALUES = {
  MAX_MINT_PER_WALLET: 10,
  MAX_STAKE_PER_TX: 20,
  MAX_NFT_SUPPLY: 10000,
  MAX_BATCH_SIZE: 50,
} as const;

// Gas limits for different operations
export const GAS_LIMITS = {
  MINT: 150000n,
  STAKE: 100000n,
  UNSTAKE: 120000n,
  CLAIM: 80000n,
  APPROVE: 50000n,
  BATCH_STAKE: 300000n,
} as const;

// Base Mainnet gas settings (ultra-low)
export const BASE_GAS = {
  MAX_FEE_PER_GAS: 5000000n,       // 0.000005 gwei
  MAX_PRIORITY_FEE: 1000000n,      // 0.000001 gwei
  ESTIMATED_TX_COST: 5000000000000n, // ~0.000005 ETH
} as const;

// UI constants
export const UI = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  POLLING_INTERVAL: 10000,
  ANIMATION_DURATION: 300,
  MAX_DISPLAY_DECIMALS: 4,
} as const;

// Contract events
export const EVENTS = {
  TRANSFER: 'Transfer',
  APPROVAL: 'Approval',
  STAKED: 'Staked',
  UNSTAKED: 'Unstaked',
  REWARDS_CLAIMED: 'RewardsClaimed',
  POOL_UPDATED: 'PoolUpdated',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  INVALID_AMOUNT: 'Please enter a valid amount',
  APPROVAL_REQUIRED: 'Approval required before proceeding',
  NFT_NOT_OWNED: 'You do not own this NFT',
  NFT_ALREADY_STAKED: 'This NFT is already staked',
  NFT_NOT_STAKED: 'This NFT is not staked',
  LOCK_NOT_EXPIRED: 'Lock period has not expired yet',
  MAX_MINT_REACHED: 'Maximum mint limit reached',
  SOLD_OUT: 'All NFTs have been minted',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  NFT_MINTED: 'NFT minted successfully!',
  NFT_STAKED: 'NFT staked successfully!',
  NFT_UNSTAKED: 'NFT unstaked successfully!',
  REWARDS_CLAIMED: 'Rewards claimed successfully!',
  APPROVAL_GRANTED: 'Approval granted successfully',
} as const;

// Chain IDs
export const CHAIN_IDS = {
  BASE_MAINNET: 8453,
  BASE_SEPOLIA: 84532,
  ETHEREUM_MAINNET: 1,
  ETHEREUM_SEPOLIA: 11155111,
} as const;

// Supported chains for the app
export const SUPPORTED_CHAINS = [CHAIN_IDS.BASE_MAINNET] as const;

// External links
export const EXTERNAL_LINKS = {
  BASESCAN: 'https://basescan.org',
  BASE_DOCS: 'https://docs.base.org',
  GITHUB: 'https://github.com/AdekunleBamz/stakeforge',
  DISCORD: 'https://discord.gg/stakeforge',
  TWITTER: 'https://twitter.com/stakeforge',
} as const;

// Token decimals
export const DECIMALS = {
  ETH: 18,
  FORGE: 18,
  USDC: 6,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;
