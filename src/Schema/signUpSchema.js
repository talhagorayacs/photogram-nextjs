import { z } from "zod";

export const userNameUnique = z.object({
    username: z.string().min(1, "Username is required"),
});

export const signUpSchemaValidation = z.object({
    email: z
        .string()
        .regex(/^\S+@\S+\.\S+$/, "Enter a valid email"), // Corrected the regex pattern
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long")
        .max(20, "Password should not exceed 20 characters"),
});
