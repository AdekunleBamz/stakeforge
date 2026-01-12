const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ForgeToken", function () {
  let forgeToken;
  let owner;
  let minter;
  let addr1;

  beforeEach(async function () {
    [owner, minter, addr1] = await ethers.getSigners();
    
    const ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await ForgeToken.deploy();
    await forgeToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await forgeToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await forgeToken.name()).to.equal("ForgeToken");
      expect(await forgeToken.symbol()).to.equal("FORGE");
    });

    it("Should mint initial supply to owner", async function () {
      const initialSupply = ethers.parseEther("100000000"); // 100M
      expect(await forgeToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("Should have correct max supply", async function () {
      const maxSupply = ethers.parseEther("1000000000"); // 1B
      expect(await forgeToken.MAX_SUPPLY()).to.equal(maxSupply);
    });
  });

  describe("Minter Management", function () {
    it("Should add minter", async function () {
      await forgeToken.addMinter(minter.address);
      expect(await forgeToken.isMinter(minter.address)).to.be.true;
    });

    it("Should remove minter", async function () {
      await forgeToken.addMinter(minter.address);
      await forgeToken.removeMinter(minter.address);
      expect(await forgeToken.isMinter(minter.address)).to.be.false;
    });

    it("Should emit MinterAdded event", async function () {
      await expect(forgeToken.addMinter(minter.address))
        .to.emit(forgeToken, "MinterAdded")
        .withArgs(minter.address);
    });

    it("Should emit MinterRemoved event", async function () {
      await forgeToken.addMinter(minter.address);
      await expect(forgeToken.removeMinter(minter.address))
        .to.emit(forgeToken, "MinterRemoved")
        .withArgs(minter.address);
    });

    it("Should not allow non-owner to add minter", async function () {
      await expect(
        forgeToken.connect(addr1).addMinter(minter.address)
      ).to.be.reverted;
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await forgeToken.addMinter(minter.address);
    });

    it("Should allow minter to mint", async function () {
      const amount = ethers.parseEther("1000");
      await forgeToken.connect(minter).mint(addr1.address, amount);
      expect(await forgeToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should not allow non-minter to mint", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        forgeToken.connect(addr1).mint(addr1.address, amount)
      ).to.be.revertedWith("Not authorized to mint");
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = await forgeToken.MAX_SUPPLY();
      const currentSupply = await forgeToken.totalSupply();
      const excessAmount = maxSupply - currentSupply + BigInt(1);
      
      await expect(
        forgeToken.connect(minter).mint(addr1.address, excessAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("Burning", function () {
    it("Should burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await forgeToken.balanceOf(owner.address);
      
      await forgeToken.burn(burnAmount);
      
      expect(await forgeToken.balanceOf(owner.address))
        .to.equal(initialBalance - burnAmount);
    });
  });
});
