const hre = require("hardhat");

async function main() {
  console.log("Deploying StakeForge contracts to", hre.network.name);
  console.log("=".repeat(50));

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // 1. Deploy ForgeNFT
  console.log("1. Deploying ForgeNFT...");
  const ForgeNFT = await hre.ethers.getContractFactory("ForgeNFT");
  const forgeNFT = await ForgeNFT.deploy();
  await forgeNFT.waitForDeployment();
  const forgeNFTAddress = await forgeNFT.getAddress();
  console.log("   ForgeNFT deployed to:", forgeNFTAddress);

  // 2. Deploy ForgeToken
  console.log("2. Deploying ForgeToken...");
  const ForgeToken = await hre.ethers.getContractFactory("ForgeToken");
  const forgeToken = await ForgeToken.deploy();
  await forgeToken.waitForDeployment();
  const forgeTokenAddress = await forgeToken.getAddress();
  console.log("   ForgeToken deployed to:", forgeTokenAddress);

  // 3. Deploy Treasury
  console.log("3. Deploying Treasury...");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(forgeTokenAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("   Treasury deployed to:", treasuryAddress);

  // 4. Deploy StakingPool
  // Reward rate: 1 token per day = 1e18 / 86400 ≈ 11574074074074 wei per second
  const rewardRate = hre.ethers.parseEther("1") / BigInt(86400);
  console.log("4. Deploying StakingPool...");
  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(
    forgeNFTAddress,
    forgeTokenAddress,
    rewardRate
  );
  await stakingPool.waitForDeployment();
  const stakingPoolAddress = await stakingPool.getAddress();
  console.log("   StakingPool deployed to:", stakingPoolAddress);

  console.log("");
  console.log("=".repeat(50));
  console.log("Deployment complete!");
  console.log("");
  console.log("Contract Addresses:");
  console.log("  ForgeNFT:", forgeNFTAddress);
  console.log("  ForgeToken:", forgeTokenAddress);
  console.log("  Treasury:", treasuryAddress);
  console.log("  StakingPool:", stakingPoolAddress);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Add StakingPool as minter: forgeToken.addMinter(stakingPoolAddress)");
  console.log("  2. Authorize StakingPool in Treasury: treasury.authorizePool(stakingPoolAddress, true)");
  console.log("  3. Transfer tokens to Treasury for rewards");

  return {
    forgeNFT: forgeNFTAddress,
    forgeToken: forgeTokenAddress,
    treasury: treasuryAddress,
    stakingPool: stakingPoolAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
