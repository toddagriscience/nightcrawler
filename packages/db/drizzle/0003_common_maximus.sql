CREATE TABLE "farm_subscription" (
	"farm_id" integer PRIMARY KEY NOT NULL,
	"stripe_subscription_id" varchar(255),
	"stripe_price_id" varchar(255),
	"status" varchar(50),
	"amount" integer,
	"currency" varchar(10),
	"billing_interval" varchar(20),
	"billing_interval_count" integer,
	"cancel_at_period_end" boolean DEFAULT false,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "farm_subscription_stripeSubscriptionId_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "farm_subscription" ADD CONSTRAINT "farm_subscription_farm_id_farm_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farm"("id") ON DELETE cascade ON UPDATE no action;