# StakeForge - Remix IDE Deployment Guide

## 🚀 Deploy to Base Mainnet via Remix

This guide walks you through deploying StakeForge contracts using Remix IDE.

---

## Prerequisites

1. **MetaMask** wallet with Base mainnet configured
2. **ETH on Base** for gas fees (~0.01 ETH recommended)
3. Your deployer wallet address ready

---

## Step 1: Configure MetaMask for Base

Add Base mainnet to MetaMask:

| Setting | Value |
|---------|-------|
| Network Name | Base |
| RPC URL | https://mainnet.base.org |
| Chain ID | 8453 |
| Currency Symbol | ETH |
| Block Explorer | https://basescan.org |

---

## Step 2: Open Remix IDE

Go to: **https://remix.ethereum.org**

---

## Step 3: Create Contract Files

In Remix, create these files under `contracts/` folder:

### 3.1 Create `1_ForgeNFT.sol`

Copy the entire contents from: `contracts/1_ForgeNFT.sol`

### 3.2 Create `2_ForgeToken.sol`

Copy the entire contents from: `contracts/2_ForgeToken.sol`

### 3.3 Create `3_StakingPool.sol`

Copy the entire contents from: `contracts/3_StakingPool.sol`

### 3.4 Create `4_Treasury.sol`

Copy the entire contents from: `contracts/4_Treasury.sol`

### 3.5 Create `5_StakingConfig.sol`

Copy the entire contents from: `contracts/5_StakingConfig.sol`

### 3.6 Create `6_RewardDistributor.sol`

Copy the entire contents from: `contracts/6_RewardDistributor.sol`

---

## Step 4: Compile Contracts

1. Go to **Solidity Compiler** tab (left sidebar)
2. Set compiler version: **0.8.20**
3. Enable **Optimization** with 200 runs
4. Click **Compile** for each contract

---

## Step 5: Deploy Contracts (In Order!)

Go to **Deploy & Run Transactions** tab.

### Environment Setup
- **Environment**: `Injected Provider - MetaMask`
- **Connect** MetaMask and switch to **Base** network

---

### 5.1 Deploy ForgeNFT

1. Select `ForgeNFT` from contract dropdown
2. Constructor parameter:
   - `initialOwner`: Your wallet address (e.g., `0x7C98ab80D060cA57DD067712d0eD084A58f69c49`)
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
ForgeNFT Address: 0x___________________________________
```

---

### 5.2 Deploy ForgeToken

1. Select `ForgeToken` from contract dropdown
2. Constructor parameter:
   - `initialOwner`: Your wallet address
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
ForgeToken Address: 0x___________________________________
```

---

### 5.3 Deploy StakingPool

1. Select `StakingPool` from contract dropdown
2. Constructor parameters:
   - `_nftContract`: ForgeNFT address from step 5.1
   - `_rewardToken`: ForgeToken address from step 5.2
   - `_rewardRate`: `11574074074074` (1 token per day in wei/sec)
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
StakingPool Address: 0x___________________________________
```

---

### 5.4 Deploy Treasury

1. Select `Treasury` from contract dropdown
2. Constructor parameter:
   - `_rewardToken`: ForgeToken address from step 5.2
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
Treasury Address: 0x___________________________________
```

---

### 5.5 Deploy StakingConfig

1. Select `StakingConfig` from contract dropdown
2. No constructor parameters needed
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
StakingConfig Address: 0x___________________________________
```

---

### 5.6 Deploy RewardDistributor

1. Select `RewardDistributor` from contract dropdown
2. No constructor parameters needed
3. Click **Deploy**
4. Confirm in MetaMask
5. **📝 Save the contract address!**

```
RewardDistributor Address: 0x___________________________________
```

---

## Step 6: Post-Deployment Setup

After all contracts are deployed, configure them:

### 6.1 Add StakingPool as Minter

1. Select deployed `ForgeToken` contract
2. Call `addMinter` with StakingPool address
3. Confirm transaction

### 6.2 Fund StakingPool with Rewards

1. Select deployed `ForgeToken` contract
2. Call `transfer`:
   - `to`: StakingPool address
   - `amount`: `10000000000000000000000000` (10M tokens)
3. Confirm transaction

### 6.3 Authorize StakingPool in Treasury

1. Select deployed `Treasury` contract
2. Call `setPoolAuthorized`:
   - `pool`: StakingPool address
   - `authorized`: `true`
3. Confirm transaction

---

## Step 7: Verify Contracts on Basescan

1. Go to: https://basescan.org
2. Search for each contract address
3. Click **Verify and Publish**
4. Settings:
   - Compiler: 0.8.20
   - Optimization: Yes, 200 runs
   - License: MIT
5. Paste source code and verify

---

## 📋 Deployment Checklist

```
[ ] ForgeNFT deployed: 0x_______________________
[ ] ForgeToken deployed: 0x_______________________
[ ] StakingPool deployed: 0x_______________________
[ ] Treasury deployed: 0x_______________________
[ ] StakingConfig deployed: 0x_______________________
[ ] RewardDistributor deployed: 0x_______________________
[ ] StakingPool added as minter
[ ] StakingPool funded with tokens
[ ] Treasury authorized StakingPool
[ ] All contracts verified on Basescan
```

---

## Gas Estimates (Base Mainnet)

| Contract | Estimated Gas | ~Cost (ETH) |
|----------|--------------|-------------|
| ForgeNFT | ~2,500,000 | ~0.0001 |
| ForgeToken | ~1,200,000 | ~0.00005 |
| StakingPool | ~2,000,000 | ~0.00008 |
| Treasury | ~1,500,000 | ~0.00006 |
| StakingConfig | ~1,000,000 | ~0.00004 |
| RewardDistributor | ~800,000 | ~0.00003 |
| **Total** | ~9,000,000 | **~0.0004 ETH** |

*Actual costs depend on current gas prices*

---

## Update Frontend Config

After deployment, update `stakeforge-ui/src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  FORGE_NFT: '0x...', // Your ForgeNFT address
  FORGE_TOKEN: '0x...', // Your ForgeToken address
  STAKING_POOL: '0x...', // Your StakingPool address
  TREASURY: '0x...', // Your Treasury address
  STAKING_CONFIG: '0x...', // Your StakingConfig address
  REWARD_DISTRIBUTOR: '0x...', // Your RewardDistributor address
};
```

---

## Troubleshooting

### "Gas estimation failed"
- Ensure you have enough ETH on Base
- Check constructor parameters are correct

### "Transaction reverted"
- Verify contract addresses in constructor params
- Ensure you're on Base mainnet (Chain ID: 8453)

### "Contract not verified"
- Match exact compiler version (0.8.20)
- Enable optimization with 200 runs
- Flatten imports if needed

---

## Support

- GitHub: https://github.com/AdekunleBamz/stakeforge
- Basescan: https://basescan.org

---

*Happy Deploying! 🚀*
