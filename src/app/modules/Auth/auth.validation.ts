import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const loginSocialMediaValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required." }),
    profilePhoto: z.string().optional(),
    provider: z.string().optional(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  loginSocialMediaValidationSchema,
  //   refreshTokenValidationSchema,
  //   forgetPasswordValidationSchema,
  //   changePasswordValidationSchema,
  //   resetPasswordValidationSchema,
};
