-- Add forum reference to parking_lot table
ALTER TABLE parking_lot
ADD COLUMN IF NOT EXISTS forum_id UUID REFERENCES forums(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_parking_lot_forum_id ON parking_lot(forum_id);
