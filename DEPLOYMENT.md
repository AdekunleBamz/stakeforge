# StakeForge Deployment Guide

## Overview
StakeForge is an NFT Staking Platform on Base with ultra-low gas fees (~0.000005 ETH per transaction).

## Prerequisites
- Node.js 18+
- Private key with ETH on Base
- BaseScan API key (for verification)

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Environment Setup

Edit `.env` with your credentials:
```
PRIVATE_KEY=your_deployer_private_key
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

## Deployment

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Deploy to Base Mainnet
```bash
npm run deploy:base
```

This deploys in order:
1. ForgeNFT - ERC721 NFT collection
2. ForgeToken - ERC20 reward token
3. Treasury - Reward distribution
4. StakingPool - NFT staking logic

### 3. Post-Deployment Setup

After deployment, run the setup script:
```bash
npx hardhat run scripts/setup.js --network base
```

This will:
- Add StakingPool as minter for ForgeToken
- Authorize StakingPool in Treasury
- Transfer initial tokens to Treasury

### 4. Verify Contracts

```bash
npm run verify <CONTRACT_ADDRESS> -- --network base
```

## Contract Addresses

After deployment, update these in:
- `stakeforge-ui/src/config/contracts.ts`
- `functions/3-interact-contracts.cjs`

## Gas Optimization

All transactions are configured for Base's ultra-low gas:
- Max fee: 0.000005 gwei
- Priority fee: 0.000001 gwei
- Typical tx cost: ~0.000005 ETH

## Frontend Deployment

```bash
cd stakeforge-ui
npm install
npm run build
```

Deploy the `dist` folder to your hosting provider.

## Testing Interactions

Generate test wallets:
```bash
node functions/1-generate-wallets.cjs 50
```

Fund wallets:
```bash
node functions/2-fund-wallets.cjs <funder_private_key> 0.0001
```

Run organic interactions:
```bash
node functions/4-organic-interactions.cjs 20
```
