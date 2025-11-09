CREATE TABLE "team_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"applicant_id" integer,
	"applied_role" text NOT NULL,
	"message" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer,
	"title" text NOT NULL,
	"description" text,
	"genre" text,
	"project_type" text NOT NULL,
	"status" text NOT NULL,
	"budget" integer,
	"deadline" timestamp,
	"location" text,
	"required_roles" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"skill" text NOT NULL,
	"level" text NOT NULL,
	"experience" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "team_applications" ADD CONSTRAINT "team_applications_project_id_team_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."team_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_applications" ADD CONSTRAINT "team_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_projects" ADD CONSTRAINT "team_projects_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;