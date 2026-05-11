-- Add date range columns to forums table
ALTER TABLE forums
ADD COLUMN IF NOT EXISTS forum_start_date DATE,
ADD COLUMN IF NOT EXISTS forum_end_date DATE;

-- Update existing records to have end_date as start_date + 3 days
UPDATE forums
SET forum_start_date = forum_date,
    forum_end_date = forum_date + INTERVAL '3 days'
WHERE forum_start_date IS NULL;
