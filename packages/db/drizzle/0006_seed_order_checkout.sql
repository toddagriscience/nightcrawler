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
	CONSTRAINT "seed_order_checkout_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id"),
	CONSTRAINT "seed_order_checkout_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
ALTER TABLE "seed_order_checkout" ADD CONSTRAINT "seed_order_checkout_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_order_checkout" ADD CONSTRAINT "seed_order_checkout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
