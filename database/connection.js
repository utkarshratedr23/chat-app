import mongoose from "mongoose";
const dbConnect=async()=>{
    try{
    await mongoose.connect('mongodb+srv://bhargavautkarsh074:Bhargava23*05@cluster0.4amef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log("DB Connected sucessfully")
    }
    catch(error)
    {
        console.log(error)
    }
}
export default dbConnect