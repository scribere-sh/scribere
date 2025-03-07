ALTER TABLE `email_addresses` RENAME COLUMN "isVerified" TO "isValidated";--> statement-breakpoint
ALTER TABLE `email_verification_requests` RENAME COLUMN "validationRef" TO "challengeRef";--> statement-breakpoint
ALTER TABLE `email_verification_requests` RENAME COLUMN "validationTokenHash" TO "challengeTokenHash";--> statement-breakpoint
ALTER TABLE `email_addresses` ADD `challengeRef` text REFERENCES email_verification_requests(challengeRef);