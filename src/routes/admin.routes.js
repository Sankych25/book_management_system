import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWTAdmin } from "../middlewares/auth.middleware.js";
import { addNewBook,
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
    listAllBooks } from "../controllers/admin.controller.js"

const router = Router();

router.route("/registerAdmin").post(
    upload.fields([
        { 
            name: "avatar", 
            maxCount: 1 
        }
    ]),
         
    registerAdmin
);

router.route("/loginAdmin").post(loginAdmin);

//secured routes
router.route("/logoutAdmin").post(verifyJWTAdmin, logoutAdmin);
router.route("/Admin-refresh-token").post(refreshAccessToken);
router.route("/change-AdminPassword").post(verifyJWTAdmin, changeCurrentPassword);
router.route("/update-AdminAccount").patch(verifyJWTAdmin,updateAccountDetails);
router.route("/Admin-avatar").patch(verifyJWTAdmin,upload.single("avatar"),updateAdminAvatar);

//book relates routes
router.route("/listOfBooks").post(verifyJWTAdmin, listAllBooks);
router.route("/addNewBook").post(verifyJWTAdmin, addNewBook);
router.route("/updateBookDetails").post(verifyJWTAdmin, updateBookDetails);
router.route("/update-coverImage-of-book").patch(verifyJWTAdmin,upload.single("BookcoverImage"), updateBookCoverImage);
router.route("/deleteBook").post(verifyJWTAdmin, deleteBook);


export default router;