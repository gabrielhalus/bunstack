CREATE TABLE `permissions` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_name` text NOT NULL,
	`resource` text NOT NULL,
	`action` text NOT NULL,
	`condition` text,
	PRIMARY KEY(`role_name`, `resource`, `action`),
	FOREIGN KEY (`role_name`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`action`) REFERENCES `permissions`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`user_id` text NOT NULL,
	`role_name` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_name`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_name`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_roles`("user_id", "role_name") SELECT "user_id", "role_name" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `updated_at`;