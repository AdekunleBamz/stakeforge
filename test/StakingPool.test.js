const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StakingPool", function () {
  let forgeNFT;
  let forgeToken;
  let stakingPool;
  let owner;
  let staker;

  const REWARD_RATE = ethers.parseEther("1") / BigInt(86400); // 1 token per day

  beforeEach(async function () {
    [owner, staker] = await ethers.getSigners();

    // Deploy ForgeNFT
    const ForgeNFT = await ethers.getContractFactory("ForgeNFT");
    forgeNFT = await ForgeNFT.deploy();
    await forgeNFT.waitForDeployment();

    // Deploy ForgeToken
    const ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await ForgeToken.deploy();
    await forgeToken.waitForDeployment();

    // Deploy StakingPool
    const StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy(
      await forgeNFT.getAddress(),
      await forgeToken.getAddress(),
      REWARD_RATE
    );
    await stakingPool.waitForDeployment();

    // Setup: Transfer tokens to staking pool for rewards
    await forgeToken.transfer(
      await stakingPool.getAddress(),
      ethers.parseEther("10000")
    );

    // Mint NFT to staker
    const mintPrice = await forgeNFT.mintPrice();
    await forgeNFT.connect(staker).mint({ value: mintPrice });
  });

  describe("Deployment", function () {
    it("Should set the right NFT contract", async function () {
      expect(await stakingPool.nftContract()).to.equal(await forgeNFT.getAddress());
    });

    it("Should set the right reward token", async function () {
      expect(await stakingPool.rewardToken()).to.equal(await forgeToken.getAddress());
    });

    it("Should set the right reward rate", async function () {
      expect(await stakingPool.rewardRate()).to.equal(REWARD_RATE);
    });

    it("Should have staking enabled by default", async function () {
      expect(await stakingPool.stakingEnabled()).to.be.true;
    });
  });

  describe("Staking", function () {
    it("Should stake an NFT", async function () {
      // Approve staking pool
      await forgeNFT.connect(staker).setApprovalForAll(
        await stakingPool.getAddress(),
        true
      );

      // Stake
      await stakingPool.connect(staker).stake(1);

      expect(await forgeNFT.ownerOf(1)).to.equal(await stakingPool.getAddress());
      expect(await stakingPool.totalStaked()).to.equal(1);
    });

    it("Should fail if not NFT owner", async function () {
      await forgeNFT.connect(staker).setApprovalForAll(
        await stakingPool.getAddress(),
        true
      );

      await expect(
        stakingPool.connect(owner).stake(1)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should emit Staked event", async function () {
      await forgeNFT.connect(staker).setApprovalForAll(
        await stakingPool.getAddress(),
        true
      );

      await expect(stakingPool.connect(staker).stake(1))
        .to.emit(stakingPool, "Staked")
        .withArgs(staker.address, 1, await time.latest() + 1);
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      await forgeNFT.connect(staker).setApprovalForAll(
        await stakingPool.getAddress(),
        true
      );
      await stakingPool.connect(staker).stake(1);
    });

    it("Should fail if min stake duration not met", async function () {
      await expect(
        stakingPool.connect(staker).unstake(1)
      ).to.be.revertedWith("Min stake duration not met");
    });

    it("Should unstake after min duration", async function () {
      // Fast forward 1 day
      await time.increase(86400);

      await stakingPool.connect(staker).unstake(1);

      expect(await forgeNFT.ownerOf(1)).to.equal(staker.address);
      expect(await stakingPool.totalStaked()).to.equal(0);
    });

    it("Should claim rewards on unstake", async function () {
      // Fast forward 1 day
      await time.increase(86400);

      const initialBalance = await forgeToken.balanceOf(staker.address);
      await stakingPool.connect(staker).unstake(1);
      const finalBalance = await forgeToken.balanceOf(staker.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Rewards", function () {
    beforeEach(async function () {
      await forgeNFT.connect(staker).setApprovalForAll(
        await stakingPool.getAddress(),
        true
      );
      await stakingPool.connect(staker).stake(1);
    });

    it("Should calculate pending rewards", async function () {
      // Fast forward 1 day
      await time.increase(86400);

      const rewards = await stakingPool.calculateRewards(1);
      const expectedRewards = REWARD_RATE * BigInt(86400);

      // Allow 1 second tolerance
      expect(rewards).to.be.closeTo(expectedRewards, REWARD_RATE);
    });

    it("Should claim rewards without unstaking", async function () {
      // Fast forward 1 day
      await time.increase(86400);

      await stakingPool.connect(staker).claimRewards(1);

      // NFT should still be staked
      expect(await forgeNFT.ownerOf(1)).to.equal(await stakingPool.getAddress());
      // Balance should increase
      expect(await forgeToken.balanceOf(staker.address)).to.be.gt(0);
    });
  });
});
