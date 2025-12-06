import { z } from "zod";

export const discordSchema = z.object({
  webhookUrl: z.url().min(1),
  decorations: z.boolean(),
});
