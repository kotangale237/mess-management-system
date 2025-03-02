import { Router } from 'express';
import {
    createPoll,
    addCandidateToPoll,
    getPollStatus,
    voteInPoll,
    getCandidateRollnos,
    getCandidateDetails,
    getPollResults,
    endPoll
} from "../controllers/voting.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-poll").post(createPoll);
router.route("/add-candidate/:pollID").post(addCandidateToPoll);
router.route("/poll-status/:pollID").get(getPollStatus);
router.route("/vote").post(voteInPoll);
router.route("/candidate-rollnos").get(getCandidateRollnos);
router.route("/candidate-details").get(getCandidateDetails);
router.route("/poll-results").get(getPollResults);
router.route("/end-poll").post(endPoll);

export default router
