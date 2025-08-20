import stripe from "stripe";
import config from "../../../config";
import { IAuthRequest } from "../User/user.interface";
import prisma from "../../../shared/prisma";

const stripePayment = async (amount: number) => {
  const roundAmount = Math.round(amount * 100);

  const stripeInstance = new stripe(config.stripe_client_secret as string);
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: roundAmount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return paymentIntent;
};

const addPaymentIntoDB = async (req: IAuthRequest) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const userId = req.user.userId;
  const propertyId = req.body?.propertyId;
  const type = req.body.type;
  const amount = req.body.amount;
  const transactionId = req.body.transactionId;

  const paymentData = {
    userId,
    propertyId,
    type,
    amount,
    transactionId,
  };

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: paymentData,
    });

    await tx.property.update({
      where: { id: propertyId },
      data: { status: "published" },
    });

    return payment;
  });

  return result;
};

export const PaymentService = {
  stripePayment,
  addPaymentIntoDB,
};
