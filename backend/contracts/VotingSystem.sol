// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Candidate {
        string name;
        string rollno;
        string branch;
        uint cgpa;
        uint voteCount;
    }

    struct Poll {
        string title;
        string description;
        uint256 deadline;
        string[] candidateRollnos;
        mapping(string => Candidate) candidates;
        mapping(address => bool) hasVoted;
    }

    address public owner;
    uint256 public pollCount;
    mapping(uint256 => Poll) public polls;

    event PollCreated(uint256 pollId, string title, string description, uint256 deadline);
    event CandidateAdded(uint256 pollId, string rollno, string name, string branch, uint cgpa);
    event PollEnded(uint256 pollId, string title);
    event Voted(uint256 pollId, address voter, string rollno);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Combined function to create a poll and add candidates
    function createPoll(
        string memory _title,
        string memory _description,
        uint256 _deadline
        ) public onlyOwner {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.title = _title;
        newPoll.description = _description;
        newPoll.deadline = _deadline;

        emit PollCreated(pollCount, _title, _description, _deadline);
    }

    function addCandidateToPoll(
        uint256 _pollId,
        string memory _name,
        string memory _rollno,
        string memory _branch,
        uint _cgpa
        ) public onlyOwner {
        Poll storage poll = polls[_pollId];
        require(block.timestamp < poll.deadline, "Cannot add candidates after the poll has started");
        require(bytes(poll.candidates[_rollno].rollno).length == 0, "Candidate already exists in this poll");

        Candidate memory newCandidate = Candidate({
            name: _name,
            rollno: _rollno,
            branch: _branch,
            cgpa: _cgpa,
            voteCount: 0
        });

        poll.candidates[_rollno] = newCandidate;
        poll.candidateRollnos.push(_rollno);

        emit CandidateAdded(_pollId, _rollno, _name, _branch, _cgpa);
    }


    // Vote for a candidate in a specific poll
    function voteInPoll(uint256 _pollId, string memory _rollno) public {
        Poll storage poll = polls[_pollId];
        require(block.timestamp < poll.deadline, "Poll has already ended");
        require(!poll.hasVoted[msg.sender], "You have already voted in this poll");
        require(bytes(poll.candidates[_rollno].rollno).length > 0, "Invalid candidate");

        poll.candidates[_rollno].voteCount++;
        poll.hasVoted[msg.sender] = true;

        emit Voted(_pollId, msg.sender, _rollno);
    }

    // Function to check if a poll has ended and emit the event
    function checkAndEmitPollEnd(uint256 _pollId) public {
        Poll storage poll = polls[_pollId];
        require(block.timestamp >= poll.deadline, "Poll is still live");

        emit PollEnded(_pollId, poll.title);
    }

    // Get the status of the poll (Live or Ended)
    function getPollStatus(uint256 _pollId) public view returns (string memory) {
        Poll storage poll = polls[_pollId];
        if (block.timestamp < poll.deadline) {
            return "Live";
        } else {
            return "Ended";
        }
    }

    // Get all candidate roll numbers for a specific poll
    function getCandidateRollnos(uint256 _pollId) public view returns (string[] memory) {
        Poll storage poll = polls[_pollId];
        return poll.candidateRollnos;
    }

    // Get poll results sorted by vote count
    function getPollResults(uint256 _pollId) public view returns (Candidate[] memory) {
        Poll storage poll = polls[_pollId];
        uint256 numCandidates = poll.candidateRollnos.length;
        Candidate[] memory sortedCandidates = new Candidate[](numCandidates);

        for (uint256 i = 0; i < numCandidates; i++) {
            sortedCandidates[i] = poll.candidates[poll.candidateRollnos[i]];
        }

        // Sort candidates by vote count
        for (uint256 i = 0; i < numCandidates; i++) {
            for (uint256 j = i + 1; j < numCandidates; j++) {
                if (sortedCandidates[j].voteCount > sortedCandidates[i].voteCount) {
                    Candidate memory temp = sortedCandidates[i];
                    sortedCandidates[i] = sortedCandidates[j];
                    sortedCandidates[j] = temp;
                }
            }
        }

        return sortedCandidates;
    }
}
