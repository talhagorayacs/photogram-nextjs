import { z } from "zod";

export const userNameUnique = z.object({
    username: z.string().min(1, "Username is required")
});

export const signUpSchemaValidation = z.object({
    email: z
        .string()
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email"),
    password: z
        .string()
        .min(6, "Password should be minimum 6 characters long")
        .max(20, "Password should not be longer than 20 characters"),
});
