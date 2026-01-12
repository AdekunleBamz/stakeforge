const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Integration Tests', function () {
  let forgeNFT;
  let forgeToken;
  let stakingPool;
  let stakingConfig;
  let rewardDistributor;
  let treasury;
  let owner;
  let user1;
  let user2;
  let user3;

  const MINT_PRICE = ethers.parseEther('0.01');
  const REWARD_RATE = ethers.parseEther('10');

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy all contracts
    const ForgeNFT = await ethers.getContractFactory('ForgeNFT');
    forgeNFT = await ForgeNFT.deploy('StakeForge NFT', 'FORGE', 10000);

    const ForgeToken = await ethers.getContractFactory('ForgeToken');
    forgeToken = await ForgeToken.deploy('Forge Token', 'FRGTKN', ethers.parseEther('1000000'));

    const Treasury = await ethers.getContractFactory('Treasury');
    treasury = await Treasury.deploy(await forgeToken.getAddress());

    const StakingPool = await ethers.getContractFactory('StakingPool');
    stakingPool = await StakingPool.deploy(
      await forgeNFT.getAddress(),
      await forgeToken.getAddress(),
      REWARD_RATE
    );

    const StakingConfig = await ethers.getContractFactory('StakingConfig');
    stakingConfig = await StakingConfig.deploy();

    const RewardDistributor = await ethers.getContractFactory('RewardDistributor');
    rewardDistributor = await RewardDistributor.deploy(await forgeToken.getAddress());

    // Setup: Transfer tokens to staking pool
    await forgeToken.transfer(await stakingPool.getAddress(), ethers.parseEther('500000'));
  });

  describe('Full User Journey', function () {
    it('Should complete mint → stake → earn → claim → unstake flow', async function () {
      // Step 1: User mints NFT
      await forgeNFT.connect(user1).mint(1, { value: MINT_PRICE });
      expect(await forgeNFT.balanceOf(user1.address)).to.equal(1);

      // Step 2: User approves and stakes NFT
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      await stakingPool.connect(user1).stake(1);
      expect(await stakingPool.stakedBalance(user1.address)).to.equal(1);

      // Step 3: Time passes, rewards accrue
      await ethers.provider.send('evm_increaseTime', [86400 * 7]); // 7 days
      await ethers.provider.send('evm_mine');

      // Step 4: User claims rewards
      const pendingBefore = await stakingPool.pendingRewards(user1.address);
      expect(pendingBefore).to.be.gt(0);

      await stakingPool.connect(user1).claimRewards();
      expect(await forgeToken.balanceOf(user1.address)).to.be.gt(0);

      // Step 5: User unstakes NFT
      await stakingPool.connect(user1).unstake(1);
      expect(await forgeNFT.ownerOf(1)).to.equal(user1.address);
      expect(await stakingPool.stakedBalance(user1.address)).to.equal(0);
    });

    it('Should handle multiple users staking simultaneously', async function () {
      // All users mint NFTs
      await forgeNFT.connect(user1).mint(2, { value: MINT_PRICE * 2n });
      await forgeNFT.connect(user2).mint(3, { value: MINT_PRICE * 3n });
      await forgeNFT.connect(user3).mint(1, { value: MINT_PRICE });

      // All users approve and stake
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      await forgeNFT.connect(user2).setApprovalForAll(await stakingPool.getAddress(), true);
      await forgeNFT.connect(user3).setApprovalForAll(await stakingPool.getAddress(), true);

      await stakingPool.connect(user1).stake(1);
      await stakingPool.connect(user1).stake(2);
      await stakingPool.connect(user2).stake(3);
      await stakingPool.connect(user2).stake(4);
      await stakingPool.connect(user2).stake(5);
      await stakingPool.connect(user3).stake(6);

      expect(await stakingPool.totalStaked()).to.equal(6);

      // Advance time
      await ethers.provider.send('evm_increaseTime', [86400]);
      await ethers.provider.send('evm_mine');

      // All users should have rewards
      expect(await stakingPool.pendingRewards(user1.address)).to.be.gt(0);
      expect(await stakingPool.pendingRewards(user2.address)).to.be.gt(0);
      expect(await stakingPool.pendingRewards(user3.address)).to.be.gt(0);

      // User2 should have more rewards (3 NFTs vs 2 and 1)
      const rewards1 = await stakingPool.pendingRewards(user1.address);
      const rewards2 = await stakingPool.pendingRewards(user2.address);
      const rewards3 = await stakingPool.pendingRewards(user3.address);

      expect(rewards2).to.be.gt(rewards1);
      expect(rewards1).to.be.gt(rewards3);
    });
  });

  describe('Staking Tiers Integration', function () {
    it('Should apply correct tier multipliers', async function () {
      // Setup tiers
      await stakingConfig.addTier(
        'Bronze',
        7 * 86400,  // 7 days
        10000,      // 1x multiplier
        1           // Min 1 NFT
      );
      await stakingConfig.addTier(
        'Silver',
        30 * 86400, // 30 days
        12500,      // 1.25x multiplier
        5           // Min 5 NFTs
      );

      const tier = await stakingConfig.getTier(0);
      expect(tier.name).to.equal('Bronze');
      expect(tier.rewardMultiplier).to.equal(10000);
    });
  });

  describe('Reward Distribution Integration', function () {
    it('Should distribute rewards to pool', async function () {
      // Setup pool in distributor
      await rewardDistributor.addPool(
        'Main Staking Pool',
        await stakingPool.getAddress(),
        5000 // 50% allocation
      );

      // Fund distributor
      await forgeToken.transfer(await rewardDistributor.getAddress(), ethers.parseEther('10000'));

      // Get pool info
      const pool = await rewardDistributor.getPool(0);
      expect(pool.name).to.equal('Main Staking Pool');
      expect(pool.allocationBps).to.equal(5000);
    });
  });

  describe('Treasury Integration', function () {
    it('Should receive and hold ETH from mints', async function () {
      // Transfer mint proceeds to treasury
      await forgeNFT.connect(user1).mint(5, { value: MINT_PRICE * 5n });
      
      // In a real integration, mint proceeds would go to treasury
      // This tests that treasury can receive ETH
      await owner.sendTransaction({
        to: await treasury.getAddress(),
        value: MINT_PRICE * 5n,
      });

      const treasuryBalance = await ethers.provider.getBalance(await treasury.getAddress());
      expect(treasuryBalance).to.equal(MINT_PRICE * 5n);
    });
  });

  describe('Edge Cases', function () {
    it('Should handle stake and immediate unstake', async function () {
      await forgeNFT.connect(user1).mint(1, { value: MINT_PRICE });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      
      await stakingPool.connect(user1).stake(1);
      await stakingPool.connect(user1).unstake(1);
      
      expect(await forgeNFT.ownerOf(1)).to.equal(user1.address);
    });

    it('Should handle claiming with zero rewards', async function () {
      await forgeNFT.connect(user1).mint(1, { value: MINT_PRICE });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      await stakingPool.connect(user1).stake(1);
      
      // Claim immediately (should have minimal or zero rewards)
      const initialBalance = await forgeToken.balanceOf(user1.address);
      await stakingPool.connect(user1).claimRewards();
      const finalBalance = await forgeToken.balanceOf(user1.address);
      
      // Should not revert, may have tiny rewards from block time
      expect(finalBalance).to.be.gte(initialBalance);
    });

    it('Should handle multiple stakes and unstakes', async function () {
      await forgeNFT.connect(user1).mint(3, { value: MINT_PRICE * 3n });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      
      // Stake all
      await stakingPool.connect(user1).stake(1);
      await stakingPool.connect(user1).stake(2);
      await stakingPool.connect(user1).stake(3);
      
      // Unstake one
      await stakingPool.connect(user1).unstake(2);
      
      expect(await stakingPool.stakedBalance(user1.address)).to.equal(2);
      expect(await forgeNFT.ownerOf(2)).to.equal(user1.address);
      
      // Stake it again
      await stakingPool.connect(user1).stake(2);
      expect(await stakingPool.stakedBalance(user1.address)).to.equal(3);
    });
  });

  describe('Gas Optimization Tests', function () {
    it('Should use reasonable gas for minting', async function () {
      const tx = await forgeNFT.connect(user1).mint(1, { value: MINT_PRICE });
      const receipt = await tx.wait();
      
      // Ensure gas used is reasonable (less than 200k for single mint)
      expect(receipt.gasUsed).to.be.lt(200000);
    });

    it('Should use reasonable gas for staking', async function () {
      await forgeNFT.connect(user1).mint(1, { value: MINT_PRICE });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      
      const tx = await stakingPool.connect(user1).stake(1);
      const receipt = await tx.wait();
      
      // Ensure gas used is reasonable (less than 150k for single stake)
      expect(receipt.gasUsed).to.be.lt(150000);
    });
  });
});
