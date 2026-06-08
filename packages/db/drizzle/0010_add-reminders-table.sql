CREATE TYPE "public"."platform_access_application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."reminder_type" AS ENUM('system', 'deadline', 'alert');--> statement-breakpoint
CREATE TABLE "platform_access_application" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_slug" varchar(96) NOT NULL,
	"status" "platform_access_application_status" DEFAULT 'pending' NOT NULL,
	"answers" jsonb NOT NULL,
	"retention_consent" boolean NOT NULL,
	"source_article_slug" varchar(200),
	"reviewed_by_internal_account_id" integer,
	"reviewed_at" timestamp,
	"signup_token" uuid,
	"signup_token_expires_at" timestamp,
	"invite_sent_at" timestamp,
	"signed_up_at" timestamp,
	"farm_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reminder" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "reminder_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" varchar(1000) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"href" varchar(500)
);
--> statement-breakpoint
ALTER TABLE "platform_access_application" ADD CONSTRAINT "platform_access_application_reviewed_by_internal_account_id_internal_account_id_fk" FOREIGN KEY ("reviewed_by_internal_account_id") REFERENCES "public"."internal_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_access_application" ADD CONSTRAINT "platform_access_application_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminder" ADD CONSTRAINT "reminder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;