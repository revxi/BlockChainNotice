const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const { startListener } = require('../listener');
const Notice = require('../models/Notice');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Starting verification script...");

  // 1. Start MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB Memory Server started:", mongoUri);

  // 2. Start Hardhat Node
  console.log("Starting Hardhat Node...");
  const blockchainDir = path.resolve(__dirname, '../../blockchain');
  const hardhatNode = spawn('npx', ['hardhat', 'node'], {
    cwd: blockchainDir,
    detached: true,
    stdio: 'ignore'
  });

  // Wait for node to start
  await sleep(5000);

  try {
    // 3. Deploy Contract
    console.log("Deploying contract...");
    // We can use the existing deploy script, but capturing output is tricky with spawn/exec.
    // Let's assume standard deterministic address or parse output.
    // Actually, let's just use ethers to deploy it directly here if we have artifacts.
    // But artifacts might not be compiled. Let's compile first.

    // Compile first
    await new Promise((resolve, reject) => {
        exec('npx hardhat compile', { cwd: blockchainDir }, (err, stdout, stderr) => {
            if (err) { console.error(stderr); reject(err); }
            else resolve();
        });
    });

    // Load artifact
    const artifactPath = path.resolve(blockchainDir, 'artifacts/contracts/BlockNotice.sol/BlockNotice.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner(); // First account

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log(`✅ Contract deployed at: ${contractAddress}`);

    // 4. Start Listener
    await startListener(contractAddress, provider);

    // 5. Post Notice
    console.log("Posting a notice...");
    const tx = await contract.postNotice("Test Title", "Test Content");
    await tx.wait();
    console.log("✅ Notice posted on blockchain.");

    // 6. Wait for sync
    console.log("Waiting for listener to sync...");
    await sleep(5000);

    // 7. Verify in MongoDB
    const notices = await Notice.find({});
    console.log(`Found ${notices.length} notices in MongoDB.`);

    if (notices.length === 1 && notices[0].title === "Test Title" && notices[0].content === "Test Content") {
      console.log("✅ SUCCESS: Notice found in MongoDB with correct data!");
    } else {
      console.error("❌ FAILURE: Notice not found or incorrect data.");
      console.log("Notices found:", notices);
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Error during verification:", error);
    process.exit(1);
  } finally {
    // Cleanup
    if (hardhatNode) process.kill(-hardhatNode.pid); // Kill process group if possible, or just kill pid
    // Since detached: true, we need to be careful.
    // Actually, just killing the pid might verify script end but leave node running.
    // Better to just killall node or leave it for sandbox cleanup.
    try { process.kill(hardhatNode.pid); } catch(e) {}

    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("Cleanup complete.");
    process.exit(0);
  }
}

main();
