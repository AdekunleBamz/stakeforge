const { ethers } = require('ethers');
const fs = require('fs');

// Generate test wallets for organic interactions
async function generateWallets(count = 50) {
  console.log(`Generating ${count} test wallets...`);
  
  const wallets = [];
  
  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      index: i + 1,
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || null
    });
    
    if ((i + 1) % 10 === 0) {
      console.log(`Generated ${i + 1} wallets...`);
    }
  }
  
  // Save to file
  fs.writeFileSync(
    './functions/test-wallets.json',
    JSON.stringify(wallets, null, 2)
  );
  
  console.log(`\n✅ Generated ${count} wallets`);
  console.log('Saved to: ./functions/test-wallets.json');
  console.log('\n⚠️  Keep this file secure - contains private keys!');
  
  return wallets;
}

// Run if called directly
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 50;
  generateWallets(count).catch(console.error);
}

module.exports = { generateWallets };
