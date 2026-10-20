import express from "express"
import {registerUser} from "../controllers/auth.controllers.js"

const router = express.Router();

// register api
router.post("/register", registerUser)


export default router