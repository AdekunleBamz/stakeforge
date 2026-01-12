const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * StakeForge - Gas Price Monitor
 * Monitors Base mainnet gas prices and logs for analytics
 */

const RPC_URL = 'https://mainnet.base.org';

const provider = new ethers.JsonRpcProvider(RPC_URL);

async function getGasInfo() {
  try {
    const feeData = await provider.getFeeData();
    const block = await provider.getBlock('latest');
    
    return {
      timestamp: new Date().toISOString(),
      blockNumber: block?.number || 0,
      baseFee: feeData.gasPrice?.toString() || '0',
      maxFeePerGas: feeData.maxFeePerGas?.toString() || '0',
      maxPriorityFee: feeData.maxPriorityFeePerGas?.toString() || '0',
      baseFeeGwei: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0',
    };
  } catch (error) {
    console.error('Error fetching gas info:', error.message);
    return null;
  }
}

async function estimateTransactionCosts() {
  const gasInfo = await getGasInfo();
  if (!gasInfo) return null;

  const gasPrice = BigInt(gasInfo.baseFee);
  
  // Estimated gas limits for common operations
  const operations = {
    mint: 150000n,
    stake: 100000n,
    unstake: 120000n,
    claim: 80000n,
    approve: 50000n,
  };

  const costs = {};
  for (const [op, gasLimit] of Object.entries(operations)) {
    const costWei = gasPrice * gasLimit;
    costs[op] = {
      gasLimit: gasLimit.toString(),
      costWei: costWei.toString(),
      costEth: ethers.formatEther(costWei),
    };
  }

  return {
    ...gasInfo,
    estimatedCosts: costs,
  };
}

async function monitorGas(intervalMs = 60000, durationMs = 3600000) {
  console.log('🔍 Starting gas price monitor...');
  console.log(`📊 Polling every ${intervalMs / 1000}s for ${durationMs / 1000 / 60} minutes`);
  console.log('');

  const logs = [];
  const startTime = Date.now();

  const poll = async () => {
    const data = await estimateTransactionCosts();
    if (data) {
      logs.push(data);
      
      console.log(`⛽ Block ${data.blockNumber} | Base Fee: ${parseFloat(data.baseFeeGwei).toFixed(6)} gwei`);
      console.log(`   Mint: ${data.estimatedCosts.mint.costEth} ETH | Stake: ${data.estimatedCosts.stake.costEth} ETH`);
      console.log('');
    }
  };

  // Initial poll
  await poll();

  // Set up interval
  const interval = setInterval(async () => {
    if (Date.now() - startTime >= durationMs) {
      clearInterval(interval);
      
      // Save logs
      const logPath = path.join(__dirname, 'gas-monitor-logs.json');
      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
      console.log(`\n✅ Monitoring complete. Saved ${logs.length} entries to ${logPath}`);
      
      // Calculate averages
      if (logs.length > 0) {
        const avgBaseFee = logs.reduce((sum, l) => sum + BigInt(l.baseFee), 0n) / BigInt(logs.length);
        console.log(`\n📈 Average base fee: ${ethers.formatUnits(avgBaseFee, 'gwei')} gwei`);
      }
      
      return;
    }
    
    await poll();
  }, intervalMs);
}

// Quick check mode
async function quickCheck() {
  console.log('⛽ StakeForge Gas Price Check');
  console.log('============================\n');
  
  const data = await estimateTransactionCosts();
  if (!data) {
    console.log('❌ Failed to fetch gas data');
    return;
  }

  console.log(`📦 Block: ${data.blockNumber}`);
  console.log(`⏰ Time: ${data.timestamp}`);
  console.log(`💰 Base Fee: ${parseFloat(data.baseFeeGwei).toFixed(6)} gwei`);
  console.log('');
  console.log('📊 Estimated Transaction Costs:');
  console.log('-------------------------------');
  
  for (const [op, cost] of Object.entries(data.estimatedCosts)) {
    console.log(`   ${op.padEnd(10)} ${cost.costEth} ETH`);
  }
  
  console.log('\n✅ Base mainnet is ideal for ultra-low gas fees!');
}

// Run based on command line args
const args = process.argv.slice(2);
if (args.includes('--monitor')) {
  const interval = parseInt(args[args.indexOf('--interval') + 1]) || 60000;
  const duration = parseInt(args[args.indexOf('--duration') + 1]) || 3600000;
  monitorGas(interval, duration);
} else {
  quickCheck();
}

module.exports = { getGasInfo, estimateTransactionCosts, monitorGas };
