const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice", function () {
  async function deployBlockNoticeFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const BlockNotice = await ethers.getContractFactory("BlockNotice");
    const blockNotice = await BlockNotice.deploy();

    return { blockNotice, owner, otherAccount };
  }

  describe("getUserNotices", function () {
    it("Should return an empty array for a user with no notices", async function () {
      const { blockNotice, owner } = await loadFixture(deployBlockNoticeFixture);
      const notices = await blockNotice.getUserNotices(owner.address);
      expect(notices).to.be.an("array").that.is.empty;
    });

    it("Should return correct notice IDs for a user with one notice", async function () {
      const { blockNotice, owner } = await loadFixture(deployBlockNoticeFixture);

      await blockNotice.postNotice("First Notice", "Content 1");
      const notices = await blockNotice.getUserNotices(owner.address);

      expect(notices).to.have.lengthOf(1);
      expect(notices[0]).to.equal(0);
    });

    it("Should return correct notice IDs for a user with multiple notices", async function () {
      const { blockNotice, owner } = await loadFixture(deployBlockNoticeFixture);

      await blockNotice.postNotice("Notice 1", "Content 1");
      await blockNotice.postNotice("Notice 2", "Content 2");
      await blockNotice.postNotice("Notice 3", "Content 3");

      const notices = await blockNotice.getUserNotices(owner.address);

      expect(notices).to.have.lengthOf(3);
      expect(notices[0]).to.equal(0);
      expect(notices[1]).to.equal(1);
      expect(notices[2]).to.equal(2);
    });

    it("Should return an empty array for a different user", async function () {
      const { blockNotice, owner, otherAccount } = await loadFixture(deployBlockNoticeFixture);

      await blockNotice.postNotice("Notice 1", "Content 1");

      const ownerNotices = await blockNotice.getUserNotices(owner.address);
      expect(ownerNotices).to.have.lengthOf(1);

      const otherNotices = await blockNotice.getUserNotices(otherAccount.address);
      expect(otherNotices).to.be.an("array").that.is.empty;
    });
  });
});
