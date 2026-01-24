const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  const BlockNotice = await hre.ethers.getContractFactory("BlockNotice");
  const contract = await BlockNotice.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ BlockNotice deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
