const asyncHandler = (reqestHandler) =>  {
    return (req, res, next) => {
        Promise.resolve(reqestHandler(req, res, next))
        .catch((err) => next(err));
    }
}



export { asyncHandler }; // Export asyncHandler function


// const asyncHandler = (fn) =>  async(req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Something went wrong"
//         });
//     }
    
// } // Define asyncHandler function