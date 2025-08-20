import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthRequest } from "../User/user.interface";

const stripePayment = catchAsync(async (req: Request, res: Response) => {
  const amount = req.body.amount;
  const result = await PaymentService.stripePayment(amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment",
    data: result,
  });
});

const addPayment = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await PaymentService.addPaymentIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history added successfully!",
    data: result,
  });
});

export const PaymentController = {
  stripePayment,
  addPayment,
};
