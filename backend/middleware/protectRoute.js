import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies["mern_lms"];

        if (!token) {
            console.log(req.cookies);
            console.log('no token provided');
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
		}

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
        req.user=user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}