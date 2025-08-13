import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import { ListingController } from "./listing.controller";
import { parseJSONBody } from "../../middlewares/parseJSONBody";
import { validateQuery } from "../../middlewares/validateQuery";
import { listQuerySchema } from "./listing.validation";

const router = express.Router();

router.get(
  "/",
  validateQuery(listQuerySchema),
  ListingController.getAllProperties
);

router.get("/:id", ListingController.getPropertyById);

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

export const ListingRoutes = router;
