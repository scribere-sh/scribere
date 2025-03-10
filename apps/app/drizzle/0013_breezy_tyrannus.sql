CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`parentType` text NOT NULL,
	`parentId` text NOT NULL,
	`uri` text NOT NULL,
	`mimeType` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `handle` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `givenName`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `familyName`;