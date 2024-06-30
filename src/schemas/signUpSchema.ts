import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(20, "username must not be more than 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email("invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
