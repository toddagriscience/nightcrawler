ALTER TABLE "integrated_management_plan_note" RENAME COLUMN "knowledge_article_id" TO "integrated_management_plan_id";--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" DROP CONSTRAINT "integrated_management_plan_note_knowledgeArticleId_userId_unique";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP CONSTRAINT "knowledge_article_slug_unique";--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" DROP CONSTRAINT "integrated_management_plan_note_knowledge_article_id_knowledge_article_id_fk";--> statement-breakpoint
ALTER TABLE "seed_product" DROP CONSTRAINT "seed_product_imp_knowledge_article_id_knowledge_article_id_fk";--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "management_zone" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "management_zone" DROP NOT NULL;--> statement-breakpoint
DELETE FROM "integrated_management_plan";--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "knowledge_article_id" integer;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "title" varchar(500);--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "slug" varchar(500);--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "category" "knowledge_category";--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD COLUMN "source" varchar(200);--> statement-breakpoint
ALTER TABLE "seed_product" ADD COLUMN "knowledge_article_id" integer;--> statement-breakpoint
ALTER TABLE "seed_product" ADD COLUMN "related_integrated_management_plan_id" integer;--> statement-breakpoint
INSERT INTO "integrated_management_plan" (
	"knowledge_article_id",
	"title",
	"slug",
	"content",
	"category",
	"source",
	"initialized",
	"updated",
	"created_at",
	"updated_at"
)
SELECT
	article."id",
	article."title",
	article."slug",
	article."content",
	article."category",
	article."source",
	COALESCE(article."created_at"::date, CURRENT_DATE),
	NULL,
	article."created_at",
	article."updated_at"
FROM "knowledge_article" article;--> statement-breakpoint
UPDATE "integrated_management_plan_note" note
SET "integrated_management_plan_id" = imp."id"
FROM "integrated_management_plan" imp
WHERE imp."knowledge_article_id" = note."integrated_management_plan_id";--> statement-breakpoint
UPDATE "seed_product" product
SET "related_integrated_management_plan_id" = imp."id"
FROM "integrated_management_plan" imp
WHERE imp."knowledge_article_id" = product."imp_knowledge_article_id";--> statement-breakpoint
DO $$
DECLARE
	seed_product_record RECORD;
	new_knowledge_article_id integer;
BEGIN
	FOR seed_product_record IN
		SELECT
			"id",
			"embedding",
			"created_at",
			"updated_at"
		FROM "seed_product"
	ORDER BY "id"
	LOOP
		INSERT INTO "knowledge_article" ("embedding", "created_at", "updated_at")
		VALUES (
			seed_product_record."embedding",
			seed_product_record."created_at",
			seed_product_record."updated_at"
		)
		RETURNING "id" INTO new_knowledge_article_id;

		UPDATE "seed_product"
		SET "knowledge_article_id" = new_knowledge_article_id
		WHERE "id" = seed_product_record."id";
	END LOOP;
END $$;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "knowledge_article_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "seed_product" ALTER COLUMN "knowledge_article_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES "public"."knowledge_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" ADD CONSTRAINT "integrated_management_plan_note_integrated_management_plan_id_integrated_management_plan_id_fk" FOREIGN KEY ("integrated_management_plan_id") REFERENCES "public"."integrated_management_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_product" ADD CONSTRAINT "seed_product_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES "public"."knowledge_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_product" ADD CONSTRAINT "seed_product_related_integrated_management_plan_id_integrated_management_plan_id_fk" FOREIGN KEY ("related_integrated_management_plan_id") REFERENCES "public"."integrated_management_plan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "article_type";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "knowledge_article" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "seed_product" DROP COLUMN "imp_knowledge_article_id";--> statement-breakpoint
ALTER TABLE "seed_product" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_knowledgeArticleId_unique" UNIQUE("knowledge_article_id");--> statement-breakpoint
ALTER TABLE "integrated_management_plan" ADD CONSTRAINT "integrated_management_plan_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "integrated_management_plan_note" ADD CONSTRAINT "integrated_management_plan_note_integratedManagementPlanId_userId_unique" UNIQUE("integrated_management_plan_id","user_id");--> statement-breakpoint
ALTER TABLE "seed_product" ADD CONSTRAINT "seed_product_knowledgeArticleId_unique" UNIQUE("knowledge_article_id");--> statement-breakpoint
DROP TYPE "public"."knowledge_article_type";
