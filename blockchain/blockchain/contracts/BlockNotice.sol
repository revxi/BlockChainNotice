// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoticeBoard {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Notice {
        uint id;
        string title;
        string content; // text OR IPFS hash
        uint timestamp;
    }

    Notice[] private notices;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can post notices");
        _;
    }

    // Admin posts a notice
    function postNotice(string memory _title, string memory _content) public onlyAdmin {
        notices.push(
            Notice({
                id: notices.length,
                title: _title,
                content: _content,
                timestamp: block.timestamp
            })
        );
    }

    // Anyone can view all notices
    function getAllNotices() public view returns (Notice[] memory) {
        return notices;
    }

    // Get total notice count
    function getNoticeCount() public view returns (uint) {
        return notices.length;
    }
}
