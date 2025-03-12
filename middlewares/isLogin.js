import jwt from 'jsonwebtoken';
import User from '../Models/userModels.js';

const isLogin = async (req, res, next) => {
    try {
        console.log("Cookies Received:", req.cookies);  // Debugging
        const token = req.cookies?.jwt;  // ✅ Ensure token exists

        if (!token) {
            return res.status(401).json({ success: false, message: "User Unauthorized: No Token Found" });
        }

        const decoded = jwt.verify(token,"subscribe");  // ✅ Use your JWT_SECRET
        if (!decoded) {
            return res.status(401).json({ success: false, message: "User Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("password");  // ✅ Await DB query
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;  // ✅ Attach user to request
        next();  // ✅ Move to the next middleware
    } catch (error) {
        console.error(`❌ Error in isLogin Middleware: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default isLogin;


