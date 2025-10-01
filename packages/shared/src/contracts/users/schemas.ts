import { z } from "zod";

export const checkEmailSchema = z.object({
  email: z.email("invalidErrorMessage"),
});
