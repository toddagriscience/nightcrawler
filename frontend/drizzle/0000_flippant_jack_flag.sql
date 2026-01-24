CREATE TYPE "public"."user_role" AS ENUM('Admin', 'Viewer');--> statement-breakpoint
CREATE TYPE "public"."level_category" AS ENUM('Low', 'Med', 'High');--> statement-breakpoint
CREATE TYPE "public"."pest_type" AS ENUM('Insect', 'Disease');--> statement-breakpoint
CREATE TYPE "public"."oxidation_rate_tag" AS ENUM('Slow', 'Mixed', 'Ideal', 'High');--> statement-breakpoint
CREATE TABLE "analysis" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"analysis_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm" (
	"id" serial PRIMARY KEY NOT NULL,
	"informal_name" varchar(200),
	"business_name" varchar(200),
	"business_website" varchar(200),
	"management_start_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm_certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"farm_id" integer DEFAULT 2147483647 NOT NULL,
	"has_gap" boolean DEFAULT false,
	"gap_date" date,
	"has_local_inspection" boolean DEFAULT false,
	"local_inspection_date" date,
	"has_organic" boolean DEFAULT false,
	"organic_date" date,
	"has_biodynamic" boolean DEFAULT false,
	"biodynamic_date" date,
	"has_regenerative_organic" boolean DEFAULT false,
	"regenerative_organic" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm_location" (
	"farm_id" integer PRIMARY KEY DEFAULT 2147483647 NOT NULL,
	"location" "point",
	"apn" varchar(100),
	"county_state" varchar(200),
	"address1" varchar(200),
	"address2" varchar(200),
	"address3" varchar(200),
	"postal_code" varchar(20),
	"state" varchar(100),
	"country" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account_agreement_acceptance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"time_accepted" timestamp NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"ip_address" "cidr" NOT NULL,
	"version" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm_info_internal_application" (
	"farm_id" integer PRIMARY KEY NOT NULL,
	"split_operation" jsonb,
	"alternate_farming" jsonb,
	"total_gross_income" numeric(8, 2),
	"conservation_plan" text,
	"main_crops" text,
	"total_acreage" integer,
	"management_zone_structure" text,
	"farm_activites" jsonb,
	"production_location" jsonb,
	"cultivation_practices" jsonb,
	"livestock_incorporation" text,
	"weed_insect_diseases_control" text,
	"pest_control" jsonb,
	"off_farm_products" jsonb,
	"other_materials" jsonb,
	"mechanical_equipment" text,
	"supplier_contracts" text,
	"irrigation_water_source" jsonb,
	"irrigation_scheduling" text,
	"soil_moisture_monitoring" text,
	"irrigation_materials" text,
	"water_conservation" text,
	"water_quality_protection" text,
	"erosion_prevention" text,
	"near_contamination_source" jsonb,
	"active_wild_areas" jsonb,
	"natural_resources" text,
	"manage_harvests" jsonb,
	"water_used_post_harvest" jsonb,
	"primary_market_venues" jsonb,
	"branding" jsonb,
	"product_differentiation" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrated_management_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"analysis" varchar(13),
	"plan" text,
	"initialized" date NOT NULL,
	"updated" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "management_zone" (
	"id" serial PRIMARY KEY NOT NULL,
	"farm_id" integer,
	"location" "point",
	"name" varchar(200),
	"rotation_year" date,
	"npk" boolean,
	"npk_last_used" date,
	"irrigation" boolean,
	"water_convservation" boolean,
	"contamination_risk" "level_category",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mineral" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" varchar(13),
	"name" varchar(200) NOT NULL,
	"real_value" numeric(9, 4) NOT NULL,
	"ideal_value" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"four_lows" boolean NOT NULL,
	"units" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oxidation_rate" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" varchar(13),
	"real_ca_k" numeric(9, 4) NOT NULL,
	"ideal_ca_k" numeric(9, 4) NOT NULL,
	"real_na_mg" numeric(9, 4) NOT NULL,
	"ideal_na_mg" numeric(9, 4) NOT NULL,
	"tag" "oxidation_rate_tag",
	"units" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ph" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" varchar(13),
	"real_value" numeric(9, 4) NOT NULL,
	"ideal_value_lower" numeric(9, 4) NOT NULL,
	"ideal_value_upper" numeric(9, 4) NOT NULL,
	"low" numeric(9, 4) NOT NULL,
	"high" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solubility" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" varchar(13),
	"real_value" numeric(9, 4) NOT NULL,
	"ideal_value" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"units" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"farm_id" integer,
	"first_name" varchar(200) NOT NULL,
	"last_name" varchar(200) NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar(15),
	"approved" boolean DEFAULT false,
	"job" varchar(200),
	"role" "user_role" NOT NULL,
	"did_own_and_control_parcel" boolean,
	"did_manage_and_control" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "crop" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"name" varchar(200) NOT NULL,
	"planted" date NOT NULL,
	"picked" date,
	"is_covercrop" boolean,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fertilizer" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"name" varchar(200),
	"initial_use" date NOT NULL,
	"last_used" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livestock" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"animal" varchar(200),
	"initial_deployment" date NOT NULL,
	"undeployment" date,
	"currently_deployed" boolean NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pest" (
	"id" serial PRIMARY KEY NOT NULL,
	"management_zone" serial NOT NULL,
	"name" varchar(200) NOT NULL,
	"initial_encounter" date NOT NULL,
	"most_recent_encounter" date,
	"type" "pest_type" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_certificate" ADD CONSTRAINT "farm_certificate_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set default ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_location" ADD CONSTRAINT "farm_location_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set default ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_agreement_acceptance" ADD CONSTRAINT "account_agreement_acceptance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_info_internal_application" ADD CONSTRAINT "farm_info_internal_application_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_analysis_analysis_id_fk" FOREIGN KEY ("analysis") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management_zone" ADD CONSTRAINT "management_zone_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mineral" ADD CONSTRAINT "mineral_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oxidation_rate" ADD CONSTRAINT "oxidation_rate_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ph" ADD CONSTRAINT "ph_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solubility" ADD CONSTRAINT "solubility_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop" ADD CONSTRAINT "crop_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fertilizer" ADD CONSTRAINT "fertilizer_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pest" ADD CONSTRAINT "pest_management_zone_management_zone_id_fk" FOREIGN KEY ("management_zone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;