import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    Fullname:{
    type:String,
    required:true
    },
    username:{
    type:String,
    required:true,
    unique:true
    },
    email:{
    type:String,
    required:true
    },
    password:{
    type:String,
    required:true,
    minlength:6
    },
    gender:{
        enum:["male","female"]
    },
    profilepic:{
        type:String,
        default:""
    },
    
})
const User=mongoose.model("User",userSchema)
export default User;