CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`parentType` text NOT NULL,
	`parentId` text NOT NULL,
	`uri` text NOT NULL,
	`mimeType` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_providers` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`ref` text,
	`hash` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_addresses` (
	`userId` text NOT NULL,
	`emailAddress` text NOT NULL,
	`isValidated` integer NOT NULL,
	`challengeRef` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_emailAddress_unique` ON `email_addresses` (`emailAddress`);--> statement-breakpoint
CREATE TABLE `email_verification_requests` (
	`emailRef` text,
	`challengeRef` text NOT NULL,
	`challengeTokenHash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`mfaVerified` integer,
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
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`displayName` text NOT NULL,
	`handle` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);