const hre = require("hardhat");

async function main() {
  console.log("Setting up StakeForge contracts...");
  console.log("=".repeat(50));

  // Contract addresses - update these after deployment
  const FORGE_NFT = process.env.FORGE_NFT_ADDRESS;
  const FORGE_TOKEN = process.env.FORGE_TOKEN_ADDRESS;
  const TREASURY = process.env.TREASURY_ADDRESS;
  const STAKING_POOL = process.env.STAKING_POOL_ADDRESS;

  if (!FORGE_TOKEN || !TREASURY || !STAKING_POOL) {
    console.error("Please set contract addresses in .env file");
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Executing from:", deployer.address);
  console.log("");

  // Get contract instances
  const forgeToken = await hre.ethers.getContractAt("ForgeToken", FORGE_TOKEN);
  const treasury = await hre.ethers.getContractAt("Treasury", TREASURY);

  // 1. Add StakingPool as minter
  console.log("1. Adding StakingPool as minter...");
  const tx1 = await forgeToken.addMinter(STAKING_POOL);
  await tx1.wait();
  console.log("   Done! StakingPool can now mint reward tokens");

  // 2. Authorize StakingPool in Treasury
  console.log("2. Authorizing StakingPool in Treasury...");
  const tx2 = await treasury.authorizePool(STAKING_POOL, true);
  await tx2.wait();
  console.log("   Done! StakingPool is now authorized");

  // 3. Transfer initial tokens to Treasury
  const treasuryAmount = hre.ethers.parseEther("10000000"); // 10M tokens
  console.log("3. Transferring 10M tokens to Treasury...");
  const tx3 = await forgeToken.transfer(TREASURY, treasuryAmount);
  await tx3.wait();
  console.log("   Done! Treasury funded with 10M FORGE tokens");

  console.log("");
  console.log("=".repeat(50));
  console.log("Setup complete! StakeForge is ready to use.");
  
  // Verify setup
  console.log("");
  console.log("Verification:");
  const isMinter = await forgeToken.isMinter(STAKING_POOL);
  console.log("  StakingPool is minter:", isMinter);
  
  const isAuthorized = await treasury.authorizedPools(STAKING_POOL);
  console.log("  StakingPool is authorized:", isAuthorized);
  
  const treasuryBalance = await forgeToken.balanceOf(TREASURY);
  console.log("  Treasury balance:", hre.ethers.formatEther(treasuryBalance), "FORGE");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
