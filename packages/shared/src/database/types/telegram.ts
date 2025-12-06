import { z } from "zod";

export const telegramSchema = z.object({
  botToken: z.string().min(1),
  chatId: z.string().min(1),
  threadId: z.string().nullable(),
});
