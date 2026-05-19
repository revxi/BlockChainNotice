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

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await blockNotice.admin()).to.equal(admin.address);
    });
  });

  describe("postNotice", function () {
    it("Should allow admin to post a new notice successfully", async function () {
      const title = "Test Notice";
      const content = "This is a test notice content.";

      const tx = await blockNotice.connect(admin).postNotice(title, content);
      const receipt = await tx.wait();
      const blockData = await ethers.provider.getBlock(receipt.blockNumber);
      const timestamp = blockData.timestamp;

      await expect(tx)
        .to.emit(blockNotice, "NoticePosted")
        .withArgs(0n, admin.address, title, timestamp);

      const notice = await blockNotice.notices(0);
      expect(notice.id).to.equal(0n);
      expect(notice.author).to.equal(admin.address);
      expect(notice.title).to.equal(title);
      expect(notice.content).to.equal(content);
      expect(notice.timestamp).to.equal(BigInt(timestamp));

      const userNotices = await blockNotice.getUserNotices(admin.address);
      expect(userNotices.length).to.equal(1);
      expect(userNotices[0]).to.equal(0n);
    });

    it("Should prevent non-admins from posting a notice", async function () {
      const title = "Unauthorized Notice";
      const content = "Unauthorized Content";

      await expect(
        blockNotice.connect(addr1).postNotice(title, content)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should handle multiple notices from admin", async function () {
      await blockNotice.connect(admin).postNotice("Title 1", "Content 1");
      await blockNotice.connect(admin).postNotice("Title 2", "Content 2");

      const count = await blockNotice.getNoticeCount();
      expect(count).to.equal(2n);

      const userNotices = await blockNotice.getUserNotices(admin.address);
      expect(userNotices.length).to.equal(2);
      expect(userNotices[0]).to.equal(0n);
      expect(userNotices[1]).to.equal(1n);
    });

    it("Should revert if title is empty", async function () {
      await expect(
        blockNotice.connect(admin).postNotice("", "Content")
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should revert if content is empty", async function () {
      await expect(
        blockNotice.connect(admin).postNotice("Title", "")
      ).to.be.revertedWith("Content cannot be empty");
    });

    it("Should revert if title is too long", async function () {
      const longTitle = "a".repeat(101);
      await expect(
        blockNotice.connect(admin).postNotice(longTitle, "Content")
      ).to.be.revertedWith("Title is too long");
    });

    it("Should revert if content is too long", async function () {
      const longContent = "a".repeat(1001);
      await expect(
        blockNotice.connect(admin).postNotice("Title", longContent)
      ).to.be.revertedWith("Content is too long");
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
    it("Should return the correct notice", async function () {
      await blockNotice.connect(admin).postNotice("Title", "Content");
      const notice = await blockNotice.getNotice(0);
      expect(notice.title).to.equal("Title");
      expect(notice.content).to.equal("Content");
    });

    it("Should revert if notice does not exist", async function () {
      await expect(blockNotice.getNotice(999n))
        .to.be.revertedWithCustomError(blockNotice, "NoticeDoesNotExist")
        .withArgs(999n);
    });
  });
});
