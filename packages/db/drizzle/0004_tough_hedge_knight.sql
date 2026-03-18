CREATE TYPE "public"."knowledge_article_type" AS ENUM('imp');--> statement-breakpoint
CREATE TABLE "integrated_management_plan_note" (
	"id" serial PRIMARY KEY NOT NULL,
	"knowledge_article_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "integrated_management_plan_note_knowledgeArticleId_userId_unique" UNIQUE("knowledge_article_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "knowledge_article" ADD COLUMN "slug" varchar(500);--> statement-breakpoint
ALTER TABLE "knowledge_article" ADD COLUMN "article_type" "knowledge_article_type" DEFAULT 'imp' NOT NULL;--> statement-breakpoint
UPDATE "knowledge_article"
SET "slug" = concat(
	lower(trim(both '-' from regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))),
	'-',
	"id"
);--> statement-breakpoint
ALTER TABLE "knowledge_article" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" ADD CONSTRAINT "integrated_management_plan_note_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES "public"."knowledge_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" ADD CONSTRAINT "integrated_management_plan_note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_article" ADD CONSTRAINT "knowledge_article_slug_unique" UNIQUE("slug");
