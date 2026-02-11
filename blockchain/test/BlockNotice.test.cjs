const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice", function () {
  let BlockNotice;
  let blockNotice;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    BlockNotice = await ethers.getContractFactory("BlockNotice");
    [owner, addr1, addr2] = await ethers.getSigners();
    blockNotice = await BlockNotice.deploy();
    await blockNotice.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await blockNotice.owner()).to.equal(owner.address);
  });

  it("Should prevent non-owners from posting a notice", async function () {
    const title = "Test Notice";
    const content = "Test Content";

    await expect(
      blockNotice.connect(addr1).postNotice(title, content)
    ).to.be.revertedWith("Not owner");
  });

  it("Should allow owner to post a notice", async function () {
    const title = "Official Notice";
    const content = "Official Content";

    await expect(blockNotice.postNotice(title, content))
      .to.emit(blockNotice, "NoticePosted");

    const count = await blockNotice.getNoticeCount();
    expect(count).to.equal(1);
  });
});
