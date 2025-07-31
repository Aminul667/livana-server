import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";

const router = express.Router();

router.post("/create-user", userController.createUser);
router.post(
  "/update-profile",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  multerUpload.single("profilePhoto"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.updateUserProfile
);

export const UserRoutes = router;
