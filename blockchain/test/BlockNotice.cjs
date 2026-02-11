const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockNotice", function () {
  it("Should revert with the right error if notice does not exist", async function () {
    const BlockNotice = await ethers.getContractFactory("BlockNotice");
    const blockNotice = await BlockNotice.deploy();

    // Test for ID 0 when notices is empty
    await expect(blockNotice.getNotice(0))
      .to.be.revertedWithCustomError(blockNotice, "NoticeDoesNotExist")
      .withArgs(0);
  });
});
