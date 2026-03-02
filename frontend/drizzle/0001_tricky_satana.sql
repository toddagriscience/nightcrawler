ALTER TABLE "integrated_management_plan" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "initialized" date NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "updated" date;--> statement-breakpoint
ALTER TABLE "management_zone" DROP COLUMN "contamination_risk";--> statement-breakpoint
ALTER TABLE "mineral" DROP COLUMN "tag";--> statement-breakpoint
ALTER TABLE "solubility" DROP COLUMN "tag";--> statement-breakpoint
DROP TYPE "public"."level_category";