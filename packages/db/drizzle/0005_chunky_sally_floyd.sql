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
ALTER TABLE "seed_product" ADD CONSTRAINT "seed_product_imp_knowledge_article_id_knowledge_article_id_fk" FOREIGN KEY ("imp_knowledge_article_id") REFERENCES "public"."knowledge_article"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "seed_order_checkout" (
	"id" serial PRIMARY KEY NOT NULL,
	"stripe_checkout_session_id" varchar(255) NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"farm_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"customer_email" varchar(320),
	"items" jsonb NOT NULL,
	"fulfilled_at" timestamp,
	"email_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seed_order_checkout_stripeCheckoutSessionId_unique" UNIQUE("stripe_checkout_session_id"),
	CONSTRAINT "seed_order_checkout_stripePaymentIntentId_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
ALTER TABLE "seed_order_checkout" ADD CONSTRAINT "seed_order_checkout_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_order_checkout" ADD CONSTRAINT "seed_order_checkout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
