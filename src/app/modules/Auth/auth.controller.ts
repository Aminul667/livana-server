import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";

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

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  // Store both tokens securely in cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: null, // Don't send token in body
  });
});

const logInWithSocialMedia = catchAsync(async (req, res) => {
  const result = await AuthServices.logInWithSocialMedia(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
      // refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  logInWithSocialMedia,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
