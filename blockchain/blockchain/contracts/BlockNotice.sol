// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockNotice {
    address public admin;

    struct Notice {
        string ipfsHash;
        address issuedBy;
        uint256 timestamp;
        string title;
    }

    Notice[] public allNotices;

    event NoticeIssued(uint256 indexed id, string ipfsHash, uint256 timestamp);

    constructor() {
        admin = msg.sender; // The person who deploys the contract is the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue notices");
        _;
    }

    function issueNotice(string memory _ipfsHash, string memory _title) public onlyAdmin {
        Notice memory newNotice = Notice({
            ipfsHash: _ipfsHash,
            issuedBy: msg.sender,
            timestamp: block.timestamp,
            title: _title
        });

        allNotices.push(newNotice);
        emit NoticeIssued(allNotices.length - 1, _ipfsHash, block.timestamp);
    }

    function getNoticeCount() public view returns (uint256) {
        return allNotices.length;
    }
}