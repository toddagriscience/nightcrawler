CREATE TYPE "reminder_type" AS ENUM('system', 'deadline', 'alert', 'planting', 'soil sample', 'harvest', 'other');--> statement-breakpoint
CREATE TABLE "reminder" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "reminder_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" varchar(1000) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"href" varchar(500),
	"due_date" timestamp,
	"seasonal_label" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "reminder" ADD CONSTRAINT "reminder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
