import userModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

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
