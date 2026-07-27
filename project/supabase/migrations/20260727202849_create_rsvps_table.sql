/*
# Create rsvps table for birthday invitation confirmations

1. New Tables
- `rsvps`
  - `id` (uuid, primary key)
  - `guest_name` (text, not null) — name of the person confirming
  - `attending` (boolean, not null) — whether they will attend
  - `guests_count` (integer, default 1) — number of people coming
  - `message` (text) — optional message for the birthday child
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `rsvps`.
- This is a public invitation with no sign-in, so anon + authenticated
  can read (so guests see who's coming) and insert their own confirmation.
  Updates and deletes are intentionally left to the project owner via the
  service role / dashboard, not exposed to anon.
*/

CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  attending boolean NOT NULL,
  guests_count integer NOT NULL DEFAULT 1,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rsvps" ON rsvps;
CREATE POLICY "anon_select_rsvps" ON rsvps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_rsvps" ON rsvps;
CREATE POLICY "anon_insert_rsvps" ON rsvps FOR INSERT
  TO anon, authenticated WITH CHECK (true);
