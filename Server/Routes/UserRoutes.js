import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getTransactionAndRewards, redeemReward, setReward , markNotificationRead, redeemAllRewards, markAllNotificationRead ,getUserProfile,updateUserProfile,uploadProfileImage } from "../controllers/UserController.js";
import multer from "multer";
import path from "path";

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

const userRouter = Router();

userRouter.post("/set-reward",verifyToken,setReward);
userRouter.patch("/redeem-reward",verifyToken,redeemReward);
userRouter.get("/redeem-all-rewards",verifyToken,redeemAllRewards);
userRouter.get("/get-transactions-reward",verifyToken,getTransactionAndRewards);
userRouter.patch("/mark-notification-read",verifyToken,markNotificationRead);
userRouter.get("/mark-all-notification-read",verifyToken,markAllNotificationRead);

// Profile routes
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.patch("/profile", verifyToken, upload.single("profile-image"), updateUserProfile);

export default userRouter;