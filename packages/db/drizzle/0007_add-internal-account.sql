CREATE TABLE "internal_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(200) NOT NULL,
	"last_name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"title" varchar(200),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "internal_account_email_unique" UNIQUE("email")
);