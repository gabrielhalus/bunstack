import { z } from "zod";

export const telegramSchema = z.object({
  botToken: z.string().min(1, { message: "errors.notification.telegram.botToken.required" }),
  chatId: z.string().min(1, { message: "errors.notification.telegram.chatId.required" }),
  threadId: z.string().nullable(),
});

