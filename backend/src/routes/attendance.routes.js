import { Router } from 'express';
import { attendance } from "../controllers/attendance.controller.js"

const router = Router();

router.route('/').get(attendance);

export default router