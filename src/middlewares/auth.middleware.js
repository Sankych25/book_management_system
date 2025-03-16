import { asyncHandler } from "../utils/asynchandler.js";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
        if (!token) {
            throw new APIError(401, "Unauthorized request");
            // return res.status(401).json({
            //     message: "Unauthorized"
            // });
        }
    
        const decodedToken = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
        if (!user) {
            throw new APIError(404, "User not found ---- Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || "Unauthorized request");
        // return res.status(401).json({
        //     message: "Unauthorized"
        
    }
});