-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  role VARCHAR(255),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create conversation_months table
CREATE TABLE IF NOT EXISTS conversation_months (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month VARCHAR(7) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create conversation_topics table
CREATE TABLE IF NOT EXISTS conversation_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id UUID NOT NULL REFERENCES conversation_months(id) ON DELETE CASCADE,
  topic_name VARCHAR(255) NOT NULL,
  outcome TEXT,
  action_items TEXT[] DEFAULT ARRAY[]::TEXT[],
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create parking_lot table
CREATE TABLE IF NOT EXISTS parking_lot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_name VARCHAR(255) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create newsfeed table
CREATE TABLE IF NOT EXISTS newsfeed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_text TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create forums table (replaces meetings)
CREATE TABLE IF NOT EXISTS forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_date DATE NOT NULL,
  city VARCHAR(255) NOT NULL,
  host_name VARCHAR(255) NOT NULL,
  host_location VARCHAR(255),
  deep_dive_topic VARCHAR(255),
  deep_dive_person_id INTEGER,
  deep_dive_2_topic VARCHAR(255),
  deep_dive_2_person_id INTEGER,
  deep_dive_3_topic VARCHAR(255),
  deep_dive_3_person_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create forum_notes table (tracks notes for each person in each forum)
CREATE TABLE IF NOT EXISTS forum_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
  person_id INTEGER NOT NULL,
  note_field_1 TEXT,
  note_field_2 TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create keyword_flags table (auto-generated keyword tracking)
CREATE TABLE IF NOT EXISTS keyword_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id INTEGER NOT NULL,
  keyword VARCHAR(255) NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  forums_appearing_in INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  flagged_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_conversation_topics_month_id ON conversation_topics(month_id);
CREATE INDEX idx_conversation_topics_assigned_to_id ON conversation_topics(assigned_to_id);
CREATE INDEX idx_parking_lot_assigned_to_id ON parking_lot(assigned_to_id);
CREATE INDEX idx_parking_lot_resolved ON parking_lot(resolved_at);
CREATE INDEX idx_newsfeed_submitter_id ON newsfeed(submitter_id);
CREATE INDEX idx_newsfeed_created_at ON newsfeed(created_at);
CREATE INDEX idx_forums_date ON forums(forum_date);
CREATE INDEX idx_forum_notes_forum_id ON forum_notes(forum_id);
CREATE INDEX idx_forum_notes_person_id ON forum_notes(person_id);
CREATE INDEX idx_keyword_flags_person_id ON keyword_flags(person_id);
CREATE INDEX idx_keyword_flags_keyword ON keyword_flags(keyword);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_lot ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsfeed ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_flags ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all authenticated users to read/write
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on conversation_months" ON conversation_months
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on conversation_topics" ON conversation_topics
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on parking_lot" ON parking_lot
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on newsfeed" ON newsfeed
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on forums" ON forums
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on forum_notes" ON forum_notes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on keyword_flags" ON keyword_flags
  FOR ALL USING (true) WITH CHECK (true);
