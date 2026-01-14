CREATE TYPE "public"."certificate_type" AS ENUM('National Organic Program', 'Demeter', 'Good Agriculture Practices', 'Local/Facility Inspection', 'Organic', 'Biodynamic', 'Regenerative Organic');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('Admin', 'Viewer');--> statement-breakpoint
CREATE TYPE "public"."level_category" AS ENUM('Low', 'Med', 'High');--> statement-breakpoint
CREATE TYPE "public"."pest_type" AS ENUM('Insect', 'Disease');--> statement-breakpoint
CREATE TYPE "public"."oxidation_rate_tag" AS ENUM('Slow', 'Mixed', 'Ideal', 'High');--> statement-breakpoint
CREATE TABLE "analysis" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"analysisDate" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm" (
	"id" serial PRIMARY KEY NOT NULL,
	"informalName" varchar(200),
	"businessName" varchar(200),
	"businessWebsite" varchar(200),
	"managementStartDate" date,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm_certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmId" varchar(13),
	"kind" "certificate_type" NOT NULL,
	"date" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farmLocation" (
	"farmId" varchar(13) PRIMARY KEY NOT NULL,
	"location" "point",
	"apn" varchar(100),
	"countyState" varchar(200),
	"address1" varchar(200),
	"address2" varchar(200),
	"address3" varchar(200),
	"postalCode" varchar(20),
	"state" varchar(100),
	"country" varchar(200),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farm_info_internal_application" (
	"farmId" varchar(13) PRIMARY KEY NOT NULL,
	"splitOperation" jsonb,
	"alternateFarming" jsonb,
	"totalGrossIncome" numeric(8, 2),
	"conservationPlan" text,
	"mainCrops" text,
	"totalAcreage" integer,
	"managementZoneStructure" text,
	"farmActivites" jsonb,
	"productionLocation" jsonb,
	"cultivationPractices" jsonb,
	"livestockIncorporation" text,
	"weedInsectDiseasesControl" text,
	"pestControl" jsonb,
	"offFarmProducts" jsonb,
	"otherMaterials" jsonb,
	"mechanicalEquipment" text,
	"supplierContracts" text,
	"irrigationWaterSource" jsonb,
	"irrigationScheduling" text,
	"soilMoistureMonitoring" text,
	"irrigationMaterials" text,
	"waterConservation" text,
	"waterQualityProtection" text,
	"erosionPrevention" text,
	"nearContaminationSource" jsonb,
	"activeWildAreas" jsonb,
	"naturalResources" text,
	"manageHarvests" jsonb,
	"waterUsedPostHarvest" jsonb,
	"primaryMarketVenues" jsonb,
	"branding" jsonb,
	"productDifferentiation" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrated_management_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"analysis" varchar(13) PRIMARY KEY NOT NULL,
	"plan" text,
	"initialized" date NOT NULL,
	"updated" date,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "management_zone" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" varchar(13),
	"location" "point",
	"name" varchar(200),
	"rotationYear" date,
	"npk" boolean,
	"npkLastUsed" date,
	"irrigation" boolean,
	"waterConvservation" boolean,
	"contaminationRisk" "level_category",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mineral" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysisId" varchar(13),
	"name" varchar(200) NOT NULL,
	"real_value" numeric(9, 4) NOT NULL,
	"ideal_value" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"four_lows" boolean NOT NULL,
	"units" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oxidation_rate" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysisId" varchar(13),
	"real_caK" numeric(9, 4) NOT NULL,
	"ideal_caK" numeric(9, 4) NOT NULL,
	"real_NaMg" numeric(9, 4) NOT NULL,
	"ideal_NaMg" numeric(9, 4) NOT NULL,
	"tag" "oxidation_rate_tag",
	"units" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ph" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysisId" varchar(13),
	"realValue" numeric(9, 4) NOT NULL,
	"idealValueLower" numeric(9, 4) NOT NULL,
	"idealValueUpper" numeric(9, 4) NOT NULL,
	"low" numeric(9, 4) NOT NULL,
	"high" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solubility" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysisId" varchar(13),
	"real_value" numeric(9, 4) NOT NULL,
	"ideal_value" numeric(9, 4) NOT NULL,
	"tag" "level_category",
	"units" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmId" integer,
	"firstName" varchar(200) NOT NULL,
	"lastName" varchar(200) NOT NULL,
	"email" "citext" NOT NULL,
	"phone" varchar(15),
	"approved" boolean DEFAULT false,
	"job" varchar(200),
	"role" "user_role" NOT NULL,
	"didOwnAndControlParcel" boolean,
	"didManageAndControl" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_tac_acceptance" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"time_accepted" timestamp NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"ipAddress" "cidr" NOT NULL,
	"version" varchar(200) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crop" (
	"id" serial PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"name" varchar(200) NOT NULL,
	"planted" date NOT NULL,
	"picked" date,
	"isCovercrop" boolean,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fertilizer" (
	"id" serial PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"name" varchar(200),
	"initial_use" date NOT NULL,
	"last_used" date NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livestock" (
	"id" serial PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"animal" varchar(200),
	"initialDeployment" date NOT NULL,
	"undeployment" date,
	"currentlyDeployed" boolean NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pest" (
	"id" serial PRIMARY KEY NOT NULL,
	"managementZone" serial NOT NULL,
	"name" varchar(200) NOT NULL,
	"initialEncounter" date NOT NULL,
	"mostRecentEncounter" date,
	"type" "pest_type" NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_certificate" ADD CONSTRAINT "farm_certificate_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farmLocation" ADD CONSTRAINT "farmLocation_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_info_internal_application" ADD CONSTRAINT "farm_info_internal_application_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_analysis_analysis_id_fk" FOREIGN KEY ("analysis") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management_zone" ADD CONSTRAINT "management_zone_clientId_farm_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mineral" ADD CONSTRAINT "mineral_analysisId_analysis_id_fk" FOREIGN KEY ("analysisId") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oxidation_rate" ADD CONSTRAINT "oxidation_rate_analysisId_analysis_id_fk" FOREIGN KEY ("analysisId") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ph" ADD CONSTRAINT "ph_analysisId_analysis_id_fk" FOREIGN KEY ("analysisId") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solubility" ADD CONSTRAINT "solubility_analysisId_analysis_id_fk" FOREIGN KEY ("analysisId") REFERENCES "public"."analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_farmId_farm_id_fk" FOREIGN KEY ("farmId") REFERENCES "public"."farm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tac_acceptance" ADD CONSTRAINT "user_tac_acceptance_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop" ADD CONSTRAINT "crop_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fertilizer" ADD CONSTRAINT "fertilizer_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pest" ADD CONSTRAINT "pest_managementZone_management_zone_id_fk" FOREIGN KEY ("managementZone") REFERENCES "public"."management_zone"("id") ON DELETE set null ON UPDATE no action;