// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockNotice {
    struct Notice {
        uint256 id;
        address author;
        string title;
        string ipfsHash;
        uint256 timestamp;
    }

    Notice[] public notices;
    mapping(address => uint256[]) public userNotices;

    event NoticeIssued(
        uint256 indexed noticeId,
        address indexed author,
        string title,
        string ipfsHash,
        uint256 timestamp
    );

    function issueNotice(string memory _ipfsHash, string memory _title) public {
        uint256 noticeId = notices.length;
        notices.push(
            Notice(noticeId, msg.sender, _title, _ipfsHash, block.timestamp)
        );
        userNotices[msg.sender].push(noticeId);

        emit NoticeIssued(noticeId, msg.sender, _title, _ipfsHash, block.timestamp);
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
