import type { NotificationProviders } from "@bunstack/shared/database/schemas/notification-provider";

export type NotificationProvider = typeof NotificationProviders.$inferSelect;
