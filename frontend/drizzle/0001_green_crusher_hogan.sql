ALTER TABLE "farmLocation" RENAME TO "farm_location";--> statement-breakpoint
ALTER TABLE "farm_location" DROP CONSTRAINT "farmLocation_farmId_farm_id_fk";
--> statement-breakpoint
ALTER TABLE "farm_location" ADD CONSTRAINT "farm_location_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;