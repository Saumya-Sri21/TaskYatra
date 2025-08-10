import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { connectdb } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import reportRouter from './routes/report.routes.js';

dotenv.config();
const app=express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

//routes
app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/tasks",taskRouter)
app.use("/api/reports",reportRouter)

connectdb()

const port =process.env.PORT || 8000;
app.listen(port,()=> console.log(`Server is running at: http://localhost:${port}`)
)
