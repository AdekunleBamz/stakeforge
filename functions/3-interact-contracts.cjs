const { ethers } = require('ethers');
const fs = require('fs');

// Configuration
const BASE_RPC = 'https://mainnet.base.org';

// Contract addresses - UPDATE AFTER DEPLOYMENT
const CONTRACTS = {
  FORGE_NFT: '0x0000000000000000000000000000000000000000',
  STAKING_POOL: '0x0000000000000000000000000000000000000000',
};

// Minimal ABIs
const NFT_ABI = [
  'function mint() external payable',
  'function mintBatch(uint256 quantity) external payable',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function setApprovalForAll(address operator, bool approved)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mintPrice() view returns (uint256)',
];

const STAKING_ABI = [
  'function stake(uint256 tokenId)',
  'function stakeMultiple(uint256[] tokenIds)',
  'function unstake(uint256 tokenId)',
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function getUserStakedTokens(address user) view returns (uint256[])',
  'function getPendingRewards(address user) view returns (uint256)',
];

// Gas config for Base (ultra-low)
const GAS_CONFIG = {
  maxFeePerGas: 5000000n,
  maxPriorityFeePerGas: 1000000n,
};

async function interactWithVault(privateKey) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`\nWallet: ${wallet.address}`);
  
  const nft = new ethers.Contract(CONTRACTS.FORGE_NFT, NFT_ABI, wallet);
  const staking = new ethers.Contract(CONTRACTS.STAKING_POOL, STAKING_ABI, wallet);
  
  try {
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`ETH Balance: ${ethers.formatEther(balance)} ETH`);
    
    // Check NFT balance
    const nftBalance = await nft.balanceOf(wallet.address);
    console.log(`NFT Balance: ${nftBalance.toString()}`);
    
    // Check staked
    const staked = await staking.getUserStakedTokens(wallet.address);
    console.log(`Staked NFTs: ${staked.length}`);
    
    // Check pending rewards
    const rewards = await staking.getPendingRewards(wallet.address);
    console.log(`Pending Rewards: ${ethers.formatEther(rewards)} FORGE`);
    
    return {
      address: wallet.address,
      balance: ethers.formatEther(balance),
      nftBalance: nftBalance.toString(),
      stakedCount: staked.length,
      pendingRewards: ethers.formatEther(rewards),
    };
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

// Mint NFT
async function mintNFT(privateKey, quantity = 1) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);
  const nft = new ethers.Contract(CONTRACTS.FORGE_NFT, NFT_ABI, wallet);
  
  console.log(`Minting ${quantity} NFT(s) for ${wallet.address}...`);
  
  const mintPrice = await nft.mintPrice();
  const value = mintPrice * BigInt(quantity);
  
  const tx = quantity === 1
    ? await nft.mint({ value, ...GAS_CONFIG, gasLimit: 150000n })
    : await nft.mintBatch(quantity, { value, ...GAS_CONFIG, gasLimit: 250000n });
  
  console.log(`TX: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Minted!');
  
  return tx.hash;
}

// Stake NFTs
async function stakeNFTs(privateKey) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);
  const nft = new ethers.Contract(CONTRACTS.FORGE_NFT, NFT_ABI, wallet);
  const staking = new ethers.Contract(CONTRACTS.STAKING_POOL, STAKING_ABI, wallet);
  
  console.log(`Staking NFTs for ${wallet.address}...`);
  
  // Check approval
  const isApproved = await nft.isApprovedForAll(wallet.address, CONTRACTS.STAKING_POOL);
  if (!isApproved) {
    console.log('Approving staking pool...');
    const approveTx = await nft.setApprovalForAll(CONTRACTS.STAKING_POOL, true, {
      ...GAS_CONFIG,
      gasLimit: 60000n
    });
    await approveTx.wait();
    console.log('✅ Approved');
  }
  
  // Get owned NFTs
  const balance = await nft.balanceOf(wallet.address);
  if (balance === 0n) {
    console.log('No NFTs to stake');
    return null;
  }
  
  const tokenIds = [];
  for (let i = 0n; i < balance; i++) {
    const tokenId = await nft.tokenOfOwnerByIndex(wallet.address, i);
    tokenIds.push(tokenId);
  }
  
  console.log(`Staking tokens: ${tokenIds.join(', ')}`);
  
  const tx = tokenIds.length === 1
    ? await staking.stake(tokenIds[0], { ...GAS_CONFIG, gasLimit: 120000n })
    : await staking.stakeMultiple(tokenIds, { ...GAS_CONFIG, gasLimit: 200000n });
  
  console.log(`TX: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Staked!');
  
  return tx.hash;
}

// Claim rewards
async function claimRewards(privateKey) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);
  const staking = new ethers.Contract(CONTRACTS.STAKING_POOL, STAKING_ABI, wallet);
  
  console.log(`Claiming rewards for ${wallet.address}...`);
  
  const rewards = await staking.getPendingRewards(wallet.address);
  if (rewards === 0n) {
    console.log('No rewards to claim');
    return null;
  }
  
  console.log(`Claiming ${ethers.formatEther(rewards)} FORGE...`);
  
  const tx = await staking.claimAllRewards({ ...GAS_CONFIG, gasLimit: 150000n });
  console.log(`TX: ${tx.hash}`);
  await tx.wait();
  console.log('✅ Claimed!');
  
  return tx.hash;
}

module.exports = {
  interactWithVault,
  mintNFT,
  stakeNFTs,
  claimRewards,
  CONTRACTS,
};
