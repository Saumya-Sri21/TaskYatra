import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

//Protected Middleware
const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header (Bearer <token>)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.headers.token) {
            // Fallback for legacy support
            token = req.headers.token;
        }
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        req.user = user;
        next();
    } catch (error) {
        console.log(`Something went wrong in authentication ${error}`);
        return res.status(401).json({ success: false, message: error.message });
    }
};

// Admin-Only Middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin")
        next();
    else {
        res.status(403).json({ success: false, message: "Access Denied--Admin Only" });
    }
};

export { protect, adminOnly };