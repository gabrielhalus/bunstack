import { z } from "zod";

export const discordSchema = z.object({
  webhookUrl: z.url({ message: "errors.notification.discord.webhookUrl.invalid" }).min(1, { message: "errors.notification.discord.webhookUrl.required" }),
  decorations: z.boolean(),
});

