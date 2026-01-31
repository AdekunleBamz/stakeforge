# Changelog

All notable changes to the StakeForge project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite for all contracts
- Integration tests for full user journey
- Security audit checklist
- Bug bounty program documentation

## [1.0.0] - 2024-01-15

### Added

#### Smart Contracts
- `ForgeNFT.sol` - ERC721 NFT contract with minting functionality
- `ForgeToken.sol` - ERC20 reward token contract
- `StakingPool.sol` - Core NFT staking mechanism with rewards
- `Treasury.sol` - Platform treasury for managing funds
- `StakingConfig.sol` - Configurable staking tiers with multipliers
- `RewardDistributor.sol` - Automated reward distribution system

#### Frontend (stakeforge-ui)
- React 19 with TypeScript and Vite
- Complete wallet integration with MetaMask
- Responsive design for mobile and desktop
- Real-time staking statistics display
- NFT minting interface
- Staking/unstaking functionality
- Rewards claiming interface
- Toast notification system
- Loading states and error handling

#### Components
- `Header` - Navigation and wallet connection
- `StatsCard` - Display staking statistics
- `MintSection` - NFT minting interface
- `StakeSection` - NFT staking management
- `RewardsPanel` - Reward claiming interface
- `NFTCard` - Individual NFT display
- `Modal` - Reusable modal component
- `Toast` - Notification system
- `LoadingSpinner` - Loading indicator
- `Button` - Reusable button component
- `TransactionStatus` - Transaction state display
- `Footer` - Site footer

#### Hooks
- `useWallet` - Wallet connection management
- `useStaking` - Staking contract interactions
- `useToast` - Toast notification management
- `useLocalStorage` - Persistent state management

#### Utilities
- Formatting functions (ETH, addresses, numbers, dates)
- Gas configuration for ultra-low Base fees
- Type definitions for all entities
- Application constants

#### Tests
- Unit tests for ForgeNFT
- Unit tests for ForgeToken
- Unit tests for StakingPool
- Unit tests for Treasury
- Unit tests for StakingConfig
- Unit tests for RewardDistributor
- Integration tests
- Frontend formatter tests
- Hook tests

#### Documentation
- Comprehensive README
- Deployment guide
- Security audit checklist
- Contribution guidelines
- This changelog

### Technical Details

#### Gas Configuration
- Optimized for Base mainnet
- Ultra-low gas fees (~0.000005 ETH per transaction)
- `maxFeePerGas`: 0.000005 gwei
- `maxPriorityFeePerGas`: 0.000001 gwei

#### Staking Tiers
| Tier | Lock Duration | Multiplier |
|------|--------------|------------|
| Bronze | 7 days | 1.00x |
| Silver | 30 days | 1.25x |
| Gold | 90 days | 1.50x |
| Diamond | 365 days | 2.00x |

#### Dependencies
- Solidity 0.8.20
- OpenZeppelin Contracts 5.0.2
- Hardhat 2.19+
- React 19
- TypeScript 5.x
- Vite 5.x
- ethers.js 6.x

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2024-01-15 | Initial release |

---

*For more details, see the [GitHub releases](https://github.com/AdekunleBamz/stakeforge/releases).*
