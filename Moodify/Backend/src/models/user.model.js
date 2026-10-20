import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true, 'username must be unique.'],
        require:[true, 'username is required.']
    },
    email:{
        type:String,
        unique:[true, 'email must be unique.'],
        require:[true, 'email is required.']
    },
    password:{
        type:String,
        require:[true, 'password is required.']
    },
})

const userModel = mongoose.model("users", userSchema)

export default userModel