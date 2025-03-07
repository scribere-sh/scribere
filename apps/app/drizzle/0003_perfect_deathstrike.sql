ALTER TABLE `authn_providers` RENAME COLUMN "context" TO "hash";--> statement-breakpoint
ALTER TABLE `email_addresses` RENAME COLUMN "verificationSentDate" TO "verificationDate";--> statement-breakpoint
DROP INDEX "email_addresses_emailAddress_unique";--> statement-breakpoint
DROP INDEX "users_id_unique";--> statement-breakpoint
ALTER TABLE `authn_providers` ALTER COLUMN "hash" TO "hash" text;--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_emailAddress_unique` ON `email_addresses` (`emailAddress`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
ALTER TABLE `authn_providers` ADD `ref` text;--> statement-breakpoint
ALTER TABLE `email_addresses` ALTER COLUMN "verificationDate" TO "verificationDate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `email_addresses` ADD `verificationRef` text;