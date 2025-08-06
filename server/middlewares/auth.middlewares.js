import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

//Protected Middleware
const protect=async(req,res,next)=>{
    try {
        const token=req.headers.token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
        
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        const user= await User.findById(decoded.userId).select("-password")

        if(!user) return res.status(404).json({success:false, message:"User not found"})
            
        req.user=user;
        next();

    } catch (error) {
        console.log(`Something went wrong in authentication ${error}`)
        return res.json({success:false, message:error.message})
    }
}

// Admin-Only Middleware

const adminOnly=(req,res,next)=>{
    if(req.user && req.user.role==="admin")
        next();
    else{
        res.status(403).json({success:false,message:"Access Denied--Admin Only"})
    }
}

export  {protect,adminOnly}