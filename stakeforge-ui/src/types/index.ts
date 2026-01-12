// Address Types
export type Address = `0x${string}`;

// Chain Types
export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Token Types
export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// NFT Types
export interface NFT {
  tokenId: bigint;
  owner: Address;
  isStaked: boolean;
  stakedAt?: number;
  rarity?: NFTRarity;
}

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Staking Types
export interface StakingPosition {
  tokenId: bigint;
  owner: Address;
  stakedAt: number;
  lockDuration: number;
  unlockTime: number;
  rewardMultiplier: number;
  pendingRewards: bigint;
}

export interface StakingTier {
  id: number;
  name: string;
  minStakeDuration: number;
  rewardMultiplier: number;
  requiredNFTs: number;
}

export interface StakingStats {
  totalStaked: number;
  totalRewardsDistributed: bigint;
  currentAPY: number;
  uniqueStakers: number;
  averageStakeDuration: number;
}

// Transaction Types
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: number;
  amount?: bigint;
  tokenId?: bigint;
  gasUsed?: bigint;
  gasPrice?: bigint;
}

export type TransactionType =
  | 'mint'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'approve'
  | 'transfer';

// Pool Types
export interface RewardPool {
  id: number;
  name: string;
  totalAllocated: bigint;
  totalDistributed: bigint;
  rewardRate: bigint;
  lastUpdateTime: number;
  isActive: boolean;
}

// User Types
export interface UserStats {
  address: Address;
  totalNFTsMinted: number;
  totalNFTsStaked: number;
  totalRewardsClaimed: bigint;
  currentTier: StakingTier | null;
  memberSince: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Component Prop Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// Event Types
export interface StakeEvent {
  tokenId: bigint;
  owner: Address;
  timestamp: number;
  transactionHash: string;
}

export interface UnstakeEvent {
  tokenId: bigint;
  owner: Address;
  rewards: bigint;
  timestamp: number;
  transactionHash: string;
}

export interface ClaimEvent {
  owner: Address;
  amount: bigint;
  timestamp: number;
  transactionHash: string;
}

// Gas Types
export interface GasConfig {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

export interface GasEstimate {
  estimated: bigint;
  limit: bigint;
  price: bigint;
  totalCost: bigint;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T | null>;
