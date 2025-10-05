import { z } from 'zod';

export const customerCreateSchema = z.object({
  name: z.string().min(3, "Name is required (at least 3 character)"),
    email: z
      .string()
      .email("Enter a valid email (xxx@gmail.com)")
      .regex(/@gmail\.com$/, "Email must be a Gmail address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;

export const customerUpdateSchema = z.object({
  name: z.string().min(3, "Name is required (at least 3 character)"),
  email: z
      .string()
      .email("Enter a valid email (xxx@gmail.com)")
      .regex(/@gmail\.com$/, "Email must be a Gmail address"),
});
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

export const customerLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password incorrect'),
});
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;

export const profileSchema = z.object({
  address: z.string().min(3, 'Address is required (at least 3 character)'),
  phone: z.string().min(11, 'Phone is required (at least 11 character)'),
});
export type ProfileInput = z.infer<typeof profileSchema>;
