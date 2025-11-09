CREATE TABLE "external_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"api_endpoint" text,
	"api_key" text,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "festival_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" text,
	"integration_id" integer,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"location" text,
	"submission_deadline" timestamp,
	"submission_url" text,
	"categories" text[],
	"entry_fee" integer,
	"prizes" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "funding_opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" text,
	"integration_id" integer,
	"title" text NOT NULL,
	"description" text,
	"organization" text,
	"amount" integer,
	"deadline" timestamp,
	"eligibility" text,
	"application_url" text,
	"category" text,
	"region" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "festival_events" ADD CONSTRAINT "festival_events_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funding_opportunities" ADD CONSTRAINT "funding_opportunities_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;