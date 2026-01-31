# StakeForge ⚒️

> NFT Staking Platform on Base - Stake your NFTs to earn FORGE rewards with ultra-low gas fees.

![Base](https://img.shields.io/badge/Base-0052FF?style=flat&logo=ethereum)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

## Overview

StakeForge is a decentralized NFT staking platform that allows users to stake their NFTs and earn ERC20 reward tokens over time. Built on Base for ultra-low gas fees (~0.000005 ETH per tx) and fast transactions.

## Features

- 🎨 **Mint ForgeNFTs** - Unique ERC721 collection with batch minting
- 🔒 **Stake NFTs** - Lock your NFTs to earn rewards
- 💰 **Earn FORGE** - Accumulate tokens every second
- 📊 **Real-time Stats** - Track your staking performance
- ⚡ **Ultra-low Gas** - Built on Base L2 for minimal fees
- 🎯 **One-click Actions** - Simple mint → stake → claim flow

## Smart Contracts

| Contract | Description |
|----------|-------------|
| ForgeNFT | ERC721 NFT collection (10,000 max supply) |
| ForgeToken | ERC20 reward token (1B max supply) |
| StakingPool | Core staking logic with rewards |
| Treasury | Reward distribution management |
| StakingConfig | Tier configuration for bonuses |
| RewardDistributor | Automated reward scheduling |

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20 + OpenZeppelin 5.0
- **Development**: Hardhat
- **Frontend**: React 19 + TypeScript + Vite
- **Blockchain**: Base Mainnet (Chain ID: 8453)
- **Web3**: ethers.js v6

## Quick Start

### Prerequisites
- Node.js 18+
- Private key with ETH on Base

### Installation

```bash
# Clone repository
git clone https://github.com/AdekunleBamz/stakeforge.git
cd stakeforge

# Install contract dependencies
npm install

# Install UI dependencies
cd stakeforge-ui && npm install
```

### Deployment

```bash
# Deploy contracts
npm run deploy:base

# Run UI locally
cd stakeforge-ui && npm run dev
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Gas Optimization

All transactions are configured for Base's ultra-low gas:

| Action | Estimated Cost |
|--------|---------------|
| Mint NFT | ~0.000005 ETH |
| Stake NFT | ~0.000004 ETH |
| Claim Rewards | ~0.000003 ETH |
| Approve | ~0.000002 ETH |

## Project Structure

```
stakeforge/
├── contracts/           # Solidity smart contracts
├── test/               # Contract tests
└── stakeforge-ui/      # React frontend
    ├── src/
    │   ├── abi/        # Contract ABIs
    │   ├── components/ # React components
    │   ├── config/     # Configuration
    │   └── hooks/      # Custom hooks
    └── public/
```

## License

MIT
