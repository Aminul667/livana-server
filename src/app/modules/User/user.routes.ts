import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";
import { parseJSONBody } from "../../middlewares/parseJSONBody";

const router = express.Router();

router.get("/", userController.getAllUsers);

// router.get("/:id", userController.getUserById);

router.get(
  "/me",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  userController.getMe
);

router.get("/:id", userController.getUserById);

router.post("/create-user", userController.createUser);

router.post(
  "/update-profile",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  multerUpload.single("profilePhoto"),
  parseJSONBody("data"),
  userController.updateUserProfile
);

export const UserRoutes = router;
