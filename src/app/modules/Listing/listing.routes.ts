import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import { ListingController } from "./listing.controller";
import { parseJSONBody } from "../../middlewares/parseJSONBody";

const router = express.Router();

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
