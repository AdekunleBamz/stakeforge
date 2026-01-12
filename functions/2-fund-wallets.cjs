const { ethers } = require('ethers');
const fs = require('fs');

// Configuration - Base Mainnet
const BASE_RPC = 'https://mainnet.base.org';

// Fund test wallets with small amounts for gas
async function fundWallets(funderPrivateKey, amountPerWallet = '0.0001') {
  console.log('Funding test wallets...');
  
  // Load wallets
  const wallets = JSON.parse(fs.readFileSync('./functions/test-wallets.json', 'utf8'));
  
  // Setup provider and funder
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const funder = new ethers.Wallet(funderPrivateKey, provider);
  
  console.log(`Funder address: ${funder.address}`);
  const balance = await provider.getBalance(funder.address);
  console.log(`Funder balance: ${ethers.formatEther(balance)} ETH`);
  
  const amountWei = ethers.parseEther(amountPerWallet);
  const totalNeeded = amountWei * BigInt(wallets.length);
  
  console.log(`\nAmount per wallet: ${amountPerWallet} ETH`);
  console.log(`Total needed: ${ethers.formatEther(totalNeeded)} ETH`);
  console.log(`Wallets to fund: ${wallets.length}`);
  
  if (balance < totalNeeded) {
    console.error('❌ Insufficient balance to fund all wallets');
    return;
  }
  
  let funded = 0;
  let failed = 0;
  
  for (const wallet of wallets) {
    try {
      // Check if already has balance
      const existingBalance = await provider.getBalance(wallet.address);
      if (existingBalance >= amountWei) {
        console.log(`W${wallet.index}: Already funded (${ethers.formatEther(existingBalance)} ETH)`);
        continue;
      }
      
      // Send funds with ultra-low gas for Base
      const tx = await funder.sendTransaction({
        to: wallet.address,
        value: amountWei,
        maxFeePerGas: 5000000n,        // 0.000005 gwei
        maxPriorityFeePerGas: 1000000n, // 0.000001 gwei
        gasLimit: 21000n
      });
      
      console.log(`W${wallet.index}: Funded - tx: ${tx.hash}`);
      funded++;
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 100));
      
    } catch (err) {
      console.error(`W${wallet.index}: Failed - ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n✅ Funding complete`);
  console.log(`Funded: ${funded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Already funded: ${wallets.length - funded - failed}`);
}

// Run if called directly
if (require.main === module) {
  const privateKey = process.argv[2];
  const amount = process.argv[3] || '0.0001';
  
  if (!privateKey) {
    console.log('Usage: node 2-fund-wallets.cjs <funder_private_key> [amount_per_wallet]');
    process.exit(1);
  }
  
  fundWallets(privateKey, amount).catch(console.error);
}

module.exports = { fundWallets };
