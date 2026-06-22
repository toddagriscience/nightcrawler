CREATE TYPE "public"."seed_variety_status" AS ENUM('available', 'back_order', 'reference');--> statement-breakpoint
CREATE TABLE "seed_crop" (
                             "id" serial PRIMARY KEY NOT NULL,
                             "knowledge_article_id" integer NOT NULL,
                             "name" varchar(200) NOT NULL,
                             "slug" varchar(200) NOT NULL,
                             "description" text,
                             "source_content_hash" varchar(64),
                             "created_at" timestamp DEFAULT now() NOT NULL,
                             "updated_at" timestamp DEFAULT now() NOT NULL,
                             CONSTRAINT "seed_crop_slug_unique" UNIQUE("slug"),
                             CONSTRAINT "seed_crop_knowledgeArticleId_unique" UNIQUE("knowledge_article_id")
);
--> statement-breakpoint
CREATE TABLE "seed_variety" (
                                "id" serial PRIMARY KEY NOT NULL,
                                "knowledge_article_id" integer NOT NULL,
                                "seed_crop_id" integer NOT NULL,
                                "name" varchar(200) NOT NULL,
                                "slug" varchar(300) NOT NULL,
                                "description" text,
                                "status" "seed_variety_status" DEFAULT 'back_order' NOT NULL,
                                "price_per_oz_cents" integer,
                                "price_per_lb_cents" integer,
                                "price_per_plant_cents" integer,
                                "inventory_note" varchar(200),
                                "last_produced" varchar(50),
                                "location" varchar(200),
                                "source_content_hash" varchar(64),
                                "created_at" timestamp DEFAULT now() NOT NULL,
                                "updated_at" timestamp DEFAULT now() NOT NULL,
                                CONSTRAINT "seed_variety_slug_unique" UNIQUE("slug"),
                                CONSTRAINT "seed_variety_knowledgeArticleId_unique" UNIQUE("knowledge_article_id")
);
--> statement-breakpoint
ALTER TABLE "seed_crop" ADD CONSTRAINT "seed_crop_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES "public"."knowledge_article"("id")
    ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_variety" ADD CONSTRAINT "seed_variety_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES
    "public"."knowledge_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_variety" ADD CONSTRAINT "seed_variety_seed_crop_id_seed_crop_id_fk" FOREIGN KEY ("seed_crop_id") REFERENCES "public"."seed_crop"("id") ON DELETE cascade ON
    UPDATE no action;
