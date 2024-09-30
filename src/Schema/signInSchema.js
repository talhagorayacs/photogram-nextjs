import { z } from "zod";

export const signInSchemaValidation = z.object({
    identifier: z
        .string()
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email"),
    
    password : z
            .min(6,"message should be minimum 6 characters long")
            .max(20,"password should not be longer then 20 characters")
});
