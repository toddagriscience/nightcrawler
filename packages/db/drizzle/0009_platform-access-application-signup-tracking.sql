ALTER TABLE "platform_access_application" ADD COLUMN "invite_sent_at" timestamp;
ALTER TABLE "platform_access_application" ADD COLUMN "signed_up_at" timestamp;
ALTER TABLE "platform_access_application" ADD COLUMN "farm_id" integer;

ALTER TABLE "platform_access_application" ADD CONSTRAINT "platform_access_application_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE no action ON UPDATE no action;
