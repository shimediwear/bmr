-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bmr (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  product_name text NOT NULL,
  product_code text NOT NULL,
  brand_name text,
  product_size text,
  batch_no text NOT NULL UNIQUE,
  batch_size text,
  mfg_date date,
  exp_date date,
  type_of_packing text,
  date_of_commencement date,
  date_of_completion date,
  raw_materials jsonb DEFAULT '[]'::jsonb,
  packing_materials jsonb DEFAULT '[]'::jsonb,
  process_steps jsonb DEFAULT '{}'::jsonb,
  sterilization jsonb DEFAULT '{}'::jsonb,
  labeling jsonb DEFAULT '{}'::jsonb,
  final_packing jsonb DEFAULT '{}'::jsonb,
  declarations jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft'::text,
  document_no text,
  revision_no text,
  issue_no text,
  bmr_type text DEFAULT 'standard'::text,
  kit_contents jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT bmr_pkey PRIMARY KEY (id)
);
CREATE TABLE public.fabrics (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  supplier_id bigint,
  width text,
  CONSTRAINT fabrics_pkey PRIMARY KEY (id),
  CONSTRAINT fabrics_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
);
CREATE TABLE public.in_coming_report (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product_name text NOT NULL,
  report_no text NOT NULL,
  performance_level text NOT NULL,
  batch_no text NOT NULL,
  supplier_name bigint NOT NULL,
  batch_size text NOT NULL,
  invoice_no text NOT NULL,
  invoice_date timestamp with time zone NOT NULL,
  mfg_date timestamp with time zone,
  exp_date timestamp with time zone,
  sample_qty text NOT NULL,
  sample_date timestamp with time zone NOT NULL,
  release_date timestamp with time zone NOT NULL,
  fabric_composition text NOT NULL,
  parameters_results json NOT NULL,
  biocompatibility_result json NOT NULL,
  visual_results json NOT NULL,
  result text NOT NULL,
  tested_by text NOT NULL,
  reviewed_by text NOT NULL,
  updated_at timestamp with time zone,
  CONSTRAINT in_coming_report_pkey PRIMARY KEY (id),
  CONSTRAINT in_coming_report_supplier_name_fkey FOREIGN KEY (supplier_name) REFERENCES public.suppliers(id)
);
CREATE TABLE public.suppliers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL UNIQUE,
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);