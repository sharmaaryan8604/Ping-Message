import express from "express"
import { checkAuth } from "../controller/auth.controller.js";
const router = express.Router()
import { protectRoute } from "../middleware/auth.middleware.js";


router.get("/check",protectRoute,checkAuth);

export default router;