-- Quit Vaping App Database Schema
-- This schema sets up a single-row table for storing app data

-- Create the app_data table
CREATE TABLE IF NOT EXISTS app_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data with default structure
-- IMPORTANT: After running this schema, the app will calculate dynamic dates
-- based on the current date when first loaded. The dates below serve as
-- a fallback to ensure the app doesn't crash.
INSERT INTO app_data (data)
VALUES ('{
  "password": "22mvj",
  "dates": {
    "startDate": "2026-03-02",
    "quitDate": "2026-03-10",
    "phase21End": "2026-04-21",
    "phase14End": "2026-05-05",
    "phase7End": "2026-05-19",
    "nicotineFreeDate": "2026-05-19"
  },
  "reminders": {
    "patchTime": "08:00",
    "patchEnabled": true,
    "nrtTime": null,
    "nrtEnabled": false
  },
  "cravings": [],
  "lastPuffTime": null,
  "pwaInstalled": false
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create index on updated_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_app_data_updated_at ON app_data(updated_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_app_data_updated_at
  BEFORE UPDATE ON app_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
