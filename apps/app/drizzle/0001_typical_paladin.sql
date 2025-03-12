CREATE TABLE `password_reset_challenges` (
	`emailRef` text,
	`challengeRef` text NOT NULL,
	`challengeToken` text NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
