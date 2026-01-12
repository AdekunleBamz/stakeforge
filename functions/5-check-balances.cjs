const { ethers } = require('ethers');
const fs = require('fs');

// Configuration
const BASE_RPC = 'https://mainnet.base.org';

// Check balances of all test wallets
async function checkAllBalances() {
  console.log('📊 Checking all wallet balances...\n');
  
  // Load wallets
  const wallets = JSON.parse(fs.readFileSync('./functions/test-wallets.json', 'utf8'));
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  
  let totalEth = 0n;
  const results = [];
  
  for (const wallet of wallets) {
    const balance = await provider.getBalance(wallet.address);
    totalEth += balance;
    
    results.push({
      index: wallet.index,
      address: wallet.address,
      balanceWei: balance.toString(),
      balanceEth: ethers.formatEther(balance)
    });
    
    if (balance > 0n) {
      console.log(`W${wallet.index}: ${ethers.formatEther(balance)} ETH`);
    }
  }
  
  console.log(`\n📈 Total ETH across all wallets: ${ethers.formatEther(totalEth)} ETH`);
  console.log(`Wallets with balance: ${results.filter(r => r.balanceWei !== '0').length}/${wallets.length}`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  checkAllBalances().catch(console.error);
}

module.exports = { checkAllBalances };
