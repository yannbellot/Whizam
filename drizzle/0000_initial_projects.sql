CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_name_nonempty" CHECK ("projects"."name" ~ '[^[:space:]]'),
	CONSTRAINT "projects_description_length" CHECK (char_length("projects"."description") <= 2000)
);
