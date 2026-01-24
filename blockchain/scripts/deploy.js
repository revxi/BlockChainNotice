import hre from "hardhat";

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the contract factory
  const BlockNotice = await hre.ethers.getContractFactory("BlockNotice");

  // Deploy the contract
  const contract = await BlockNotice.deploy();

  // Wait for deployment to finish
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ BlockNotice deployed to:", address);
  console.log("📝 Copy this address to your frontend .env file!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});