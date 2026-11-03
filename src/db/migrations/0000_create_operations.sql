CREATE TABLE `operations` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`category` text NOT NULL,
	`date` integer NOT NULL,
	`description` text NOT NULL
);
