CREATE TABLE "management_zone_observation" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone_id" integer NOT NULL,
	"user_id" integer,
	"body" text NOT NULL,
	"observed_on" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "management_zone_observation" ADD CONSTRAINT "management_zone_observation_management_zone_id_management_zone_id_fk" FOREIGN KEY ("management_zone_id") REFERENCES "public"."management_zone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management_zone_observation" ADD CONSTRAINT "management_zone_observation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "management_zone_observation_zone_observed_on_idx" ON "management_zone_observation" USING btree ("management_zone_id","observed_on");