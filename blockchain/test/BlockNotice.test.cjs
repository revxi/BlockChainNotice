const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice Multi-Sig", function () {
  let BlockNotice;
  let blockNotice;
  let owner;
  let admin1;
  let admin2;
  let user;

  beforeEach(async function () {
    [owner, admin1, admin2, user] = await ethers.getSigners();
    // 3 admins: owner, admin1, admin2
    const admins = [owner.address, admin1.address, admin2.address];
    const confirmationsRequired = 2;

    BlockNotice = await ethers.getContractFactory("BlockNotice");
    blockNotice = await BlockNotice.deploy(admins, confirmationsRequired);
    await blockNotice.waitForDeployment();
  });

  it("Should create a proposal when submitNotice is called", async function () {
    await expect(blockNotice.submitNotice("Test Title", "Test Content"))
      .to.emit(blockNotice, "ProposalSubmitted")
      .withArgs(0, owner.address, "Test Title");

    const proposals = await blockNotice.getProposals();
    expect(proposals.length).to.equal(1);
    expect(proposals[0].title).to.equal("Test Title");
    expect(proposals[0].executed).to.be.false;
  });

  it("Should allow admins to confirm a proposal", async function () {
    await blockNotice.submitNotice("Test Title", "Test Content");

    await expect(blockNotice.connect(admin1).confirmNotice(0))
      .to.emit(blockNotice, "ProposalConfirmed")
      .withArgs(0, admin1.address);

    const proposals = await blockNotice.getProposals();
    expect(proposals[0].approvalCount).to.equal(1);
  });

  it("Should not allow non-admins to confirm a proposal", async function () {
    await blockNotice.submitNotice("Test Title", "Test Content");

    await expect(blockNotice.connect(user).confirmNotice(0))
      .to.be.revertedWith("Not an admin");
  });

  it("Should execute proposal and publish notice after required confirmations", async function () {
    await blockNotice.submitNotice("Test Title", "Test Content");

    // First confirmation
    await blockNotice.connect(admin1).confirmNotice(0);

    // Second confirmation (should trigger execution)
    await expect(blockNotice.connect(admin2).confirmNotice(0))
      .to.emit(blockNotice, "ProposalExecuted")
      .withArgs(0, admin2.address)
      .to.emit(blockNotice, "NoticePosted");

    const proposals = await blockNotice.getProposals();
    expect(proposals[0].executed).to.be.true;

    const noticeCount = await blockNotice.getNoticeCount();
    expect(noticeCount).to.equal(1);

    const notice = await blockNotice.getNotice(0);
    expect(notice.title).to.equal("Test Title");
  });

  it("Should not publish notice with insufficient confirmations", async function () {
    await blockNotice.submitNotice("Test Title", "Test Content");
    await blockNotice.connect(admin1).confirmNotice(0);

    const noticeCount = await blockNotice.getNoticeCount();
    expect(noticeCount).to.equal(0);
  });

  it("Should not allow double confirmation by same admin", async function () {
    await blockNotice.submitNotice("Test Title", "Test Content");
    await blockNotice.connect(admin1).confirmNotice(0);

    await expect(blockNotice.connect(admin1).confirmNotice(0))
      .to.be.revertedWith("Proposal already confirmed");
  });

  it("Should not allow non-admins to submit a proposal", async function () {
    await expect(blockNotice.connect(user).submitNotice("Test Title", "Test Content"))
      .to.be.revertedWith("Not an admin");
  });
});
