ALTER TABLE "management_zone" RENAME COLUMN "clientId" TO "farmId";--> statement-breakpoint
ALTER TABLE "management_zone" DROP CONSTRAINT "management_zone_clientId_farm_id_fk";
--> statement-breakpoint
ALTER TABLE "farm_certificate" ALTER COLUMN "farmId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "farmLocation" ALTER COLUMN "farmId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "farm_info_internal_application" ALTER COLUMN "farmId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "management_zone" ADD CONSTRAINT "management_zone_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;