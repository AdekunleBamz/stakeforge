const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require("@nomicfoundation/hardhat-network-helpers");

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

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy ForgeNFT
    const ForgeNFT = await ethers.getContractFactory('ForgeNFT');
    forgeNFT = await ForgeNFT.deploy(owner.address);
    await forgeNFT.waitForDeployment();

    // Deploy ForgeToken
    const ForgeToken = await ethers.getContractFactory('ForgeToken');
    forgeToken = await ForgeToken.deploy(owner.address);
    await forgeToken.waitForDeployment();

    // Deploy Treasury
    const Treasury = await ethers.getContractFactory('Treasury');
    treasury = await Treasury.deploy(await forgeToken.getAddress());
    await treasury.waitForDeployment();

    // Deploy StakingPool
    const REWARD_RATE = ethers.parseEther('1') / BigInt(86400); // 1 token per day
    const StakingPool = await ethers.getContractFactory('StakingPool');
    stakingPool = await StakingPool.deploy(
      await forgeNFT.getAddress(),
      await forgeToken.getAddress(),
      REWARD_RATE
    );
    await stakingPool.waitForDeployment();

    // Deploy StakingConfig
    const StakingConfig = await ethers.getContractFactory('StakingConfig');
    stakingConfig = await StakingConfig.deploy();
    await stakingConfig.waitForDeployment();

    // Deploy RewardDistributor
    const RewardDistributor = await ethers.getContractFactory('RewardDistributor');
    rewardDistributor = await RewardDistributor.deploy();
    await rewardDistributor.waitForDeployment();

    // Setup: Transfer tokens to staking pool for rewards
    await forgeToken.transfer(await stakingPool.getAddress(), ethers.parseEther('100000'));
  });

  describe('Full User Journey', function () {
    it('Should complete mint → stake → earn → claim → unstake flow', async function () {
      // Step 1: User mints NFT (tokenId = 0)
      const mintPrice = await forgeNFT.mintPrice();
      await forgeNFT.connect(user1).mint({ value: mintPrice });
      expect(await forgeNFT.balanceOf(user1.address)).to.equal(1);
      expect(await forgeNFT.ownerOf(0)).to.equal(user1.address);

      // Step 2: User approves and stakes NFT
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      await stakingPool.connect(user1).stake(0);
      expect(await forgeNFT.ownerOf(0)).to.equal(await stakingPool.getAddress());
      expect(await stakingPool.totalStaked()).to.equal(1);

      // Step 3: Time passes (need to wait for min stake duration)
      await time.increase(86400); // 1 day

      // Step 4: User claims rewards
      const rewards = await stakingPool.calculateRewards(0);
      expect(rewards).to.be.gt(0);
      
      await stakingPool.connect(user1).claimRewards(0);
      expect(await forgeToken.balanceOf(user1.address)).to.be.gt(0);

      // Step 5: User unstakes NFT
      await stakingPool.connect(user1).unstake(0);
      expect(await forgeNFT.ownerOf(0)).to.equal(user1.address);
      expect(await stakingPool.totalStaked()).to.equal(0);
    });

    it('Should handle multiple users staking', async function () {
      const mintPrice = await forgeNFT.mintPrice();
      
      // User1 mints and stakes
      await forgeNFT.connect(user1).mint({ value: mintPrice });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      await stakingPool.connect(user1).stake(0);

      // User2 mints and stakes
      await forgeNFT.connect(user2).mint({ value: mintPrice });
      await forgeNFT.connect(user2).setApprovalForAll(await stakingPool.getAddress(), true);
      await stakingPool.connect(user2).stake(1);

      expect(await stakingPool.totalStaked()).to.equal(2);

      // Advance time
      await time.increase(86400);

      // Both users should have rewards
      expect(await stakingPool.calculateRewards(0)).to.be.gt(0);
      expect(await stakingPool.calculateRewards(1)).to.be.gt(0);
    });
  });

  describe('Staking Tiers', function () {
    it('Should have default tiers', async function () {
      const tierCount = await stakingConfig.getTierCount();
      expect(tierCount).to.equal(4);
    });
  });

  describe('Treasury', function () {
    it('Should hold reward tokens', async function () {
      await forgeToken.transfer(await treasury.getAddress(), ethers.parseEther('1000'));
      const balance = await forgeToken.balanceOf(await treasury.getAddress());
      expect(balance).to.equal(ethers.parseEther('1000'));
    });

    it('Should authorize staking pool', async function () {
      await treasury.authorizePool(await stakingPool.getAddress(), true);
      expect(await treasury.authorizedPools(await stakingPool.getAddress())).to.be.true;
    });
  });

  describe('Reward Distributor', function () {
    it('Should set pool allocation', async function () {
      await rewardDistributor.setAllocation(await stakingPool.getAddress(), 5000);
      expect(await rewardDistributor.poolAllocation(await stakingPool.getAddress())).to.equal(5000);
    });
  });

  describe('Gas Efficiency', function () {
    it('Should mint NFT with reasonable gas', async function () {
      const mintPrice = await forgeNFT.mintPrice();
      const tx = await forgeNFT.connect(user1).mint({ value: mintPrice });
      const receipt = await tx.wait();
      
      // Should use less than 200k gas
      expect(receipt.gasUsed).to.be.lt(200000);
    });

    it('Should stake with reasonable gas', async function () {
      const mintPrice = await forgeNFT.mintPrice();
      await forgeNFT.connect(user1).mint({ value: mintPrice });
      await forgeNFT.connect(user1).setApprovalForAll(await stakingPool.getAddress(), true);
      
      const tx = await stakingPool.connect(user1).stake(0);
      const receipt = await tx.wait();
      
      // Should use less than 250k gas
      expect(receipt.gasUsed).to.be.lt(250000);
    });
  });
});
