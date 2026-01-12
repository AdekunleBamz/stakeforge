const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardDistributor", function () {
  let rewardDistributor;
  let owner;
  let pool1;
  let pool2;

  beforeEach(async function () {
    [owner, pool1, pool2] = await ethers.getSigners();
    
    const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
    rewardDistributor = await RewardDistributor.deploy();
    await rewardDistributor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await rewardDistributor.owner()).to.equal(owner.address);
    });

    it("should have zero total allocation initially", async function () {
      expect(await rewardDistributor.totalAllocation()).to.equal(0);
    });
  });

  describe("Allocation Management", function () {
    it("should allow owner to set allocation", async function () {
      await rewardDistributor.setAllocation(pool1.address, 5000);
      expect(await rewardDistributor.poolAllocation(pool1.address)).to.equal(5000);
    });

    it("should update total allocation correctly", async function () {
      await rewardDistributor.setAllocation(pool1.address, 5000);
      await rewardDistributor.setAllocation(pool2.address, 3000);
      expect(await rewardDistributor.totalAllocation()).to.equal(8000);
    });

    it("should not allow allocation over 100%", async function () {
      await rewardDistributor.setAllocation(pool1.address, 8000);
      await expect(
        rewardDistributor.setAllocation(pool2.address, 3000)
      ).to.be.revertedWith("Total exceeds 100%");
    });

    it("should allow updating existing allocation", async function () {
      await rewardDistributor.setAllocation(pool1.address, 5000);
      await rewardDistributor.setAllocation(pool1.address, 3000);
      expect(await rewardDistributor.poolAllocation(pool1.address)).to.equal(3000);
      expect(await rewardDistributor.totalAllocation()).to.equal(3000);
    });
  });

  describe("Distribution Scheduling", function () {
    beforeEach(async function () {
      await rewardDistributor.setAllocation(pool1.address, 5000);
    });

    it("should schedule distribution for allocated pool", async function () {
      await rewardDistributor.scheduleDistribution(pool1.address, ethers.parseEther("1000"));
      expect(await rewardDistributor.getDistributionCount()).to.equal(1);
    });

    it("should not schedule for unallocated pool", async function () {
      await expect(
        rewardDistributor.scheduleDistribution(pool2.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("Pool not allocated");
    });

    it("should track pending distributions", async function () {
      await rewardDistributor.scheduleDistribution(pool1.address, ethers.parseEther("1000"));
      await rewardDistributor.scheduleDistribution(pool1.address, ethers.parseEther("2000"));
      expect(await rewardDistributor.getPendingCount()).to.equal(2);
    });
  });
});
