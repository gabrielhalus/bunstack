import type { Discord } from "../schemas/discord";
import type { NotificationProviders } from "../schemas/notification-providers";
import type { Telegram } from "../schemas/telegram";
import type { Merge } from "@bunstack/shared/types/utils";

import z from "zod";

import { discordSchema } from "./discord";
import { telegramSchema } from "./telegram";

export enum NotificationProviderType {
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
}

export type NotificationProviderOrderBy = Pick<NotificationProvider, "name" | "createdAt" | "updatedAt">;

export type NotificationProvider = &
  Merge<Merge<typeof NotificationProviders.$inferSelect, typeof Discord.$inferSelect>, { type: NotificationProviderType.DISCORD }>
  | Merge<Merge<typeof NotificationProviders.$inferSelect, typeof Telegram.$inferSelect>, { type: NotificationProviderType.TELEGRAM }>;

export const insertNotificationProviderSchema = z.object({
  name: z.string().min(1),
  type: z.enum(NotificationProviderType),
});

export const updateNotificationProviderSchema = insertNotificationProviderSchema.omit({ type: true });

// Discord
export const insertDiscordProviderSchema = insertNotificationProviderSchema.extend(discordSchema.shape);
export const updateDiscordProviderSchema = updateNotificationProviderSchema.extend(discordSchema.shape);

// Telegram
export const insertTelegramProviderSchema = insertNotificationProviderSchema.extend(telegramSchema.shape);
export const updateTelegramProviderSchema = updateNotificationProviderSchema.extend(telegramSchema.shape);
