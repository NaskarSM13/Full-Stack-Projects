import express from "express";
import cookieParser from "cookie-parser";

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//heath check
app.get("/",(req,res)=>{
    res.json({message:"server is running"})
})

// routers
import authRouter from "./routes/auth.routes.js"

app.use("/api/auth", authRouter)

export default app