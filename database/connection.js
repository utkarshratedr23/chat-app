import mongoose from "mongoose";
const dbConnect=async()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("DB Connected sucessfully")
    }
    catch(error)
    {
        console.log(error)
    }
}
export default dbConnect