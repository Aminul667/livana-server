import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "../User/user.interface";
import httpStatus from "http-status";
import { ListingService } from "./listing.service";
import pick from "../../../shared/pick";
import { listingFilterableFields } from "./listing.constants";

const addProperty = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await ListingService.addPropertyIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing added successfully!",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(res.locals.query, listingFilterableFields);
  const options = pick(res.locals.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await ListingService.getAllPropertiesFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing retrived successfully!",
    data: result,
  });
});

export const ListingController = {
  addProperty,
  getAllProperties,
};
