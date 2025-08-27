"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripePayment = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const roundAmount = Math.round(amount * 100);
    const stripeInstance = new stripe_1.default(config_1.default.stripe_client_secret);
    const paymentIntent = yield stripeInstance.paymentIntents.create({
        amount: roundAmount,
        currency: "usd",
        payment_method_types: ["card"],
    });
    return paymentIntent;
});
const addPaymentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user) {
        throw new Error("User information is missing.");
    }
    const userId = req.user.userId;
    const propertyId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.propertyId;
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
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.create({
            data: paymentData,
        });
        yield tx.property.update({
            where: { id: propertyId },
            data: { status: "published" },
        });
        return payment;
    }));
    return result;
});
exports.PaymentService = {
    stripePayment,
    addPaymentIntoDB,
};
