import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS, GAS_CONFIG, CHAIN_CONFIG } from '../config/contracts';
import { FORGE_NFT_ABI, STAKING_POOL_ABI, FORGE_TOKEN_ABI } from '../abi';

interface StakeInfo {
  tokenId: bigint;
  stakedAt: bigint;
  pendingRewards: bigint;
}

interface UseStakingReturn {
  // NFT data
  ownedNFTs: bigint[];
  stakedNFTs: StakeInfo[];
  nftBalance: bigint;
  
  // Token data
  forgeBalance: bigint;
  totalPendingRewards: bigint;
  
  // Pool data
  totalStaked: bigint;
  rewardRate: bigint;
  stakingEnabled: boolean;
  
  // Loading states
  isLoading: boolean;
  isMinting: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  
  // Actions
  mint: (quantity: number) => Promise<string | null>;
  stake: (tokenIds: bigint[]) => Promise<string | null>;
  unstake: (tokenId: bigint) => Promise<string | null>;
  claimRewards: (tokenId?: bigint) => Promise<string | null>;
  approveNFTs: () => Promise<string | null>;
  refresh: () => Promise<void>;
  
  // Status
  isApproved: boolean;
  error: string | null;
}

export function useStaking(address: string | null): UseStakingReturn {
  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);
  const [stakedNFTs, setStakedNFTs] = useState<StakeInfo[]>([]);
  const [nftBalance, setNftBalance] = useState<bigint>(0n);
  const [forgeBalance, setForgeBalance] = useState<bigint>(0n);
  const [totalPendingRewards, setTotalPendingRewards] = useState<bigint>(0n);
  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  const [rewardRate, setRewardRate] = useState<bigint>(0n);
  const [stakingEnabled, setStakingEnabled] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get provider and signer
  const getProvider = useCallback(() => {
    if (window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl);
  }, []);

  const getSigner = useCallback(async () => {
    const provider = getProvider();
    if (provider instanceof ethers.BrowserProvider) {
      return provider.getSigner();
    }
    return null;
  }, [getProvider]);

  // Get contracts
  const getContracts = useCallback(async (withSigner = false) => {
    const provider = getProvider();
    const signerOrProvider = withSigner ? await getSigner() || provider : provider;
    
    return {
      nft: new ethers.Contract(CONTRACTS.FORGE_NFT, FORGE_NFT_ABI, signerOrProvider),
      token: new ethers.Contract(CONTRACTS.FORGE_TOKEN, FORGE_TOKEN_ABI, signerOrProvider),
      staking: new ethers.Contract(CONTRACTS.STAKING_POOL, STAKING_POOL_ABI, signerOrProvider),
    };
  }, [getProvider, getSigner]);

  // Fetch all data
  const refresh = useCallback(async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { nft, token, staking } = await getContracts();
      
      // Get NFT balance
      const balance = await nft.balanceOf(address);
      setNftBalance(balance);
      
      // Get owned NFTs
      const owned: bigint[] = [];
      for (let i = 0n; i < balance; i++) {
        const tokenId = await nft.tokenOfOwnerByIndex(address, i);
        owned.push(tokenId);
      }
      setOwnedNFTs(owned);
      
      // Get staked NFTs
      const stakedTokenIds = await staking.getUserStakedTokens(address);
      const staked: StakeInfo[] = [];
      for (const tokenId of stakedTokenIds) {
        const rewards = await staking.calculateRewards(tokenId);
        const [, stakedAt] = await staking.stakes(tokenId);
        staked.push({
          tokenId,
          stakedAt,
          pendingRewards: rewards,
        });
      }
      setStakedNFTs(staked);
      
      // Get total pending rewards
      const pending = await staking.getPendingRewards(address);
      setTotalPendingRewards(pending);
      
      // Get FORGE token balance
      const tokenBal = await token.balanceOf(address);
      setForgeBalance(tokenBal);
      
      // Get pool stats
      const total = await staking.totalStaked();
      setTotalStaked(total);
      
      const rate = await staking.rewardRate();
      setRewardRate(rate);
      
      const enabled = await staking.stakingEnabled();
      setStakingEnabled(enabled);
      
      // Check approval
      const approved = await nft.isApprovedForAll(address, CONTRACTS.STAKING_POOL);
      setIsApproved(approved);
      
    } catch (err) {
      console.error('Failed to fetch staking data:', err);
      setError('Failed to load staking data');
    } finally {
      setIsLoading(false);
    }
  }, [address, getContracts]);

  // Auto-refresh on address change
  useEffect(() => {
    if (address) {
      refresh();
    }
  }, [address, refresh]);

  // Mint NFTs
  const mint = useCallback(async (quantity: number): Promise<string | null> => {
    setIsMinting(true);
    setError(null);
    
    try {
      const { nft } = await getContracts(true);
      const mintPrice = await nft.mintPrice();
      const value = mintPrice * BigInt(quantity);
      
      const tx = quantity === 1
        ? await nft.mint({
            value,
            gasLimit: GAS_CONFIG.gasLimit.mint,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          })
        : await nft.mintBatch(quantity, {
            value,
            gasLimit: GAS_CONFIG.gasLimit.mintBatch,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          });
      
      await tx.wait();
      await refresh();
      return tx.hash;
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Mint failed:', err);
      setError(error.message || 'Mint failed');
      return null;
    } finally {
      setIsMinting(false);
    }
  }, [getContracts, refresh]);

  // Approve NFTs for staking
  const approveNFTs = useCallback(async (): Promise<string | null> => {
    setError(null);
    
    try {
      const { nft } = await getContracts(true);
      
      const tx = await nft.setApprovalForAll(CONTRACTS.STAKING_POOL, true, {
        gasLimit: GAS_CONFIG.gasLimit.approve,
        maxFeePerGas: GAS_CONFIG.maxFeePerGas,
        maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
      });
      
      await tx.wait();
      setIsApproved(true);
      return tx.hash;
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Approval failed:', err);
      setError(error.message || 'Approval failed');
      return null;
    }
  }, [getContracts]);

  // Stake NFTs
  const stake = useCallback(async (tokenIds: bigint[]): Promise<string | null> => {
    setIsStaking(true);
    setError(null);
    
    try {
      const { staking } = await getContracts(true);
      
      const tx = tokenIds.length === 1
        ? await staking.stake(tokenIds[0], {
            gasLimit: GAS_CONFIG.gasLimit.stake,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          })
        : await staking.stakeMultiple(tokenIds, {
            gasLimit: GAS_CONFIG.gasLimit.stakeMultiple,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          });
      
      await tx.wait();
      await refresh();
      return tx.hash;
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Stake failed:', err);
      setError(error.message || 'Stake failed');
      return null;
    } finally {
      setIsStaking(false);
    }
  }, [getContracts, refresh]);

  // Unstake NFT
  const unstake = useCallback(async (tokenId: bigint): Promise<string | null> => {
    setIsUnstaking(true);
    setError(null);
    
    try {
      const { staking } = await getContracts(true);
      
      const tx = await staking.unstake(tokenId, {
        gasLimit: GAS_CONFIG.gasLimit.unstake,
        maxFeePerGas: GAS_CONFIG.maxFeePerGas,
        maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
      });
      
      await tx.wait();
      await refresh();
      return tx.hash;
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Unstake failed:', err);
      setError(error.message || 'Unstake failed');
      return null;
    } finally {
      setIsUnstaking(false);
    }
  }, [getContracts, refresh]);

  // Claim rewards
  const claimRewards = useCallback(async (tokenId?: bigint): Promise<string | null> => {
    setIsClaiming(true);
    setError(null);
    
    try {
      const { staking } = await getContracts(true);
      
      const tx = tokenId
        ? await staking.claimRewards(tokenId, {
            gasLimit: GAS_CONFIG.gasLimit.claimRewards,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          })
        : await staking.claimAllRewards({
            gasLimit: GAS_CONFIG.gasLimit.claimRewards * 2n,
            maxFeePerGas: GAS_CONFIG.maxFeePerGas,
            maxPriorityFeePerGas: GAS_CONFIG.maxPriorityFeePerGas,
          });
      
      await tx.wait();
      await refresh();
      return tx.hash;
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Claim failed:', err);
      setError(error.message || 'Claim failed');
      return null;
    } finally {
      setIsClaiming(false);
    }
  }, [getContracts, refresh]);

  return {
    ownedNFTs,
    stakedNFTs,
    nftBalance,
    forgeBalance,
    totalPendingRewards,
    totalStaked,
    rewardRate,
    stakingEnabled,
    isLoading,
    isMinting,
    isStaking,
    isUnstaking,
    isClaiming,
    mint,
    stake,
    unstake,
    claimRewards,
    approveNFTs,
    refresh,
    isApproved,
    error,
  };
}
