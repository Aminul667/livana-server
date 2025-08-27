"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.logoutUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const config_1 = __importDefault(require("../../../config"));
// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.loginUser(req.body);
//   const { refreshToken, accessToken } = result;
//   res.cookie("refreshToken", refreshToken, {
//     secure: config.env === "production",
//     httpOnly: true,
//   });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Logged in successfully!",
//     data: {
//       accessToken,
//     },
//   });
// });
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    // Store both tokens securely in cookies
    res.cookie("accessToken", `${accessToken}`, {
        httpOnly: true,
        secure: config_1.default.env === "production",
        sameSite: "lax",
    });
    res.cookie("refreshToken", `${refreshToken}`, {
        httpOnly: true,
        secure: config_1.default.env === "production",
        sameSite: "lax",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged in successfully!",
        // data: null,
        data: { accessToken, refreshToken },
    });
}));
const logInWithSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.logInWithSocialMedia(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.env === "production",
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is logged in successfully!",
        data: {
            accessToken,
            // refreshToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token generated successfully!",
        data: result,
    });
}));
// In Express controller
exports.logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: config_1.default.env === "production",
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.default.env === "production",
        sameSite: "lax",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    logInWithSocialMedia,
    logoutUser: exports.logoutUser,
    // changePassword,
    // forgotPassword,
    // resetPassword,
};
