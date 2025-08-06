import express from 'express'
import { adminOnly, protect } from '../middlewares/auth.middlewares.js';
import { exportTaskReport, exportUsersReport } from '../controllers/report.controllers.js';

const reportRouter=express.Router();

reportRouter.get("/export/tasks",protect,adminOnly,exportTaskReport)
reportRouter.get("/export/users",protect,adminOnly,exportUsersReport)

export default reportRouter