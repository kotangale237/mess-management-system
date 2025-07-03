// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // --------------------
    // STRUCTS
    // --------------------

    enum PollType { Committee, General }

    struct Poll {
        uint id;
        string title;
        PollType pollType;
        bool isInitiated;
        bool isStarted;
        bool isCompleted;
        uint startTime;
        uint endTime;
        uint candidateJoinStart;
        uint candidateJoinEnd;
        string[] options; // For general polls
        string creatorRoll;
        mapping(string => bool) hasVoted;
        mapping(string => uint) votes; // option => votes
        mapping(string => uint) votedOption; // roll => option index
        string[] voters;
        string[] candidates; // For committee polls
    }

    uint public pollCount;
    mapping(uint => Poll) public polls;
    mapping(string => bool) public isCommitteeMember;
    string[] public currentCommitteeMembers;

    // --------------------
    // DURATION VARIABLES
    // --------------------

    uint public candidateJoinDuration = 1 days;
    uint public candidateJoinExtension = 1 days;
    uint public votingDuration = 2 days;
    uint public adminGracePeriod = 15 days;

    uint public semesterStartDateJan = 1704067200; // Jan 1, 2024
    uint public semesterStartDateAug = 1722470400; // Aug 1, 2024

    // --------------------
    // EVENTS
    // --------------------

    event PollInitiated(uint pollId, string byRoll, PollType pollType);
    event CandidateJoined(uint pollId, string rollNumber);
    event PollStarted(uint pollId);
    event Voted(uint pollId, string rollNumber, string option);
    event PollCompleted(uint pollId);
    event CommitteeUpdated(string[] newMembers);

    // FoodByte Events
    event VotedAndRewarded(string rollNumber, uint pollId, string pollType);
    event CandidateRegistered(string rollNumber, uint pollId);
    event CommitteeMemberElected(string rollNumber, uint pollId);
    event VoteMissed(string rollNumber, uint pollId);
    event CandidateNotParticipated(string rollNumber, uint pollId);

    // --------------------
    // MODIFIERS
    // --------------------

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyAdminOrCommittee() {
        require(msg.sender == admin || isCommitteeMemberByAddress[msg.sender], "Unauthorized");
        _;
    }

    // Mapping to simulate rollNumber-to-address (for committee members)
    mapping(address => bool) public isCommitteeMemberByAddress;

    // --------------------
    // API-CONTROLLED UPDATABLE TIMES
    // --------------------

    function updateDurations(
        uint _candidateJoinDuration,
        uint _candidateJoinExtension,
        uint _votingDuration,
        uint _adminGracePeriod
    ) external onlyAdmin {
        candidateJoinDuration = _candidateJoinDuration;
        candidateJoinExtension = _candidateJoinExtension;
        votingDuration = _votingDuration;
        adminGracePeriod = _adminGracePeriod;
    }

    function updateSemesterStartDates(uint janTimestamp, uint augTimestamp) external onlyAdmin {
        semesterStartDateJan = janTimestamp;
        semesterStartDateAug = augTimestamp;
    }

    // --------------------
    // POLL FUNCTIONS
    // --------------------

    function initiateCommitteePoll(string memory rollNumber) external {
        require(
            block.timestamp >= getCurrentSemesterStart() + adminGracePeriod,
            "Admin grace period not over"
        );

        pollCount++;
        Poll storage p = polls[pollCount];
        p.id = pollCount;
        p.pollType = PollType.Committee;
        p.isInitiated = true;
        p.creatorRoll = rollNumber;
        p.title = "Mess Committee Election";
        p.candidateJoinStart = block.timestamp;
        p.candidateJoinEnd = block.timestamp + candidateJoinDuration;

        emit PollInitiated(pollCount, rollNumber, PollType.Committee);
    }

    function createGeneralPoll(
        string memory title,
        string[] memory options,
        uint duration,
        string memory creatorRoll
    ) external {
        require(msg.sender == admin || isCommitteeMemberByAddress[msg.sender], "Not allowed");

        pollCount++;
        Poll storage p = polls[pollCount];
        p.id = pollCount;
        p.title = title;
        p.pollType = PollType.General;
        p.options = options;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + duration;
        p.isInitiated = true;
        p.isStarted = true;

        emit PollInitiated(pollCount, creatorRoll, PollType.General);
        emit PollStarted(pollCount);
    }

    function joinCandidate(uint pollId, string memory rollNumber) external {
        Poll storage p = polls[pollId];
        require(p.pollType == PollType.Committee, "Only for committee poll");
        require(block.timestamp >= p.candidateJoinStart && block.timestamp <= p.candidateJoinEnd, "Not in candidate join window");

        p.candidates.push(rollNumber);
        emit CandidateJoined(pollId, rollNumber);
        emit CandidateRegistered(rollNumber, pollId);
    }

    function startVotingPhase(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(p.candidates.length >= 2, "Not enough candidates");

        p.isStarted = true;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + votingDuration;

        emit PollStarted(pollId);
    }

    function vote(uint pollId, string memory rollNumber, uint optionIndex) external {
        Poll storage p = polls[pollId];
        require(p.isStarted, "Voting not started");
        require(block.timestamp >= p.startTime && block.timestamp <= p.endTime, "Voting closed");
        require(!p.hasVoted[rollNumber], "Already voted");

        p.hasVoted[rollNumber] = true;
        p.votedOption[rollNumber] = optionIndex;
        p.votes[p.options[optionIndex]]++;
        p.voters.push(rollNumber);

        emit Voted(pollId, rollNumber, p.options[optionIndex]);
        emit VotedAndRewarded(rollNumber, pollId, p.pollType == PollType.Committee ? "Committee" : "General");
    }

    function completePoll(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(!p.isCompleted && block.timestamp > p.endTime, "Cannot complete yet");

        p.isCompleted = true;
        emit PollCompleted(pollId);

        if (p.pollType == PollType.Committee) {
            updateCommitteeMembers(pollId);
        }
    }

    function updateCommitteeMembers(uint pollId) internal {
        // Clear old members
        for (uint i = 0; i < currentCommitteeMembers.length; i++) {
            isCommitteeMember[currentCommitteeMembers[i]] = false;
        }
        delete currentCommitteeMembers;

        // Get top 5 from this poll
        Poll storage p = polls[pollId];
        string[] memory top = getTopCandidates(pollId);
        for (uint i = 0; i < top.length && i < 5; i++) {
            isCommitteeMember[top[i]] = true;
            currentCommitteeMembers.push(top[i]);
            emit CommitteeMemberElected(top[i], pollId);
        }

        emit CommitteeUpdated(currentCommitteeMembers);
    }

    // --------------------
    // UTILITY FUNCTIONS
    // --------------------

    function getVotedCandidate(uint pollId, string memory rollNumber) external view returns (string memory) {
        Poll storage p = polls[pollId];
        require(p.hasVoted[rollNumber], "Student hasn't voted");
        return p.options[p.votedOption[rollNumber]];
    }

    function getCurrentSemesterStart() public view returns (uint) {
        uint year = getYear(block.timestamp);
        uint janStart = semesterStartDateJan;
        uint augStart = semesterStartDateAug;

        if (block.timestamp >= augStart) return augStart;
        return janStart;
    }

    function getYear(uint timestamp) internal pure returns (uint) {
        return (timestamp / 31556926) + 1970; // rough conversion
    }

    function getTopCandidates(uint pollId) public view returns (string[] memory) {
        Poll storage p = polls[pollId];
        return p.candidates; // Replace with actual sorting logic if needed
    }

    function getPollVoters(uint pollId) external view returns (string[] memory) {
        return polls[pollId].voters;
    }
}
