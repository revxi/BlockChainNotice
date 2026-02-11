// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockNotice {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    struct Notice {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 timestamp;
    }

    Notice[] public notices;
    mapping(address => uint256[]) public userNotices;

    event NoticePosted(
        uint256 indexed noticeId,
        address indexed author,
        string title,
        uint256 timestamp
    );

    function postNotice(string memory _title, string memory _content) public onlyAdmin {
        uint256 noticeId = notices.length;
        notices.push(
            Notice(noticeId, msg.sender, _title, _content, block.timestamp)
        );
        userNotices[msg.sender].push(noticeId);

        emit NoticePosted(noticeId, msg.sender, _title, block.timestamp);
    }

    function getNotice(uint256 _id)
        public
        view
        returns (Notice memory)
    {
        require(_id < notices.length, "Notice does not exist");
        return notices[_id];
    }

    function getNoticeCount() public view returns (uint256) {
        return notices.length;
    }

    function getUserNotices(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userNotices[_user];
    }
}