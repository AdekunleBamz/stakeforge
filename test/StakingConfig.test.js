const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingConfig", function () {
  let stakingConfig;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    
    const StakingConfig = await ethers.getContractFactory("StakingConfig");
    stakingConfig = await StakingConfig.deploy();
    await stakingConfig.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await stakingConfig.owner()).to.equal(owner.address);
    });

    it("should have default tiers", async function () {
      const tierCount = await stakingConfig.getTierCount();
      expect(tierCount).to.equal(4);
    });

    it("should have Bronze as first tier", async function () {
      const tier = await stakingConfig.tiers(0);
      expect(tier.name).to.equal("Bronze");
      expect(tier.minDuration).to.equal(0);
      expect(tier.rewardMultiplier).to.equal(10000);
    });

    it("should have Diamond as highest tier", async function () {
      const tier = await stakingConfig.tiers(3);
      expect(tier.name).to.equal("Diamond");
      expect(tier.rewardMultiplier).to.equal(20000);
    });
  });

  describe("Tier Management", function () {
    it("should allow owner to add tier", async function () {
      await stakingConfig.addTier(180 * 24 * 60 * 60, 25000, "Platinum");
      
      const tierCount = await stakingConfig.getTierCount();
      expect(tierCount).to.equal(5);
    });

    it("should not allow non-owner to add tier", async function () {
      await expect(
        stakingConfig.connect(user1).addTier(180 * 24 * 60 * 60, 25000, "Platinum")
      ).to.be.revertedWithCustomError(stakingConfig, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to update tier", async function () {
      await stakingConfig.updateTier(0, 1 * 24 * 60 * 60, 11000);
      
      const tier = await stakingConfig.tiers(0);
      expect(tier.minDuration).to.equal(1 * 24 * 60 * 60);
      expect(tier.rewardMultiplier).to.equal(11000);
    });
  });

  describe("Tier Lookup", function () {
    it("should return Bronze tier for 0 duration", async function () {
      const [tierId, multiplier] = await stakingConfig.getTierForDuration(0);
      expect(tierId).to.equal(0);
      expect(multiplier).to.equal(10000);
    });

    it("should return Silver tier for 7 days", async function () {
      const [tierId, multiplier] = await stakingConfig.getTierForDuration(7 * 24 * 60 * 60);
      expect(tierId).to.equal(1);
      expect(multiplier).to.equal(12500);
    });

    it("should return Diamond tier for 90+ days", async function () {
      const [tierId, multiplier] = await stakingConfig.getTierForDuration(100 * 24 * 60 * 60);
      expect(tierId).to.equal(3);
      expect(multiplier).to.equal(20000);
    });

    it("should return all tiers", async function () {
      const tiers = await stakingConfig.getAllTiers();
      expect(tiers.length).to.equal(4);
    });
  });
});
