import { asyncHandler } from "../utils/asynchandler.js";
import { APIError } from "../utils/apiError.js";
import { Admin } from "../models/admin.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";
import  JsonWebToken  from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIError(500, "Error generating access and refresh tokens");
    }
};
const registerUser = asyncHandler(async (req, res) => {
    //get admin details from frontend
    //validate admin details
    //check if admin already exists
    //check for avatar
    //upload them to cloudinary
    //create admin object - create entry in database
    //remove password and refresh token from response
    //check for admin creation
    //return response to frontend


    //get admin details from frontend
    const { fullName, email, password, username } = req.body
    

    if(
        [fullName, email, password, username].some((field) => field?.trim() === "")
    ){
        throw new APIError(400, "Please provide all the details");
    }

    //check if admin already exists
    const existedAdmin = await Admin.findOne({ 
        $or: [
            { email: email },
            { username: username }
        ]
     })
    if (existedAdmin) {
        throw new APIError(409, "Admin with this email or username already exists");
    }

    //check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new APIError(400, "Please provide avatar image");
    }
    
    //upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new APIError(400, "Avatar image required");
    }

    //create admin object - create entry in database
    const admin = await Admin.create({
        fullName,
        email,
        password,
        username:username.toLowerCase(),
        avatar: avatar.url
    })

    //remove password and refresh token from response
    //check for user creation
    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if(!createdAdmin){
        throw new APIError(500, "Admin not created");
    }

    //return response to frontend
    return res
        .status(201)
        .json(
            new APIResponse(201, "Admin created successfully", createdAdmin)
        );
});