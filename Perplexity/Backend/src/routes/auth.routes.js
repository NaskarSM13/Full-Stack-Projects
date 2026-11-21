import express from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"

const authRouter = express.Router()

authRouter.post("/register", async function (req,res) {
    const {username,email,password} = req.body;
    
    const isUserAlreadyExists = await userModel.findOne({
        $or:[{email},{username}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"user with this email or username already exists",
            success:false,
            err:"user already exists"
        })
    };

    const user = await userModel.create({username, email, password})

    
})

export default authRouter