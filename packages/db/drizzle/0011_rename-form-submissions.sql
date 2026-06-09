ALTER TYPE "platform_access_application_status" RENAME TO "form_submission_status";--> statement-breakpoint
CREATE TYPE "form_submission_workflow_type" AS ENUM('generic', 'platform_access');--> statement-breakpoint
ALTER TABLE "platform_access_application" RENAME TO "form_submissions";--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "workflow_type" "form_submission_workflow_type" DEFAULT 'platform_access' NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" RENAME CONSTRAINT "platform_access_application_reviewed_by_internal_account_id_internal_account_id_fk" TO "form_submissions_reviewed_by_internal_account_id_internal_account_id_fk";--> statement-breakpoint
ALTER TABLE "form_submissions" RENAME CONSTRAINT "platform_access_application_farm_id_farm_id_fk" TO "form_submissions_farm_id_farm_id_fk";
