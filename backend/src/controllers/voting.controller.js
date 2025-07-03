import { contract } from "../utils/VotingSystemContract.js";
import { ethers } from "ethers";
import { FoodByteTransaction } from "../models/foodbyteTransaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPoll = asyncHandler(async (req, res) => {
    let { title, pollType, deadline, options, candidateRollnos, names, branches, cgpas } = req.body;

    const pollTypeEnum = pollType === "general" ? 0 : 1;

    options = options || [];
    candidateRollnos = candidateRollnos || [];
    names = names || [];
    branches = branches || [];
    cgpas = cgpas || [];

    const tx = await contract.createPoll(title, pollTypeEnum, deadline, options, candidateRollnos, names, branches, cgpas);
    await tx.wait();

    // Add 10 FoodBytes to all candidates
    for (let rollno of candidateRollnos) {
        await FoodByteTransaction.create({
            rollno,
            amount: 10,
            type: "reward",
            reason: "Candidate participation"
        });
    }

    res.json(new ApiResponse(200, "Poll created successfully"));
});

const voteInPoll = asyncHandler(async (req, res) => {
    const { pollId, rollno, selectedChoice } = req.body;
    const tx = await contract.voteInPoll(pollId, rollno, selectedChoice);
    await tx.wait();

    // Reward with 1 FoodByteTransaction
    await FoodByteTransaction.create({
        rollno,
        amount: 1,
        type: "reward",
        reason: "Poll vote"
    });

    res.json(new ApiResponse(200, "Vote cast successfully"));
});

// 📌 3. Get Live Polls
const getLivePolls = asyncHandler(async (req, res) => {
    const pollCount = Number(await contract.pollCount());
    const polls = [];

    for (let i = 1; i <= pollCount; i++) {
        const poll = await contract.polls(i);
        const options = await contract.getGeneralPollOptions(i).catch(() => []);
        const candidates = await contract.getCommitteePollCandidates(i).catch(() => []);

        polls.push({
            id: i,
            title: poll.title,
            pollType: Number(poll.pollType),
            deadline: Number(poll.deadline),
            options,
            candidates: candidates.map((c) => ({
                rollno: c.rollno,
                name: c.name,
                branch: c.branch,
                cgpa: Number(c.cgpa),
                voteCount: Number(c.voteCount)
            }))
        });
    }

    res.json({ success: true, polls });
});

// 📌 4. Get Voted Polls
const getVotedPolls = asyncHandler(async (req, res) => {
    const rollno = req.query.rollno;
    const pollCount = await contract.pollCount();
    const votedPolls = [];

    for (let i = 1; i <= pollCount; i++) {
        const hasVoted = await contract.hasStudentVoted(i, rollno);
        if (hasVoted) {
            const poll = await contract.polls(i);
            const selected = await contract.getStudentVote(i, rollno);
            votedPolls.push({
                id: i,
                title: poll.title,
                pollType: Number(poll.pollType),
                deadline: Number(poll.deadline),
                selectedChoice: selected
            });
        }
    }

    res.json({ success: true, polls: votedPolls });
});

// 📌 5. Get Poll Status
const getPollStatus = asyncHandler(async (req, res) => {
    const pollId = req.params.pollId;
    const status = await contract.getPollStatus(pollId);
    res.json({ success: true, status });
});

// 📌 6. Get General Poll Options
const getGeneralPollOptions = asyncHandler(async (req, res) => {
    const pollId = req.params.pollId;
    const options = await contract.getGeneralPollOptions(pollId);
    res.json({ success: true, options });
});

// 📌 7. Get Committee Poll Candidates
const getCommitteePollCandidates = asyncHandler(async (req, res) => {
    const pollId = req.params.pollId;
    const candidates = await contract.getCommitteePollCandidates(pollId);
    res.json({ success: true, candidates });
});

// 📌 8. Get Poll Results
const getPollResults = asyncHandler(async (req, res) => {
    const pollId = req.params.pollId;
    const results = await contract.getPollResults(pollId);
    res.json({ success: true, results });
});

// ---------------- FoodByteTransaction Management ----------------

const getFoodByteHistory = asyncHandler(async (req, res) => {
    const { rollno } = req.params;
    const history = await FoodByteTransaction.find({ rollno }).sort({ createdAt: -1 });
    res.json(new ApiResponse(200, history));
});

const deductFoodByteForNonParticipation = asyncHandler(async (req, res) => {
    const { rollno, reason } = req.body;
    await FoodByteTransaction.create({
        rollno,
        amount: -1,
        type: "penalty",
        reason: reason || "Missed poll participation"
    });
    res.json(new ApiResponse(200, "Penalty deducted"));
});

// ---------------- Time & Duration Management ----------------

const updateVotingDuration = asyncHandler(async (req, res) => {
    const { duration } = req.body;
    const tx = await contract.updateVotingDuration(duration);
    await tx.wait();
    res.json(new ApiResponse(200, "Voting duration updated"));
});

const updateCandidateEnrollmentTime = asyncHandler(async (req, res) => {
    const { time } = req.body;
    const tx = await contract.updateCandidateEnrollmentTime(time);
    await tx.wait();
    res.json(new ApiResponse(200, "Candidate enrollment time updated"));
});

const updateAdminGracePeriod = asyncHandler(async (req, res) => {
    const { period } = req.body;
    const tx = await contract.updateAdminGracePeriod(period);
    await tx.wait();
    res.json(new ApiResponse(200, "Admin grace period updated"));
});

const updateSemesterStartDates = asyncHandler(async (req, res) => {
    const { janDate, augDate } = req.body;
    const tx = await contract.updateSemesterStartDates(janDate, augDate);
    await tx.wait();
    res.json(new ApiResponse(200, "Semester start dates updated"));
});

// ---------------- Monthly Cron Logic ----------------

const creditMonthlyToCommittee = asyncHandler(async (req, res) => {
    const members = await contract.getCommitteeMembers();
    for (let rollno of members) {
        await FoodByteTransaction.create({
            rollno,
            amount: 50,
            type: "reward",
            reason: "Monthly committee reward"
        });
    }
    res.json(new ApiResponse(200, "Monthly reward sent to committee members"));
});



export {
    createPoll,
    voteInPoll,
    getLivePolls,
    getVotedPolls,
    getPollStatus,
    getGeneralPollOptions,
    getCommitteePollCandidates,
    getPollResults,
    getFoodByteHistory,
    deductFoodByteForNonParticipation,
    updateVotingDuration,
    updateCandidateEnrollmentTime,
    updateAdminGracePeriod,
    // updateSemesterStartDates,
    creditMonthlyToCommittee
};
