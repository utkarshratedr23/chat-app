import User from "../Models/userModels.js";

export const getUserBySearch=async(req,res)=>{
    try{
    const search=req.query.search || '';
    const currentUserID=req.user._id;
    const user=await User.find({
        $and:[
            {
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            },{
                _id:{$ne:currentUserID}
            }
        ]
    }).select("password").select("email")
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