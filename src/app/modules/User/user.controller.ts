import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "./user.interface";
import config from "../../../config";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created successfully!",
    data: result,
  });
});

const updateUserProfile = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const { result, accessToken, refreshToken } =
      await userService.updateUserProfileIntoDB(req);

    res.cookie("accessToken", `${accessToken}`, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
    });

    res.cookie("refreshToken", `${refreshToken}`, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully!",
      data: {accessToken, refreshToken},
    });
  }
);

const getMe = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await userService.getMeFromDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.getUserByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

export const userController = {
  createUser,
  updateUserProfile,
  getMe,
  getAllUsers,
  getUserById,
};
