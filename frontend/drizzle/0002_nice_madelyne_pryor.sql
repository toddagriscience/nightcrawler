CREATE TYPE "public"."mineral_types" AS ENUM('Calcium');--> statement-breakpoint
CREATE TYPE "public"."widgets" AS ENUM('Macro Radar', 'Calcium Widget');--> statement-breakpoint
CREATE TYPE "public"."units" AS ENUM('ppm');--> statement-breakpoint
CREATE TABLE "standard_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"farm_id" integer NOT NULL,
	"calcium_min" numeric(10, 2) DEFAULT 0 NOT NULL,
	"calcium_low" numeric(10, 2) DEFAULT 0 NOT NULL,
	"calcium_ideal" numeric(10, 2) DEFAULT 0 NOT NULL,
	"calcium_high" numeric(10, 2) DEFAULT 0 NOT NULL,
	"calcium_max" numeric(10, 2) DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "standard_values_farmId_unique" UNIQUE("farm_id")
);
--> statement-breakpoint
CREATE TABLE "tab" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" integer NOT NULL,
	"management_zone" integer NOT NULL,
	CONSTRAINT "tab_managementZone_user_unique" UNIQUE("management_zone","user")
);
--> statement-breakpoint
CREATE TABLE "widget" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" integer NOT NULL,
	"name" "widgets" NOT NULL,
	"widget_metadata" jsonb NOT NULL,
	CONSTRAINT "widget_managementZone_name_unique" UNIQUE("management_zone","name")
);
--> statement-breakpoint
ALTER TABLE "mineral" ALTER COLUMN "name" SET DATA TYPE "public"."mineral_types" USING "name"::"public"."mineral_types";--> statement-breakpoint
ALTER TABLE "mineral" ALTER COLUMN "units" SET DATA TYPE "public"."units" USING "units"::"public"."units";--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "standard_values" ADD CONSTRAINT "standard_values_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tab" ADD CONSTRAINT "tab_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tab" ADD CONSTRAINT "tab_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget" ADD CONSTRAINT "widget_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mineral" DROP COLUMN "ideal_value";--> statement-breakpoint
ALTER TABLE "mineral" DROP COLUMN "four_lows";