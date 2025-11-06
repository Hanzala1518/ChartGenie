-- Add suggested_questions column to datasets table
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS suggested_questions jsonb DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN datasets.suggested_questions IS 'AI-generated suggested questions for this dataset';
