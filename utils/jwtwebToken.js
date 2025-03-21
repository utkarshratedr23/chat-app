import jwt from "jsonwebtoken"
const jwtwebToken=(userId,res)=>{
    const token=jwt.sign({userId},"subscribe",{
        expiresIn:'30d'
    })
    console.log("Generated Token:", token);

    res.cookie('jwt',token,{
        maxAge:30*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:false
    })
    console.log("Cookie Sent:", res.getHeaders()["set-cookie"]);
}
export default jwtwebToken