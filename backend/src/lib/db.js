import mongoose from "mongoose"

export async function connectDb() {
    try{
        const mongoUri=process.env.MONGO_URI
        if(!mongoUri){
            throw new Error("MONGO_URI is not defined in environment variables")
        }
        await mongoose.connect(mongoUri)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
        process.exit(1) // Exit the process with an error code
    }
    
}