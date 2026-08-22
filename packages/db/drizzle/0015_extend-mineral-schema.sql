CREATE TYPE "public"."mineral_tag" AS ENUM('Low', 'Med', 'High');--> statement-breakpoint
ALTER TYPE "public"."mineral_types" ADD VALUE 'Manganese';--> statement-breakpoint
ALTER TYPE "public"."mineral_types" ADD VALUE 'Copper';--> statement-breakpoint
ALTER TYPE "public"."mineral_types" ADD VALUE 'Boron';--> statement-breakpoint
ALTER TYPE "public"."units" ADD VALUE 'dimensionless';--> statement-breakpoint
ALTER TABLE "mineral" ADD COLUMN "ideal_value" numeric(9, 4);--> statement-breakpoint
ALTER TABLE "mineral" ADD COLUMN "tag" "mineral_tag";--> statement-breakpoint
ALTER TABLE "mineral" ADD COLUMN "four_lows" boolean;