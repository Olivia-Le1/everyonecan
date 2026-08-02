-- Row Level Security (RLS) Setup for everyonecan
-- Run this in Supabase SQL Editor

-- Admin email constant
-- UPDATE this if your admin email changes
-- Current admin: l01048666065@gmail.com

-- ============================================
-- ARTICLES TABLE RLS
-- ============================================

-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can read articles
CREATE POLICY "Anyone can read articles"
  ON articles FOR SELECT
  USING (true);

-- Policy 2: Only admin can insert articles
CREATE POLICY "Only admin can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = 'l01048666065@gmail.com');

-- Policy 3: Only admin can update articles
CREATE POLICY "Only admin can update articles"
  ON articles FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'l01048666065@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'l01048666065@gmail.com');

-- Policy 4: Only admin can delete articles
CREATE POLICY "Only admin can delete articles"
  ON articles FOR DELETE
  USING (auth.jwt() ->> 'email' = 'l01048666065@gmail.com');

-- ============================================
-- SITE_SETTINGS TABLE RLS
-- ============================================

-- Enable RLS on site_settings table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can read settings
CREATE POLICY "Anyone can read settings"
  ON site_settings FOR SELECT
  USING (true);

-- Policy 2: Only admin can update settings
CREATE POLICY "Only admin can update settings"
  ON site_settings FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'l01048666065@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'l01048666065@gmail.com');

-- Policy 3: Only admin can insert settings
CREATE POLICY "Only admin can insert settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = 'l01048666065@gmail.com');

-- ============================================
-- VERIFICATION (Optional)
-- ============================================
-- Run this query to verify RLS is set up correctly:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
