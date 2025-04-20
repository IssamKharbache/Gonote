"use client";

import { z } from "zod";

export type RegisterFormType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type signUpSchemaType = z.infer<typeof signUpSchema>;
