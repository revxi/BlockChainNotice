const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  const NoticeLedger = await hre.ethers.getContractFactory("NoticeLedger");
  const contract = await NoticeLedger.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ NoticeLedger deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
