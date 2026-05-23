CREATE TYPE "platform_access_application_status" AS ENUM('pending', 'approved', 'rejected');

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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

ALTER TABLE "platform_access_application" ADD CONSTRAINT "platform_access_application_reviewed_by_internal_account_id_internal_account_id_fk" FOREIGN KEY ("reviewed_by_internal_account_id") REFERENCES "public"."internal_account"("id") ON DELETE no action ON UPDATE no action;
