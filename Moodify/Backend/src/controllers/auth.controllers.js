import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../config/cache.js";

dotenv.config();

/**
 * POST /register controller
 */
export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const userAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userAlreadyExists) {
    return res.status(400).json({
      message: "user already exists.",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user regester successfully.",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * POST /login controller
 */
export async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user loggied in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * GET /get-me controller
 */
export async function getMeUser(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "user not found!",
    });
  }

  res.status(200).json({
    message: "User Fetched Successfully",
    user,
  });
}

/**
 * GET /logout controller
 */
export async function logoutUser(req, res) {
  const token = req.cookies.token;

  res.clearCookie("token");

  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  res.status(200).json({
    message: "user logged out",
  });
}
