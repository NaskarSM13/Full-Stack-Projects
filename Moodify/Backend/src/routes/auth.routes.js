import express from "express";
import {
  registerUser,
  loginUser,
  getMeUser,
  logoutUser,
} from "../controllers/auth.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /register api
 */
router.post("/register", registerUser);

/**
 * POST /login api
 */
router.post("/login", loginUser);

/**
 * GET /get-me api
 */
router.get("/get-me", authUser, getMeUser);

/**
 * GET /logout api
 */
router.get("/logout", logoutUser);

export default router;
