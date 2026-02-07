const { ethers } = require('ethers');
const Notice = require('./models/Notice');
const fs = require('fs');
const path = require('path');

async function startListener(contractAddress, provider) {
  console.log('Starting Blockchain Listener...');

  // Load ABI
  const artifactPath = path.resolve(__dirname, '../blockchain/artifacts/contracts/BlockNotice.sol/BlockNotice.json');
  if (!fs.existsSync(artifactPath)) {
    console.error(`Artifact not found at ${artifactPath}. Please compile contracts first.`);
    return;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const abi = artifact.abi;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log(`Listening for NoticePosted events on contract: ${contractAddress}`);

  contract.on("NoticePosted", async (noticeId, author, title, timestamp, event) => {
    console.log(`Event detected: NoticePosted (ID: ${noticeId})`);

    try {
      // Fetch full notice details including content
      // Note: noticeId is BigInt in ethers v6
      const noticeStruct = await contract.getNotice(noticeId);

      const newNotice = {
        noticeId: Number(noticeStruct.id),
        author: noticeStruct.author,
        title: noticeStruct.title,
        content: noticeStruct.content,
        timestamp: Number(noticeStruct.timestamp)
      };

      // Upsert to avoid duplicates
      await Notice.findOneAndUpdate(
        { noticeId: newNotice.noticeId },
        newNotice,
        { upsert: true, new: true }
      );

      console.log(`✅ Notice ${newNotice.noticeId} synced to MongoDB.`);
    } catch (error) {
      console.error("Error syncing notice:", error);
    }
  });
}

module.exports = { startListener };
