const { ethers } = require('ethers');
const fs = require('fs');
const { mintNFT, stakeNFTs, claimRewards } = require('./3-interact-contracts.cjs');

// Configuration
const BASE_RPC = 'https://mainnet.base.org';

// Random delay between min and max ms
function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Randomly select action
function randomAction() {
  const actions = ['mint', 'stake', 'claim'];
  const weights = [0.4, 0.4, 0.2]; // 40% mint, 40% stake, 20% claim
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < actions.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return actions[i];
    }
  }
  
  return actions[0];
}

// Run organic interactions
async function runOrganicInteractions(count = 10) {
  console.log('🔄 Starting organic interactions...\n');
  
  // Load wallets
  const wallets = JSON.parse(fs.readFileSync('./functions/test-wallets.json', 'utf8'));
  
  const results = [];
  
  for (let i = 0; i < count; i++) {
    // Random wallet
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    
    // Random action
    const action = randomAction();
    
    console.log(`\n[${i + 1}/${count}] W${wallet.index}: ${action.toUpperCase()}`);
    
    try {
      let txHash = null;
      
      switch (action) {
        case 'mint':
          const quantity = Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 3) + 2;
          txHash = await mintNFT(wallet.privateKey, quantity);
          break;
        case 'stake':
          txHash = await stakeNFTs(wallet.privateKey);
          break;
        case 'claim':
          txHash = await claimRewards(wallet.privateKey);
          break;
      }
      
      results.push({
        wallet: wallet.index,
        action,
        txHash,
        success: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error(`Error: ${err.message}`);
      results.push({
        wallet: wallet.index,
        action,
        error: err.message,
        success: false,
        timestamp: new Date().toISOString()
      });
    }
    
    // Random delay between interactions (1-5 seconds)
    if (i < count - 1) {
      const delay = Math.floor(Math.random() * 4000) + 1000;
      console.log(`Waiting ${delay}ms...`);
      await randomDelay(delay, delay);
    }
  }
  
  // Save results
  fs.writeFileSync(
    './functions/interaction-results.json',
    JSON.stringify(results, null, 2)
  );
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✅ Completed: ${successful}/${count} successful`);
  console.log('Results saved to: ./functions/interaction-results.json');
  
  return results;
}

// Run if called directly
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 10;
  runOrganicInteractions(count).catch(console.error);
}

module.exports = { runOrganicInteractions };
