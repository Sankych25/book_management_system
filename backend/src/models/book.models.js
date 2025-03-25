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
        //type: Schema.Types.ObjectId,
        //ref:"User",
        type:String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    ISBN:{
        type:String,
        required: true,
        default:"0000000000000",
    },
    coverImageofBook: {
        type: String,
        default: "https://www.gravatar.com/avatar/000?d=mp"
    }
},{
    timestamps: true}
);



bookSchema.methods.generateISBN = async function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uniqueISBN;
    let isUnique = false;

    while (!isUnique) {
        let isbn = '';
        for (let i = 0; i < 13; i++) {
            isbn += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if ISBN already exists
        const existingBook = await this.constructor.findOne({ ISBN: isbn });

        if (!existingBook) {
            uniqueISBN = isbn;
            isUnique = true;
        }
    }

    return uniqueISBN;
};

export const Book = mongoose.model("Book", bookSchema); 