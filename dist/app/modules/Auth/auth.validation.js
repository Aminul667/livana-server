"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required." }).email("Invalid email."),
        password: zod_1.z
            .string({ message: "Password is required." })
            .min(1, "Password is required."),
    }),
});
const loginSocialMediaValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required." }).email("Invalid email."),
        profilePhoto: zod_1.z.string().url("profilePhoto must be a valid URL").optional(),
        provider: zod_1.z.string().optional(),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    loginSocialMediaValidationSchema,
};
