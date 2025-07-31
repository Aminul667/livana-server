import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "./user.interface";

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
    const result = await userService.updateUserProfileIntoDB(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully!",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  updateUserProfile,
};
