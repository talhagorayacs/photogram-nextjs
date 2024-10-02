import { z } from "zod";

export const signInSchemaValidation = z.object({
    identifier: z
        .string()
        .trim(), // Added to ensure no leading or trailing whitespace
        // .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email"),
    
    password: z
        .string() // Ensure this is a string
        .min(6, "Password should be a minimum of 6 characters long") // Corrected message
        .max(20, "Password should not be longer than 20 characters") // Corrected message
});
