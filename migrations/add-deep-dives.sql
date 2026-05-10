-- Add columns for deep dives 2 and 3 to forums table
ALTER TABLE forums
ADD COLUMN IF NOT EXISTS deep_dive_2_topic VARCHAR(255),
ADD COLUMN IF NOT EXISTS deep_dive_2_person_id INTEGER,
ADD COLUMN IF NOT EXISTS deep_dive_3_topic VARCHAR(255),
ADD COLUMN IF NOT EXISTS deep_dive_3_person_id INTEGER;
