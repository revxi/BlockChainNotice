const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  const signers = await hre.ethers.getSigners();
  // Use first 3 accounts as admins
  const admins = signers.slice(0, 3).map(s => s.address);
  // Require 2 signatures
  const confirmationsRequired = 2;

  console.log("Admins:", admins);
  console.log("Confirmations Required:", confirmationsRequired);

  const BlockNotice = await hre.ethers.getContractFactory("BlockNotice");
  const contract = await BlockNotice.deploy(admins, confirmationsRequired);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ BlockNotice deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
