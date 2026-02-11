const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice", function () {
  let blockNotice;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const BlockNotice = await ethers.getContractFactory("BlockNotice");
    blockNotice = await BlockNotice.deploy();
    await blockNotice.waitForDeployment();
  });

  describe("postNotice", function () {
    it("Should post a new notice successfully", async function () {
      const title = "Test Notice";
      const content = "This is a test notice content.";

      // Capture the transaction
      const tx = await blockNotice.connect(addr1).postNotice(title, content);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Get the block timestamp
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      // Check for the event
      await expect(tx)
        .to.emit(blockNotice, "NoticePosted")
        .withArgs(0, addr1.address, title, block.timestamp);

      // Check if the notice is stored correctly
      const notice = await blockNotice.notices(0);
      expect(notice.id).to.equal(0n);
      expect(notice.author).to.equal(addr1.address);
      expect(notice.title).to.equal(title);
      expect(notice.content).to.equal(content);
      expect(notice.timestamp).to.equal(block.timestamp);

      // Check if the notice ID is added to userNotices
      const userNotices = await blockNotice.getUserNotices(addr1.address);
      expect(userNotices.length).to.equal(1);
      expect(userNotices[0]).to.equal(0n);
    });

    it("Should handle multiple notices from different users", async function () {
        await blockNotice.connect(addr1).postNotice("Title 1", "Content 1");
        await blockNotice.connect(addr2).postNotice("Title 2", "Content 2");
        await blockNotice.connect(addr1).postNotice("Title 3", "Content 3");

        const count = await blockNotice.getNoticeCount();
        expect(count).to.equal(3n);

        const userNotices1 = await blockNotice.getUserNotices(addr1.address);
        expect(userNotices1.length).to.equal(2);
        expect(userNotices1[0]).to.equal(0n);
        expect(userNotices1[1]).to.equal(2n);

        const userNotices2 = await blockNotice.getUserNotices(addr2.address);
        expect(userNotices2.length).to.equal(1);
        expect(userNotices2[0]).to.equal(1n);
    });

    it("Should handle empty title and content", async function () {
        await blockNotice.connect(addr1).postNotice("", "");
        const notice = await blockNotice.notices(0);
        expect(notice.title).to.equal("");
        expect(notice.content).to.equal("");
    });
  });
});
