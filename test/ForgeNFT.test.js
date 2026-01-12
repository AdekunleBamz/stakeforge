const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ForgeNFT", function () {
  let forgeNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const ForgeNFT = await ethers.getContractFactory("ForgeNFT");
    forgeNFT = await ForgeNFT.deploy();
    await forgeNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await forgeNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await forgeNFT.name()).to.equal("ForgeNFT");
      expect(await forgeNFT.symbol()).to.equal("FORGE");
    });

    it("Should have correct max supply", async function () {
      expect(await forgeNFT.MAX_SUPPLY()).to.equal(10000);
    });

    it("Should have correct mint price", async function () {
      expect(await forgeNFT.mintPrice()).to.equal(ethers.parseEther("0.001"));
    });
  });

  describe("Minting", function () {
    it("Should mint a single NFT", async function () {
      const mintPrice = await forgeNFT.mintPrice();
      await forgeNFT.connect(addr1).mint({ value: mintPrice });
      
      expect(await forgeNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await forgeNFT.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if insufficient payment", async function () {
      await expect(
        forgeNFT.connect(addr1).mint({ value: 0 })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should emit Transfer event on mint", async function () {
      const mintPrice = await forgeNFT.mintPrice();
      
      await expect(forgeNFT.connect(addr1).mint({ value: mintPrice }))
        .to.emit(forgeNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 1);
    });
  });

  describe("Batch Minting", function () {
    it("Should mint multiple NFTs", async function () {
      const mintPrice = await forgeNFT.mintPrice();
      const quantity = 5;
      const totalCost = mintPrice * BigInt(quantity);
      
      await forgeNFT.connect(addr1).mintBatch(quantity, { value: totalCost });
      
      expect(await forgeNFT.balanceOf(addr1.address)).to.equal(quantity);
    });

    it("Should fail if quantity is zero", async function () {
      await expect(
        forgeNFT.connect(addr1).mintBatch(0)
      ).to.be.revertedWith("Quantity must be greater than 0");
    });

    it("Should fail if quantity exceeds max per tx", async function () {
      await expect(
        forgeNFT.connect(addr1).mintBatch(11, { value: ethers.parseEther("0.011") })
      ).to.be.revertedWith("Exceeds max per transaction");
    });
  });

  describe("Owner Minting", function () {
    it("Should allow owner to mint for free", async function () {
      await forgeNFT.ownerMint(addr1.address, 5);
      expect(await forgeNFT.balanceOf(addr1.address)).to.equal(5);
    });

    it("Should not allow non-owner to owner mint", async function () {
      await expect(
        forgeNFT.connect(addr1).ownerMint(addr1.address, 5)
      ).to.be.reverted;
    });
  });

  describe("Withdrawals", function () {
    it("Should allow owner to withdraw ETH", async function () {
      const mintPrice = await forgeNFT.mintPrice();
      await forgeNFT.connect(addr1).mint({ value: mintPrice });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await forgeNFT.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
