import { z } from "zod";

export const signUpSchemaValidation = z.object({
   code : z.string().length(6,"Code should be 6 characters long")
    
    
});
