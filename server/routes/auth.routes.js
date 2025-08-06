import express from 'express'
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controllers/auth.controllers.js';
import { protect } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/upload.middlewares.js';

const authRouter=express.Router();

authRouter.post("/register",registerUser)
authRouter.post("/login",loginUser)
//secure routes
authRouter.get("/profile",protect,getUserProfile)
authRouter.put("/profile",protect,updateUserProfile)

authRouter.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file) return res.status(400).json({message:"No file uploaded"});

    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

    res.status(200).json({imageUrl})
});

export default authRouter;