import { asyncHandler } from "../utils/asynchandler.js";
import { APIError } from "../utils/apiError.js";
import { Admin } from "../models/admin.models.js";
import { Book } from "../models/book.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";
import  JsonWebToken  from "jsonwebtoken";
import deleteFileFromCloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const admin = await Admin.findById(userId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIError(500, "Error generating access and refresh tokens");
    }
};

const generateISBNofBook = async (bookID) => {
    try {
        const book = await Book.findById(bookID);
        if (!book) {
            throw new APIError(404, "Book not found!!");
        }

        book.ISBN = await book.generateISBN(); // Fixed: Call on instance
        await book.save({ validateBeforeSave: false });

        return book.ISBN;
    } catch (error) {
        throw new APIError(500, error.message || "Error generating ISBN number");
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
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

    // //check for avatar
    // const avatarLocalPath = req.files?.avatar[0]?.path;

    // if (!avatarLocalPath) {
    //     throw new APIError(400, "Please provide avatar image");
    // }
    
    // //upload them to cloudinary
    // const avatar = await uploadOnCloudinary(avatarLocalPath);

    // if (!avatar) {
    //     throw new APIError(400, "Avatar image required");
    // }

    //create admin object - create entry in database
    const admin = await Admin.create({
        fullName,
        email,
        password,
        username:username.toLowerCase(),
        //avatar: avatar.url || "",
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

const loginAdmin = asyncHandler(async (req, res) => {
    //req body -> data from frontend
    //username and email
    //find admin || validate admin
    //compare password
    //access and refresh token
    //send cookie to frontend

    //req body -> data from frontend
    const { username, email, password } = req.body;
    if(!username && !email){
        throw new APIError(400, "Please provide both username and email");
    }
    const admin = await Admin.findOne({ $or: [{ username: username }, { email: email }] })
    if(!admin){
        throw new APIError(404, "Admin not found");
    }
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new APIError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production",
        // secure: true
        secure: false, //when test on localhost
        sameSite: "Lax"

    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIResponse(200, "Admin logged in successfully", 
            {
            user: loggedInAdmin,
            accessToken,
            refreshToken
            }
        )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(req.admin._id, { $unset: { refreshToken: 1 } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new APIResponse(200, "Admin logged out successfully")
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
        const admin = await Admin.findById(decodedToken?._id);
    
        if(!admin) {
            throw new APIError(401,"Invalid Refresh Token!!")
        }
        if(incomingRefreshToken !== admin?.refreshToken){
            throw new APIError(401,"Refresh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(admin._id)
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

    const admin = await Admin.findById(req.admin?.id);
    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new APIError(400,"Invaild Credential");
    }

    admin.password = newPassword;
    await admin.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new APIResponse(200, {}, "Password changed successfully !!"));
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body;

    if(!fullName || !email){
        throw new APIError(400,"All fields are required !!");
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
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
        .json(new APIResponse(200, admin, "Account Detail Updated Successfully !!!"))
});

const updateAdminAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new APIError(400,"Avatar file is missing");
    }
    //delete old avatar file - TODO
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new APIError(400,"Error while uploading on avatar");
    }

    const admin = await Admin.findByIdAndUpdate(req.admin?.id, {
        $set:{
            avatar: avatar.url
        }
    },{new: true}).select("-password")
    return res
        .status(200)
        .json( 
            new APIResponse(200, admin,"A avatar image updated successfully !!"
            )
        );
});

const listAllBooks = async (req, res) => {
    try {
        // Check if user is admin
        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ message: "Access denied. Admins only." });
        // }

        const books = await Book.find();
        res.status(200).json(books);
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    return res
        .status(200)
        .json(new APIResponse(200, {}, "All books fetched successfully !!"));
};

const addNewBook = asyncHandler(async (req, res) => {
    
    //get user details from frontend
    const { title, Author, publishedDate} = req.body
    

    if(
        [title, Author, publishedDate].some((field) => field?.trim() === "")
    ){
        throw new APIError(400, "Please provide all the details");
    }

    //check if user already exists
    const existedBook = await Book.findOne({title: title })
    if (existedBook) {
        throw new APIError(409, "Book with this title already exists");
    }
    
    //create user object - create entry in database
    const book = await Book.create({
        title: title,
        Author: Author,
        publishedDate: publishedDate,
        //coverImage: coverImage?.url || "",
    })

    //remove password and refresh token from response
    //check for user creation
    const createdBook = await Book.findById(book._id);
    if(!createdBook){
        throw new APIError(500, "Error while adding new book");
    }
    await generateISBNofBook(book._id);
    
    return res
        .status(201)
        .json(
            new APIResponse(201, "Book added successfully", createdBook)
        );

    // return res.status(200).json({
    //     success: true,
    //     message: "Register user",
    //     message: "ok"
    // });
});

// const updateBookDetails = asyncHandler(async(req, res) => {
//     const {title, Author, publishedDate} = req.body;
    

//     if(!title || !Author || !publishedDate){
//         throw new APIError(400,"All fields are required !!");
//     }

//     const book = await Book.findByIdAndUpdate(
//         req.book?._id,
//         {
//             $set: {
//                 title ,
//                 Author,
//                 publishedDate
//             }
//         },{
//             new: true
//         }
//     )
//     return res
//         .status(200)
//         .json(new APIResponse(200, book, "Book Detail Updated Successfully !!!"))
// });

const updateBookDetails = asyncHandler(async (req, res) => {
    const { Author, title, publishedDate } = req.body;
    const bookID = req.params.id || req.body.bookID; // Get book ID safely

    if (!Author || !title || !publishedDate) {
        throw new APIError(400, "All fields are required!!");
    }

    // Find book first
    const book = await Book.findById(bookID);
    if (!book) {
        throw new APIError(404, "Book not found!");
    }

    // Update fields manually
    book.Author = Author;
    book.title = title;
    book.publishedDate = publishedDate;

    // Save with validation
    await book.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(new APIResponse(200, book, "Book details updated successfully!"));
});

const updateBookCoverImage = asyncHandler(async (req, res) => {
    try {
        const coverImageLocalPath = req.file?.path;
        if (!coverImageLocalPath) {
            throw new APIError(400, "Cover Image file is missing");
        }

        // Upload to Cloudinary
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!coverImage?.url) {
            throw new APIError(400, "Error while uploading cover image");
        }

        // Get book ID safely
        const bookID = req.params.id || req.body.bookID;

        // Find and update book
        const book = await Book.findById(bookID);
        if (!book) {
            throw new APIError(404, "Book not found!");
        }

        // Update book cover image
        book.coverImageofBook = coverImage.url;
        await book.save();

        return res
            .status(200)
            .json(new APIResponse(200, book, "Cover image updated successfully!"));
    } catch (error) {
        throw new APIError(500, error.message || "Internal Server Error");
    }
});


const deleteBook = asyncHandler(async (req, res) => {
    try {
        const bookID = req.params.id || req.body.bookID; // Safely get book ID

        // Find the book first
        const book = await Book.findById(bookID);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Delete cover image if stored on Cloudinary
        // if (book.coverImageofBook) {
        //     await deleteFileFromCloudinary(book.coverImageofBook);
        // }

        // Delete the book
        await Book.findByIdAndDelete(bookID);

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export { addNewBook,
    updateAdminAvatar,
    updateAccountDetails,
    refreshAccessToken,
    changeCurrentPassword,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    updateBookDetails,
    updateBookCoverImage,
    deleteBook,
    listAllBooks
   };