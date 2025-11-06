-- ============================================================================
-- ChartGenie - Complete Database Setup Script
-- ============================================================================
-- This script sets up the entire ChartGenie database including:
-- 1. Extensions
-- 2. Tables (datasets)
-- 3. Indexes
-- 4. Row Level Security (RLS) policies
-- 5. Storage buckets
-- 6. Storage access policies
--
-- Run this script in your Supabase SQL Editor to set up the project.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Create datasets table
-- Stores metadata about uploaded CSV files
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dataset_name TEXT NOT NULL,
  storage_object_path TEXT NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'ANALYZING', 'READY', 'ERROR')) DEFAULT 'PENDING',
  column_schema JSONB NOT NULL DEFAULT '{}',
  preview_data JSONB,
  suggested_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to suggested_questions column
COMMENT ON COLUMN datasets.suggested_questions IS 'AI-generated suggested questions for this dataset';

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status);
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable Row Level Security on datasets table
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own datasets" ON datasets;
DROP POLICY IF EXISTS "Users can insert own datasets" ON datasets;
DROP POLICY IF EXISTS "Users can update own datasets" ON datasets;
DROP POLICY IF EXISTS "Users can delete own datasets" ON datasets;

-- Create RLS policies for datasets table
-- Users can only access their own datasets

-- SELECT policy: Users can view their own datasets
CREATE POLICY "Users can view own datasets" ON datasets
  FOR SELECT 
  USING (auth.uid() = user_id);

-- INSERT policy: Users can create datasets for themselves
CREATE POLICY "Users can insert own datasets" ON datasets
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy: Users can update their own datasets
CREATE POLICY "Users can update own datasets" ON datasets
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- DELETE policy: Users can delete their own datasets
CREATE POLICY "Users can delete own datasets" ON datasets
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for CSV files
-- Note: This uses INSERT to avoid errors if bucket already exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'datasets', 
  'datasets', 
  false,  -- Private bucket
  52428800,  -- 50MB limit
  ARRAY['text/csv', 'application/vnd.ms-excel', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. STORAGE ACCESS POLICIES
-- ============================================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Storage INSERT policy: Users can upload files to their own folder
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage SELECT policy: Users can view their own files
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT 
  USING (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage UPDATE policy: Users can update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage DELETE policy: Users can delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 7. HELPER FUNCTIONS (Optional)
-- ============================================================================

-- Function to clean up orphaned storage objects when dataset is deleted
-- This automatically deletes the CSV file when a dataset record is deleted
CREATE OR REPLACE FUNCTION delete_storage_object()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the file from storage
  DELETE FROM storage.objects
  WHERE bucket_id = 'datasets' 
    AND name = OLD.storage_object_path;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-delete storage objects
DROP TRIGGER IF EXISTS on_dataset_deleted ON datasets;
CREATE TRIGGER on_dataset_deleted
  BEFORE DELETE ON datasets
  FOR EACH ROW
  EXECUTE FUNCTION delete_storage_object();

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- 
-- Next steps:
-- 1. Deploy Edge Functions:
--    npx supabase functions deploy analyze-dataset
--    npx supabase functions deploy rag-query
--
-- 2. Set Groq API secrets:
--    npx supabase secrets set GROQ_API_KEY=your_key_here
--    npx supabase secrets set GROQ_MODEL=moonshotai/kimi-k2-instruct-0905
--
-- 3. Configure your frontend .env file with:
--    VITE_SUPABASE_URL=your_supabase_url
--    VITE_SUPABASE_ANON_KEY=your_anon_key
--    VITE_GROQ_API_KEY=your_groq_key
--
-- 4. Run the development server:
--    npm run dev
--
-- ============================================================================
