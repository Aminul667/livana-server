"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/stripe-payment-intent", payment_controller_1.PaymentController.stripePayment);
router.post("/add", (0, auth_1.default)(client_1.UserRole.landlord), payment_controller_1.PaymentController.addPayment);
exports.PaymentRoutes = router;
