import mongoose, {Schema} from "mongoose";
//import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        default: "https://www.gravatar.com/avatar/000?d=mp",
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],

    },
    refreshToken: {
        type: String
    }
},{
    timestamps: true}
);

adminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
   });
adminSchema.methods.isPasswordCorrect = async function(Password) {
    return await bcrypt.compare(Password, this.password);
}
adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}
adminSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            id: this._id
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const Admin = mongoose.model("Admin", adminSchema); 