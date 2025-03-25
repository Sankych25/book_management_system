import { asyncHandler } from "../utils/asynchandler.js";
import { APIError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
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
    //get user details from frontend
    //validate user details
    //check if user already exists
    //check for images
    //check for avatar
    //upload them to cloudinary
    //create user object - create entry in database
    //remove password and refresh token from response
    //check for user creation
    //return response to frontend


    //get user details from frontend
    const { fullName, email, password, username } = req.body
    

    if(
        [fullName, email, password, username].some((field) => field?.trim() === "")
    ){
        throw new APIError(400, "Please provide all the details");
    }

    //check if user already exists
    const existedUser = await User.findOne({ 
        $or: [
            { email: email },
            { username: username }
        ]
     })
    if (existedUser) {
        throw new APIError(409, "User with this email or username already exists");
    }

    //check for images
    //check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    /* This code snippet is checking if there is a file named `coverImage` in the `req.files` object. */
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if (!avatarLocalPath) {
        throw new APIError(400, "Please provide both avatar and cover image");
    }
    
    //upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new APIError(400, "Avatar image required");
    }

    //create user object - create entry in database
    const user = await User.create({
        fullName,
        email,
        password,
        username:username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    //remove password and refresh token from response
    //check for user creation
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new APIError(500, "User not created");
    }

    //return response to frontend
    return res
        .status(201)
        .json(
            new APIResponse(201, "User created successfully", createdUser)
        );

    // return res.status(200).json({
    //     success: true,
    //     message: "Register user",
    //     message: "ok"
    // });
});

const loginUser = asyncHandler(async (req, res) => {
    //req body -> data from frontend
    //username and email
    //find user || validate user
    //compare password
    //access and refresh token
    //send cookie to frontend

    //req body -> data from frontend
    const { username, email, password } = req.body;
    if(!username && !email){
        throw new APIError(400, "Please provide either username or email");
    }
    const user = await User.findOne({ $or: [{ username: username }, { email: email }] })
    if(!user){
        throw new APIError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new APIError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production",
        secure: true

    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIResponse(200, "User logged in successfully", 
            {
            user: loggedInUser,
            accessToken,
            refreshToken
            }
        )
    );






    // User.findOne({ $or: [{ username: username }, { email: email }] }, async (err, user) => {
    //     if (err || !user) {
    //         throw new APIError(404, "User not found");
    //     }
    //     //compare password
    //     const isMatch = await user.comparePassword(password);
    //     if (!isMatch) {
    //         throw new APIError(401, "Invalid credentials");
    //     }
    //     //access and refresh token
    //     const { accessToken, refreshToken } = await user.generateToken();

    //     //send cookie to frontend
    //     res.cookie("accessToken", accessToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //     });
    //     res.cookie("refreshToken", refreshToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //     });

    //     return res.status(200).json(
    //         new APIResponse(200, "User logged in successfully", {
    //             user: {
    //                 _id: user._id,
    //                 fullName: user.fullName,
    //                 email: user.email,
    //                 username: user.username,
    //                 avatar: user.avatar,
    //                 coverImage: user.coverImage,
    //             },
    //             accessToken,
    //             refreshToken,
    //         })
    //     );
    // });

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new APIResponse(200, "User logged out successfully")
    );
    
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new APIError(401,"unauthorized request")
    }

    try {
        const decodedToken = JsonWebToken.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id);
    
        if(!user) {
            throw new APIError(401,"Invalid Refresh Token!!")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new APIError(401,"Refresh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new APIResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed successfully !!"
            )
        )
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid Refreshed Token !!!")
    }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?.id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new APIError(400,"Invaild Credential");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new APIResponse(200, {}, "Password changed successfully !!"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
        .status(200)
        .json(new APIResponse(200, req.user, "Current user fetched successfully!!!"))
});

/* The above code is a JavaScript function called `updateAccountDetails` that is using async/await
syntax to handle asynchronous operations. It takes in a request (`req`) and response (`res`) object
as parameters. */
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body;

    if(!fullName || !email){
        throw new APIError(400,"All fields are required !!");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName : fullName,
                email: email
            }
        },{
            new: true
        }
    ).select("-password")
    return res
        .status(200)
        .json(new APIResponse(200, user, "Account Detail Uodated Successfully !!!"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new APIError(400,"Avatar file is missing");
    }
    //delete old avatar file - TODO
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new APIError(400,"Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(req.user?.id, {
        $set:{
            avatar: avatar.url
        }
    },{new: true}).select("-password")
    return res
        .status(200)
        .json( 
            new APIResponse(200, user,"A avatar image updated successfully !!"
            )
        );
});

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new APIError(400,"Cover Image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new APIError(400,"Error while uploading on Cover Image");
    }

    const user = await User.findByIdAndUpdate(req.user?.id, {
        $set:{
            coverImage: coverImage.url
        }
    },{new: true}).select("-password")

    return res
        .status(200)
        .json( 
            new APIResponse(
                200, user,"A cover image updated successfully !!"
            )
        );
});






export { registerUser, 
         loginUser, 
         logoutUser, 
         refreshAccessToken,
         changeCurrentPassword,
         getCurrentUser,
         updateUserCoverImage,
         updateAccountDetails,
         updateUserAvatar
        }; // Export registerUser function

//export