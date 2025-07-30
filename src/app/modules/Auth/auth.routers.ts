import express from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post("/login", AuthController.loginUser);

router.post(
  "/login-social-media",
  validateRequest(AuthValidation.loginSocialMediaValidationSchema),
  AuthController.logInWithSocialMedia
);

router.post("/refresh-token", AuthController.refreshToken);

// router.post(
//   "/change-password",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//   AuthController.changePassword
// );

// router.post("/forgot-password", AuthController.forgotPassword);

// router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
