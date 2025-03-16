import mongoose, {Schema} from "mongoose";
//import { JsonWebTokenError } from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    Author: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    coverImageofBook: {
        type: String,
        default: "https://www.gravatar.com/avatar/000?d=mp"
    }
},{
    timestamps: true}
);

export const Book = mongoose.model("Book", bookSchema); 