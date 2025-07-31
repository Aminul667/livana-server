import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "../User/user.interface";
import httpStatus from "http-status";
import { ListingService } from "./listing.service";

const addProperty = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await ListingService.addPropertyIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing added successfully!",
    data: result,
  });
});

export const ListingController = {
  addProperty,
};
