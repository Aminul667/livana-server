import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "../User/user.interface";
import httpStatus from "http-status";
import { ListingService } from "./listing.service";
import pick from "../../../shared/pick";
import { listingFilterableFields } from "./listing.constants";
import ApiError from "../../errors/ApiErrors";

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

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ListingService.getPropertyByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property retrieved successfully!",
    data: result,
  });
});

const getAllDraftProperties = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const result = await ListingService.getAllDraftPropertiesFromDB(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Draft property retrieved successfully!",
      data: result,
    });
  }
);

const getDraftById = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await ListingService.getDraftByIdFromDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Draft property retrieved successfully!",
    data: result,
  });
});

// multi step form
const saveProperty = catchAsync(async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;

  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
  }

  const result = await ListingService.savePropertyIntoDB(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing has been saved successfully!",
    data: result,
  });
});

const addListingDetails = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const listingId = req.params.id;

    if (!userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
    }

    const result = await ListingService.addListingDetailsIntoDB(
      payload,
      userId,
      listingId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Listing Details have been saved successfully!",
      data: result,
    });
  }
);

const addLocationDetails = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const listingId = req.params.id;
    if (!userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
    }
    const result = await ListingService.addLocationDetailsIntoDB(
      payload,
      userId,
      listingId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Location Details have been saved successfully!",
      data: result,
    });
  }
);

const addFeaturesAndAmenities = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const listingId = req.params.id;
    if (!userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
    }
    const result = await ListingService.addFeaturesAndAmenitiesIntoDB(
      payload,
      userId,
      listingId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Features and Amenities have been saved successfully!",
      data: result,
    });
  }
);

const addRentalDetails = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const listingId = req.params.id;
    if (!userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
    }
    const result = await ListingService.addRentalDetailsIntoDB(
      payload,
      userId,
      listingId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental Details have been saved successfully!",
      data: result,
    });
  }
);

export const ListingController = {
  addProperty,
  getAllProperties,
  getPropertyById,
  getAllDraftProperties,
  getDraftById,
  saveProperty,
  addListingDetails,
  addLocationDetails,
  addFeaturesAndAmenities,
  addRentalDetails,
};
