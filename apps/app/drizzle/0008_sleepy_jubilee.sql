PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_email_addresses` (
	`userId` text NOT NULL,
	`emailAddress` text NOT NULL,
	`isValidated` integer NOT NULL,
	`challengeRef` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_email_addresses`("userId", "emailAddress", "isValidated", "challengeRef") SELECT "userId", "emailAddress", "isValidated", "challengeRef" FROM `email_addresses`;--> statement-breakpoint
DROP TABLE `email_addresses`;--> statement-breakpoint
ALTER TABLE `__new_email_addresses` RENAME TO `email_addresses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_emailAddress_unique` ON `email_addresses` (`emailAddress`);--> statement-breakpoint
ALTER TABLE `email_verification_requests` ALTER COLUMN "challengeRef" TO "challengeRef" text NOT NULL REFERENCES email_addresses(challengeRef) ON DELETE no action ON UPDATE no action;