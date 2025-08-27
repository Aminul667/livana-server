import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required." }).email("Invalid email."),
    password: z
      .string({ message: "Password is required." })
      .min(1, "Password is required."),
  }),
});

const loginSocialMediaValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required." }).email("Invalid email."),
    profilePhoto: z.string().url("profilePhoto must be a valid URL").optional(),
    provider: z.string().optional(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  loginSocialMediaValidationSchema,
};
