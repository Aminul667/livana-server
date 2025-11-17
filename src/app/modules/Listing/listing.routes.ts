import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import { ListingController } from "./listing.controller";
import { validateQuery } from "../../middlewares/validateQuery";
import {
  listingDetailsValidationSchema,
  listingTypeSchema,
  listQuerySchema,
  locationDetailsValidationSchema,
} from "./listing.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get(
  "/",
  validateQuery(listQuerySchema),
  ListingController.getAllProperties
);

router.get(
  "/draft",
  auth(UserRole.landlord),
  ListingController.getAllDraftProperties
);

router.get(
  "/draft/:id",
  auth(UserRole.landlord),
  ListingController.getDraftById
);

router.get("/:id", ListingController.getPropertyById);

router.post(
  "/drafts",
  auth(UserRole.landlord),
  validateRequest(listingTypeSchema),
  ListingController.saveProperty
);

router.patch(
  "/drafts/details/:id",
  auth(UserRole.landlord),
  validateRequest(listingDetailsValidationSchema),
  ListingController.addListingDetails
);

router.patch(
  "/drafts/location/:id",
  auth(UserRole.landlord),
  validateRequest(locationDetailsValidationSchema),
  ListingController.addLocationDetails
);

router.post(
  "/add",
  auth(UserRole.landlord),
  multerUpload.fields([{ name: "images" }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ListingController.addProperty
);

// router.post(
//   "/drafts",
//   auth(UserRole.LANDLORD, UserRole.ADMIN),
//   ListingController.saveListing
// );

export const ListingRoutes = router;
