import { Router } from "express";
import {
    buytoken,
} from "../controllers/token.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/buytoken").post( buytoken)

export default router