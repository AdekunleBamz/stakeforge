const { ethers } = require('ethers');
const fs = require('fs');

// Configuration
const BASE_RPC = 'https://mainnet.base.org';

// Audit all staked NFTs across wallets
async function auditStakedNFTs(stakingPoolAddress, nftAddress) {
  console.log('📊 Auditing staked NFTs...\n');
  
  // Load wallets
  const wallets = JSON.parse(fs.readFileSync('./functions/test-wallets.json', 'utf8'));
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  
  const STAKING_ABI = [
    'function getUserStakedTokens(address user) view returns (uint256[])',
    'function getPendingRewards(address user) view returns (uint256)',
    'function totalStaked() view returns (uint256)',
  ];
  
  const NFT_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
  ];
  
  const staking = new ethers.Contract(stakingPoolAddress, STAKING_ABI, provider);
  const nft = new ethers.Contract(nftAddress, NFT_ABI, provider);
  
  let totalStakedCount = 0;
  let totalPendingRewards = 0n;
  let totalOwnedNFTs = 0;
  
  const results = [];
  
  for (const walletData of wallets) {
    try {
      const stakedTokens = await staking.getUserStakedTokens(walletData.address);
      const pendingRewards = await staking.getPendingRewards(walletData.address);
      const nftBalance = await nft.balanceOf(walletData.address);
      
      if (stakedTokens.length > 0 || nftBalance > 0n) {
        console.log(`W${walletData.index}:`);
        console.log(`  Staked: ${stakedTokens.length} NFTs`);
        console.log(`  Owned: ${nftBalance.toString()} NFTs`);
        console.log(`  Pending: ${ethers.formatEther(pendingRewards)} FORGE`);
        
        totalStakedCount += stakedTokens.length;
        totalPendingRewards += pendingRewards;
        totalOwnedNFTs += Number(nftBalance);
        
        results.push({
          wallet: walletData.index,
          address: walletData.address,
          staked: stakedTokens.length,
          owned: Number(nftBalance),
          pendingRewards: ethers.formatEther(pendingRewards)
        });
      }
    } catch (err) {
      // Skip errors
    }
  }
  
  // Get total staked from contract
  const contractTotalStaked = await staking.totalStaked();
  
  console.log('\n═══════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Total Staked (calculated): ${totalStakedCount}`);
  console.log(`Total Staked (contract): ${contractTotalStaked.toString()}`);
  console.log(`Total Owned (in wallets): ${totalOwnedNFTs}`);
  console.log(`Total Pending Rewards: ${ethers.formatEther(totalPendingRewards)} FORGE`);
  console.log(`Wallets with activity: ${results.length}/${wallets.length}`);
  
  // Save results
  fs.writeFileSync(
    './functions/staking-audit.json',
    JSON.stringify({
      timestamp: new Date().toISOString(),
      totalStaked: totalStakedCount,
      totalOwned: totalOwnedNFTs,
      totalPendingRewards: ethers.formatEther(totalPendingRewards),
      wallets: results
    }, null, 2)
  );
  
  console.log('\nResults saved to: ./functions/staking-audit.json');
  
  return results;
}

// Run if called directly
if (require.main === module) {
  const stakingPool = process.argv[2];
  const nftContract = process.argv[3];
  
  if (!stakingPool || !nftContract) {
    console.log('Usage: node 7-audit-staking.cjs <staking_pool_address> <nft_address>');
    process.exit(1);
  }
  
  auditStakedNFTs(stakingPool, nftContract).catch(console.error);
}

module.exports = { auditStakedNFTs };
