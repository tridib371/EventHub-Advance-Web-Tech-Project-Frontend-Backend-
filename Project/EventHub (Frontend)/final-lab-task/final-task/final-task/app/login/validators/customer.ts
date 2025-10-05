import { z } from "zod";

export const customerSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required (at least 3 character)"),
    email: z
      .string()
      .email("Enter a valid email (xxx@gmail.com)")
      .regex(/@gmail\.com$/, "Email must be a Gmail address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })

  .refine((vals) => vals.password === vals.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CustomerForm = z.infer<typeof customerSchema>;