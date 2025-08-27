"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_routers_1 = require("../modules/Auth/auth.routers");
const listing_routes_1 = require("../modules/Listing/listing.routes");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routers_1.AuthRoutes,
    },
    {
        path: "/listing",
        route: listing_routes_1.ListingRoutes,
    },
    {
        path: "/payments",
        route: payment_routes_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
