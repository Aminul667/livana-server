import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/stripe-payment-intent", PaymentController.stripePayment);
router.post("/add", auth(UserRole.landlord), PaymentController.addPayment);

export const PaymentRoutes = router;
