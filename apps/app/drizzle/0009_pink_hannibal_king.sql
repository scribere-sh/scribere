PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_email_verification_requests` (
	`emailRef` text,
	`challengeRef` text NOT NULL,
	`challengeTokenHash` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_email_verification_requests`("emailRef", "challengeRef", "challengeTokenHash") SELECT "emailRef", "challengeRef", "challengeTokenHash" FROM `email_verification_requests`;--> statement-breakpoint
DROP TABLE `email_verification_requests`;--> statement-breakpoint
ALTER TABLE `__new_email_verification_requests` RENAME TO `email_verification_requests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `email_addresses` ALTER COLUMN "challengeRef" TO "challengeRef" text REFERENCES email_verification_requests(challengeRef) ON DELETE no action ON UPDATE no action;