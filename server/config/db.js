import mongoose from "mongoose";

export const connectdb=async()=>{
    try {

        await mongoose.connect(process.env.MONGO_URL,{})
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log(`Error in connecting db : ${error}`)
    }
}