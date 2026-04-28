const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice", function () {
  let blockNotice;
  let admin;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [admin, addr1, addr2] = await ethers.getSigners();
    const BlockNotice = await ethers.getContractFactory("BlockNotice");
    blockNotice = await BlockNotice.deploy();
    await blockNotice.waitForDeployment();
  });

  describe("postNotice", function () {
    it("Should post a new notice successfully", async function () {
      const title = "Test Notice";
      const content = "This is a test notice content.";

      // Only admin can post a notice
      const tx = await blockNotice.connect(admin).postNotice(title, content);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Get the block timestamp
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      // Check for the event
      await expect(tx)
        .to.emit(blockNotice, "NoticePosted")
        .withArgs(0n, admin.address, title, block.timestamp);

      // Check if the notice is stored correctly
      const notice = await blockNotice.notices(0);
      expect(notice.id).to.equal(0n);
      expect(notice.author).to.equal(admin.address);
      expect(notice.title).to.equal(title);
      expect(notice.content).to.equal(content);
      expect(notice.timestamp).to.equal(block.timestamp);

      // Check if the notice ID is added to userNotices
      const userNotices = await blockNotice.getUserNotices(admin.address);
      expect(userNotices.length).to.equal(1);
      expect(userNotices[0]).to.equal(0n);
    });

    it("Should handle multiple notices", async function () {
        await blockNotice.connect(admin).postNotice("Title 1", "Content 1");
        await blockNotice.connect(admin).postNotice("Title 2", "Content 2");
        await blockNotice.connect(admin).postNotice("Title 3", "Content 3");

        const count = await blockNotice.getNoticeCount();
        expect(count).to.equal(3n);

        const adminNotices = await blockNotice.getUserNotices(admin.address);
        expect(adminNotices.length).to.equal(3);
        expect(adminNotices[0]).to.equal(0n);
        expect(adminNotices[1]).to.equal(1n);
        expect(adminNotices[2]).to.equal(2n);
    });

    it("Should handle empty title and content", async function () {
        await blockNotice.connect(admin).postNotice("", "");
        const notice = await blockNotice.notices(0);
        expect(notice.title).to.equal("");
        expect(notice.content).to.equal("");
    });

    it("Should set the right admin", async function () {
      expect(await blockNotice.admin()).to.equal(admin.address);
    });

    it("Should prevent non-admins from posting a notice", async function () {
      const title = "Test Notice";
      const content = "Test Content";

      await expect(
        blockNotice.connect(addr1).postNotice(title, content)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should allow admin to post a notice", async function () {
      const title = "Official Notice";
      const content = "Official Content";

      await expect(blockNotice.connect(admin).postNotice(title, content))
        .to.emit(blockNotice, "NoticePosted");

      const count = await blockNotice.getNoticeCount();
      expect(count).to.equal(1n);
    });
  });

  describe("getNoticeCount", function () {
    it("Should return 0 when no notices are posted", async function () {
      expect(await blockNotice.getNoticeCount()).to.equal(0n);
    });

    it("Should return 1 after one notice is posted", async function () {
      await blockNotice.connect(admin).postNotice("Title", "Content");
      expect(await blockNotice.getNoticeCount()).to.equal(1n);
    });

    it("Should return the correct count for multiple notices", async function () {
      await blockNotice.connect(admin).postNotice("Title 1", "Content 1");
      await blockNotice.connect(admin).postNotice("Title 2", "Content 2");
      await blockNotice.connect(admin).postNotice("Title 3", "Content 3");
      expect(await blockNotice.getNoticeCount()).to.equal(3n);
    });
  });

  describe("getNotice", function () {
    it("Should revert with NoticeDoesNotExist if ID is out of bounds", async function () {
      await expect(blockNotice.getNotice(0))
        .to.be.revertedWithCustomError(blockNotice, "NoticeDoesNotExist")
        .withArgs(0n);
    });

    it("Should return the correct notice", async function () {
      await blockNotice.connect(admin).postNotice("Title", "Content");
      const notice = await blockNotice.getNotice(0);
      expect(notice.title).to.equal("Title");
    });
  });
});
