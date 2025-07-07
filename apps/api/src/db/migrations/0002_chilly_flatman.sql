PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`)
);
--> statement-breakpoint
INSERT INTO `__new_user_roles`("user_id", "role_id") SELECT "user_id", "role_id" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `roles` ADD `default` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` ADD `super_user` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `default_unique` ON `roles` (`default`) WHERE "default" = 1;