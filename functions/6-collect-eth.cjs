const { ethers } = require('ethers');
const fs = require('fs');

// Configuration
const BASE_RPC = 'https://mainnet.base.org';

// Collect all ETH from test wallets to a target address
async function collectToTarget(targetAddress) {
  console.log('💰 Collecting all ETH to target...\n');
  console.log(`Target: ${targetAddress}\n`);
  
  // Load wallets
  const wallets = JSON.parse(fs.readFileSync('./functions/test-wallets.json', 'utf8'));
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  
  let totalCollected = 0n;
  let successCount = 0;
  
  for (const walletData of wallets) {
    const wallet = new ethers.Wallet(walletData.privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    
    // Need enough for gas (estimate ~21000 gas * 0.000005 gwei)
    const gasNeeded = 21000n * 5000000n;
    
    if (balance <= gasNeeded) {
      continue; // Skip if not enough for gas
    }
    
    const amountToSend = balance - gasNeeded;
    
    try {
      console.log(`W${walletData.index}: Sending ${ethers.formatEther(amountToSend)} ETH...`);
      
      const tx = await wallet.sendTransaction({
        to: targetAddress,
        value: amountToSend,
        maxFeePerGas: 5000000n,
        maxPriorityFeePerGas: 1000000n,
        gasLimit: 21000n
      });
      
      await tx.wait();
      console.log(`  ✅ TX: ${tx.hash}`);
      
      totalCollected += amountToSend;
      successCount++;
      
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Collection complete`);
  console.log(`Collected: ${ethers.formatEther(totalCollected)} ETH`);
  console.log(`Successful: ${successCount} wallets`);
  
  return totalCollected;
}

// Run if called directly
if (require.main === module) {
  const target = process.argv[2];
  
  if (!target) {
    console.log('Usage: node 6-collect-eth.cjs <target_address>');
    process.exit(1);
  }
  
  collectToTarget(target).catch(console.error);
}

module.exports = { collectToTarget };
