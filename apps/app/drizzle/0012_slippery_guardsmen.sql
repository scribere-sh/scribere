DROP INDEX "email_addresses_emailAddress_unique";--> statement-breakpoint
DROP INDEX "users_id_unique";--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "mfaVerified" TO "mfaVerified" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `email_addresses_emailAddress_unique` ON `email_addresses` (`emailAddress`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);