CREATE TABLE "seed_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"price_in_cents" integer NOT NULL,
	"unit" varchar(50) DEFAULT 'lb' NOT NULL,
	"image_url" varchar(500),
	"advisor_contact_url" varchar(500) DEFAULT '/contact',
	"imp_knowledge_article_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"embedding" vector(3072),
	CONSTRAINT "seed_product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "knowledge_article" ALTER COLUMN "slug" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "seed_product" ADD CONSTRAINT "seed_product_imp_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("imp_knowledge_article_id") REFERENCES "public"."knowledge_article"("id") ON DELETE set null ON UPDATE no action;