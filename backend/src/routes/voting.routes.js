import { Router } from 'express';
import {
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
} from "../controllers/voting.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-poll").post(createPoll);
router.route("/polls").get(getLivePolls);
router.route("/voted-polls").get(getVotedPolls);
router.route("/vote").post(voteInPoll);
router.route("/committee-poll-candidates/:pollId").get(getCommitteePollCandidates);
router.route("/poll-status/:pollId").get(getPollStatus);
router.route("/general-poll-options/:pollId").get(getGeneralPollOptions);
router.route("/poll-results/:pollId").get(getPollResults);
router.route("/foodbyte-history").get(getFoodByteHistory);
router.route("/deduct-foodbyte").post(deductFoodByteForNonParticipation);
router.route("/setVotingDuration").post(updateVotingDuration);
router.route("/setCandidateEnrollmentTime").post(updateCandidateEnrollmentTime);
router.route("/credit-monthly-to-committee").post(creditMonthlyToCommittee);
// router.route("/setSemesterStartDateJan").post(updateSemesterStartDates("January"));
// router.route("/setSemesterStartDateAug").post(updateSemesterStartDates("August"));
router.route("/setAdminGracePeriod").post(updateAdminGracePeriod);

export default router

