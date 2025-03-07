PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`givenName` text NOT NULL,
	`familyName` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "givenName", "familyName", "createdAt") SELECT "id", "givenName", "familyName", "createdAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);