const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Treasury", function () {
  let forgeToken;
  let treasury;
  let stakingPool;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy ForgeToken
    const ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await ForgeToken.deploy();
    await forgeToken.waitForDeployment();

    // Deploy Treasury
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(await forgeToken.getAddress());
    await treasury.waitForDeployment();

    // Transfer tokens to treasury
    await forgeToken.transfer(
      await treasury.getAddress(),
      ethers.parseEther("1000000")
    );

    // Mock staking pool address
    stakingPool = addr1;
  });

  describe("Deployment", function () {
    it("Should set the right reward token", async function () {
      expect(await treasury.rewardToken()).to.equal(await forgeToken.getAddress());
    });

    it("Should have correct daily limit", async function () {
      expect(await treasury.dailyLimit()).to.equal(ethers.parseEther("100000"));
    });
  });

  describe("Pool Authorization", function () {
    it("Should authorize a pool", async function () {
      await treasury.authorizePool(stakingPool.address, true);
      expect(await treasury.authorizedPools(stakingPool.address)).to.be.true;
    });

    it("Should revoke pool authorization", async function () {
      await treasury.authorizePool(stakingPool.address, true);
      await treasury.authorizePool(stakingPool.address, false);
      expect(await treasury.authorizedPools(stakingPool.address)).to.be.false;
    });

    it("Should emit PoolAuthorized event", async function () {
      await expect(treasury.authorizePool(stakingPool.address, true))
        .to.emit(treasury, "PoolAuthorized")
        .withArgs(stakingPool.address, true);
    });

    it("Should not allow non-owner to authorize", async function () {
      await expect(
        treasury.connect(addr1).authorizePool(addr1.address, true)
      ).to.be.reverted;
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function () {
      await treasury.authorizePool(stakingPool.address, true);
    });

    it("Should distribute rewards to authorized pool", async function () {
      const amount = ethers.parseEther("1000");
      await treasury.distributeRewards(stakingPool.address, amount);

      expect(await forgeToken.balanceOf(stakingPool.address)).to.equal(amount);
    });

    it("Should fail for unauthorized pool", async function () {
      await treasury.authorizePool(stakingPool.address, false);
      
      await expect(
        treasury.distributeRewards(stakingPool.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("Pool not authorized");
    });

    it("Should respect daily limit", async function () {
      const dailyLimit = await treasury.dailyLimit();
      
      await expect(
        treasury.distributeRewards(stakingPool.address, dailyLimit + BigInt(1))
      ).to.be.revertedWith("Daily limit exceeded");
    });

    it("Should reset daily limit after 24 hours", async function () {
      const amount = ethers.parseEther("50000");
      
      // First distribution
      await treasury.distributeRewards(stakingPool.address, amount);
      
      // Fast forward 1 day
      await time.increase(86400);
      
      // Should be able to distribute again
      await treasury.distributeRewards(stakingPool.address, amount);
    });

    it("Should track total distributed", async function () {
      const amount = ethers.parseEther("1000");
      await treasury.distributeRewards(stakingPool.address, amount);

      expect(await treasury.totalDistributed()).to.equal(amount);
    });
  });

  describe("Token Management", function () {
    it("Should deposit tokens", async function () {
      const amount = ethers.parseEther("10000");
      await forgeToken.approve(await treasury.getAddress(), amount);
      
      const initialBalance = await treasury.getBalance();
      await treasury.depositTokens(amount);
      
      expect(await treasury.getBalance()).to.equal(initialBalance + amount);
    });

    it("Should withdraw tokens (emergency)", async function () {
      const amount = ethers.parseEther("10000");
      await treasury.withdrawTokens(owner.address, amount);

      expect(await forgeToken.balanceOf(owner.address)).to.be.gt(0);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        treasury.connect(addr1).withdrawTokens(addr1.address, ethers.parseEther("1000"))
      ).to.be.reverted;
    });
  });

  describe("Daily Limit Management", function () {
    it("Should update daily limit", async function () {
      const newLimit = ethers.parseEther("200000");
      await treasury.setDailyLimit(newLimit);

      expect(await treasury.dailyLimit()).to.equal(newLimit);
    });

    it("Should emit DailyLimitUpdated event", async function () {
      const oldLimit = await treasury.dailyLimit();
      const newLimit = ethers.parseEther("200000");

      await expect(treasury.setDailyLimit(newLimit))
        .to.emit(treasury, "DailyLimitUpdated")
        .withArgs(oldLimit, newLimit);
    });
  });
});
