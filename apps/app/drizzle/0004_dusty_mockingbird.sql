ALTER TABLE `authn_providers` RENAME TO `oauth_providers`;--> statement-breakpoint
CREATE TABLE `email_verification_requests` (
	`validationRef` text NOT NULL,
	`validationTokenHash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`mfaVerified` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `two_factor_authentication_providers` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`challenge` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_oauth_providers` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`ref` text,
	`hash` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_oauth_providers`("userId", "type", "ref", "hash") SELECT "userId", "type", "ref", "hash" FROM `oauth_providers`;--> statement-breakpoint
DROP TABLE `oauth_providers`;--> statement-breakpoint
ALTER TABLE `__new_oauth_providers` RENAME TO `oauth_providers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `email_addresses` DROP COLUMN `verificationDate`;--> statement-breakpoint
ALTER TABLE `email_addresses` DROP COLUMN `verificationRef`;