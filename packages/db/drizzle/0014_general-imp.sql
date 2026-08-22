CREATE TABLE "general_imp" (
                               "id" serial PRIMARY KEY NOT NULL,
                               "knowledge_article_id" integer NOT NULL,
                               "title" varchar(300),
                               "slug" varchar(300) NOT NULL,
                               "tags" text[] DEFAULT '{}' NOT NULL,
                               "trigger_raw" text,
                               "content" text NOT NULL,
                               "source_content_hash" varchar(64),
                               "created_at" timestamp DEFAULT now() NOT NULL,
                               "updated_at" timestamp DEFAULT now() NOT NULL,
                               CONSTRAINT "general_imp_slug_unique" UNIQUE("slug"),
                               CONSTRAINT "general_imp_knowledgeArticleId_unique" UNIQUE("knowledge_article_id")
);
--> statement-breakpoint
ALTER TABLE "general_imp" ADD CONSTRAINT "general_imp_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("knowledge_article_id") REFERENCES
    "public"."knowledge_article"("id") ON DELETE cascade ON UPDATE no action;