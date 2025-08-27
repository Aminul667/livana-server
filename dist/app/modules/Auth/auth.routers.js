"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthController.loginUser);
router.post("/logout", auth_controller_1.AuthController.logoutUser);
router.post("/login-social-media", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginSocialMediaValidationSchema), auth_controller_1.AuthController.logInWithSocialMedia);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
// router.post(
//   "/change-password",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//   AuthController.changePassword
// );
// router.post("/forgot-password", AuthController.forgotPassword);
// router.post("/reset-password", AuthController.resetPassword);
exports.AuthRoutes = router;
