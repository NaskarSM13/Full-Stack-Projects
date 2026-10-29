import redis from "../config/cache"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export async function authUser(req,res,next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    };

    const isTokenBlacklisted = await redis.get(token);

    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"invalid token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }
}