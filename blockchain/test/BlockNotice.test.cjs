const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("BlockNotice", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBlockNoticeFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BlockNotice = await ethers.getContractFactory("BlockNotice");
    const blockNotice = await BlockNotice.deploy();

    return { blockNotice, owner, otherAccount };
  }

  describe("getNotice", function () {
    it("Should retrieve a posted notice correctly", async function () {
      const { blockNotice, owner } = await loadFixture(deployBlockNoticeFixture);

      const title = "Test Notice";
      const content = "This is a test notice content.";

      await blockNotice.postNotice(title, content);

      const notice = await blockNotice.getNotice(0);

      expect(notice.title).to.equal(title);
      expect(notice.content).to.equal(content);
      expect(notice.author).to.equal(owner.address);
      // timestamp should be close to current time, but we can skip precise check or check > 0
      expect(notice.timestamp).to.be.gt(0);
    });

    it("Should revert when requesting a non-existent ID", async function () {
      const { blockNotice } = await loadFixture(deployBlockNoticeFixture);

      // No notices posted yet, so ID 0 should fail
      await expect(blockNotice.getNotice(0)).to.be.revertedWith("Notice does not exist");

      // Post one notice, so ID 1 should fail
      await blockNotice.postNotice("Title", "Content");
      await expect(blockNotice.getNotice(1)).to.be.revertedWith("Notice does not exist");
    });
  });
});
