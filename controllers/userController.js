import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtwebToken from '../utils/jwtwebToken.js'
export const userRegister = async (req, res) => {
    try {
        const { Fullname, username, email, gender, profilepic, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Username, Email, and Password are required",
            });
        }

        // Check if the user already exists (only by username and email)
        const existingUser = await User.findOne({ username,email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Username or Email already exists",
            });
        }

        // Hash password securely
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Set default profile picture
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create a new user
        const newUser = new User({
            Fullname,
            username,
            email,
            password: hashedPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl,
        });

        if(newUser){
            await newUser.save();
            jwtwebToken(newUser._id,res)
        }
        
       else{
        res.status(500).send({success:false,message:"Invalid User Data"})
       }
        // Send success response
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                Fullname: newUser.Fullname,
                username: newUser.username,
                profilepic: newUser.profilepic,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
export const userLogin=async(req,res)=>{
    try{
     const {email,password}=req.body;
     const user=await User.findOne({email})
     if(!user)
        return res.status(500).send({success:false,message:"Email doesn't exixts"})
     const comparePassword=bcrypt.compareSync(password,user.password || "")
     if(!comparePassword)
        return res.status(500).send({success:false,message:"Password Doesn't match"})

     jwtwebToken(user._id,res)
     res.status(200).send({
        _id:user._id,
        Fullname:user.Fullname,
        username:user.username,
        profilepic:user.username,
        email:user.email,
        message:"Succesfully Login"
     })

    }
    catch(error){
     res.status(500).send({
        success:false,
        message:error
     })
     console.log(error)
    }
}
export const userLogout=async(req,res)=>{
try{
  res.cookie("jwt",'',{
  maxAge:0
  })
  res.status(200).send({message:"User Logout"})
}
catch(error){
res.status(500).send({
    success:false,
    message:error
})
console.log(error)
}
}