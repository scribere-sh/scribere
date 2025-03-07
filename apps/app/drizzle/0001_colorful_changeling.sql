CREATE TABLE `authn_providers` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`context` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_addresses` (
	`userId` text NOT NULL,
	`emailAddress` text NOT NULL,
	`isVerified` integer NOT NULL,
	`verificationSentDate` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_emailAddress_unique` ON `email_addresses` (`emailAddress`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`givenName` text,
	`familyName` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "givenName", "familyName", "createdAt") SELECT "id", "givenName", "familyName", "createdAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);