import Conversation from "../Models/conversationalModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch=async(req,res)=>{
    try{
    const search=req.query.search || '';
    const currentUserID=req.user._id;
    const user=await User.find({
        $and:[
            {
                $or:[
                    { username: { $regex: `.*${search}.*`, $options: "i" } },
                    { Fullname: { $regex: `.*${search}.*`, $options: "i" } }
                ]
            },{
                _id:{$ne:currentUserID}
            }
        ]
    }).select("email Fullname username")
       res.status(200).send(user)
    }
    catch(error){
     res.status(500).send({
        success:false,
        message:error
     })
     console.log(error)
    }
}
export const currentchatters=async(req,res)=>{
  try{
     const currentUserID=req.user._id;
     const currentchatters=await Conversation.find({
        participants:currentUserID
     }).sort({
        updatedAt:-1
     });
     if(!currentchatters || currentchatters.length===0)
        return res.status(200).send([]);
    const participantsIDS=currentchatters.reduce((ids,conversation)=>{
        const otherParticipants=conversation.participants.filter(id=>id!==currentUserID)
        return [...ids,...otherParticipants]
    },[])
    const otherParticipantsIDS=participantsIDS.filter(id=>id.toString() !== currentUserID.toString())
    const user=await User.find({_id:{$in:otherParticipantsIDS}}).select("-password -email");
    const users=otherParticipantsIDS.map(id=>user.find(user=>user._id.toString()===id.toString()))
    res.status(200).send(users)
} 
  catch(error){
   res.status(500).send({
    success:false,
    message:error
   })
   console.log(error)
  }
}