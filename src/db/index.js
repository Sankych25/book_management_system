// require('dotenv').config({path: './env'})
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        //const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/sanketDB`);

        //console.log("MongoDB Database connected", db.connection.name);
        console.log(`MongoDB Database connected, ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("ERROR while connecting to the database");
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    
    }
}

export default connectDB;