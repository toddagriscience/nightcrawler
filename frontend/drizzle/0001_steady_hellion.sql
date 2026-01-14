ALTER TABLE "user_tac_acceptance" RENAME TO "account_agreement_acceptance";--> statement-breakpoint
ALTER TABLE "account_agreement_acceptance" DROP CONSTRAINT "user_tac_acceptance_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "farm_certificate" ALTER COLUMN "kind" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."certificate_type";--> statement-breakpoint
CREATE TYPE "public"."certificate_type" AS ENUM('Good Agriculture Practices', 'Local/Facility Inspection', 'Organic', 'Biodynamic', 'Regenerative Organic');--> statement-breakpoint
ALTER TABLE "farm_certificate" ALTER COLUMN "kind" SET DATA TYPE "public"."certificate_type" USING "kind"::"public"."certificate_type";--> statement-breakpoint
ALTER TABLE "account_agreement_acceptance" ADD CONSTRAINT "account_agreement_acceptance_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;