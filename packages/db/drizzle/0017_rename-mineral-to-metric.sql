ALTER TABLE "public"."mineral" RENAME TO "metric";
--> statement-breakpoint
ALTER TABLE "public"."metric" RENAME CONSTRAINT "mineral_analysis_id_analysis_id_fk" TO "metric_analysis_id_analysis_id_fk";
