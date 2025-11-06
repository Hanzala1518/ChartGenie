-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create datasets table
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  dataset_name TEXT NOT NULL,
  storage_object_path TEXT NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'ANALYZING', 'READY', 'ERROR')) DEFAULT 'PENDING',
  column_schema JSONB NOT NULL DEFAULT '{}',
  preview_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_datasets_status ON datasets(status);

-- Enable Row Level Security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own datasets" ON datasets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own datasets" ON datasets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own datasets" ON datasets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own datasets" ON datasets
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for datasets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('datasets', 'datasets', false);

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'datasets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
