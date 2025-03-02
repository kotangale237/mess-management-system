import { Router } from 'express';
import {
    addComplaint, 
    getAllComplaints, 
    updateComplaintStatus,
    getComplaint,
} from "../controllers/complaint.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/add-complaint").post(addComplaint)
router.route("/complaints").get(getAllComplaints)
router.route("/update-complaint-status/:id").put(updateComplaintStatus)
router.route("/get-complaint/:id").get(getComplaint)

export default router