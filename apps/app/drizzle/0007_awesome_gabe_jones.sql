CREATE TABLE `auth_providers` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`ref` text,
	`hash` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `oauth_providers`;