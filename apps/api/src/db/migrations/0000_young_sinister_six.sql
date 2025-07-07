CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`index` integer DEFAULT 0 NOT NULL,
	`default` integer DEFAULT false NOT NULL,
	`super_user` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `index_unique` ON `roles` (`index`);--> statement-breakpoint
CREATE UNIQUE INDEX `default_unique` ON `roles` (`default`) WHERE "default" = 1;--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`issued_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`user_agent` text,
	`ip` text
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`avatar` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);