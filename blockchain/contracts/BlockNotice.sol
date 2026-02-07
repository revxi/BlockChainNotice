// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockNotice {
    // Events
    event NoticePosted(uint256 indexed noticeId, address indexed author, string title, uint256 timestamp);
    event ProposalSubmitted(uint256 indexed proposalId, address indexed author, string title);
    event ProposalConfirmed(uint256 indexed proposalId, address indexed approver);
    event ProposalExecuted(uint256 indexed proposalId, address indexed executor);

    // Structs
    struct Notice {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 timestamp;
    }

    struct Proposal {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 approvalCount;
        bool executed;
        uint256 timestamp;
    }

    // State Variables
    address[] public admins;
    mapping(address => bool) public isAdmin;
    uint256 public confirmationsRequired;

    Notice[] public notices;
    Proposal[] public proposals;

    // Mapping from proposal ID => admin address => confirmed
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    mapping(address => uint256[]) public userNotices;

    // Modifiers
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not an admin");
        _;
    }

    modifier proposalExists(uint256 _proposalId) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        _;
    }

    modifier notExecuted(uint256 _proposalId) {
        require(!proposals[_proposalId].executed, "Proposal already executed");
        _;
    }

    modifier notConfirmed(uint256 _proposalId) {
        require(!isConfirmed[_proposalId][msg.sender], "Proposal already confirmed");
        _;
    }

    // Constructor
    constructor(address[] memory _admins, uint256 _confirmationsRequired) {
        require(_admins.length > 0, "Admins required");
        require(_confirmationsRequired > 0 && _confirmationsRequired <= _admins.length, "Invalid number of required confirmations");

        for (uint256 i = 0; i < _admins.length; i++) {
            address admin = _admins[i];
            require(admin != address(0), "Invalid admin");
            require(!isAdmin[admin], "Admin not unique");

            isAdmin[admin] = true;
            admins.push(admin);
        }

        confirmationsRequired = _confirmationsRequired;
    }

    // Functions

    function submitNotice(string memory _title, string memory _content) public onlyAdmin {
        uint256 proposalId = proposals.length;
        proposals.push(Proposal({
            id: proposalId,
            author: msg.sender,
            title: _title,
            content: _content,
            approvalCount: 0,
            executed: false,
            timestamp: block.timestamp
        }));

        emit ProposalSubmitted(proposalId, msg.sender, _title);
    }

    function confirmNotice(uint256 _proposalId)
        public
        onlyAdmin
        proposalExists(_proposalId)
        notExecuted(_proposalId)
        notConfirmed(_proposalId)
    {
        Proposal storage proposal = proposals[_proposalId];
        proposal.approvalCount += 1;
        isConfirmed[_proposalId][msg.sender] = true;

        emit ProposalConfirmed(_proposalId, msg.sender);

        if (proposal.approvalCount >= confirmationsRequired) {
            executeNotice(_proposalId);
        }
    }

    function executeNotice(uint256 _proposalId)
        public
        proposalExists(_proposalId)
        notExecuted(_proposalId)
    {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.approvalCount >= confirmationsRequired, "Not enough confirmations");

        proposal.executed = true;

        uint256 noticeId = notices.length;
        notices.push(Notice({
            id: noticeId,
            author: proposal.author,
            title: proposal.title,
            content: proposal.content,
            timestamp: block.timestamp
        }));

        userNotices[proposal.author].push(noticeId);

        emit ProposalExecuted(_proposalId, msg.sender);
        emit NoticePosted(noticeId, proposal.author, proposal.title, block.timestamp);
    }

    // View Functions

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getNotice(uint256 _id) public view returns (Notice memory) {
        require(_id < notices.length, "Notice does not exist");
        return notices[_id];
    }

    function getNoticeCount() public view returns (uint256) {
        return notices.length;
    }

    function getUserNotices(address _user) public view returns (uint256[] memory) {
        return userNotices[_user];
    }
}
