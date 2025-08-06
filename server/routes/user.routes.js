import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middlewares.js';
import { getUserById, getUsers } from '../controllers/user.controllers.js';

const userRouter=express.Router();

userRouter.get("/",protect,adminOnly,getUsers)
userRouter.get("/:id",protect,getUserById)

export default userRouter;