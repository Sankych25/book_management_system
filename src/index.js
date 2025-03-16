import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "../constants";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path: "./.env"
});
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
})
}).catch((err) => {
    console.error("Error while connecting to the database",err);
    process.exit(1);
});











/*

import express from "express";
const app = express();

;(async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {

            // useNewUrlParser: true,
            // useUnifiedTopology: true
        })
        app.on("error", (err) => {
            console.error("EXPRESS ERROR", err);
            throw err;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        
        console.log("Database connected", db.connection.name);
        })
    } catch (error) {
        console.error("ERROR alla re : ",error);
        throw err;
    }
})();

*/