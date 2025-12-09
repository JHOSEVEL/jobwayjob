-- Migração inicial para Jobway (tables: profiles, jobs, candidates, matches)
-- Habilitar extensão pgcrypto para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migração inicial para Jobway (tables: profiles, jobs, candidates, matches)

-- Habilitar extensão uuid-ossp ou pgcrypto conforme o provider

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar,
  email varchar UNIQUE,
  phone varchar,
  user_type varchar,
  address jsonb,
  coordinates jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES profiles(id),
  title varchar,
  description text,
  seniority varchar,
  hard_skills text[],
  soft_skills text[],
  location_name varchar,
  latitude double precision,
  longitude double precision,
  modality varchar,
  isCanadianOpportunity boolean DEFAULT false,
  culture_tags text[],
  required_skills text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  name varchar,
  email varchar,
  role varchar,
  location_name varchar,
  latitude double precision,
  longitude double precision,
  experience_years integer,
  skills text[],
  soft_skills text[],
  culture_tags text[],
  bio text,
  resume_text text,
  visa_status varchar,
  english_level varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id),
  candidate_id uuid REFERENCES candidates(id),
  overall_score integer,
  technical_fit integer,
  cultural_fit integer,
  soft_skills_match integer,
  location_score integer,
  reasoning text,
  created_at timestamptz DEFAULT now()
);
