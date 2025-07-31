import express from "express";

import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routers";
import { ListingRoutes } from "../modules/Listing/listing.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/listing",
    route: ListingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
