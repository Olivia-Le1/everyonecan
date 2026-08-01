ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_keyword boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS keyword_month text;

UPDATE public.articles a
SET sort_order = s.rn
FROM (SELECT id, row_number() OVER (ORDER BY published_at DESC) AS rn FROM public.articles) s
WHERE a.id = s.id AND a.sort_order = 0;

DROP POLICY IF EXISTS "Anyone can read articles" ON public.articles;
CREATE POLICY "Anyone can read published articles"
  ON public.articles FOR SELECT
  USING (is_published OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete site settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value, label) VALUES
  ('hero_eyebrow', 'Stereotypes, decoded', 'Hero eyebrow'),
  ('hero_title', 'What the world gets wrong about every country', 'Hero title'),
  ('hero_subtitle', 'Playful, honest stories that unpack the clichés and reveal the hidden truths.', 'Hero subtitle'),
  ('countries_eyebrow', 'Explore', 'Countries eyebrow'),
  ('countries_title', 'Pick a country', 'Countries title'),
  ('countries_subtitle', 'Eight places, eight sets of assumptions worth questioning.', 'Countries subtitle'),
  ('articles_eyebrow', 'Trending Now', 'Articles eyebrow'),
  ('articles_title', 'Today''s top stories', 'Articles title'),
  ('articles_subtitle', 'The most-read bias-busting reads this week.', 'Articles subtitle'),
  ('keyword_title', 'Keyword of the month', 'Keyword section title'),
  ('keyword_subtitle', 'One idea we keep coming back to.', 'Keyword section subtitle')
ON CONFLICT (key) DO NOTHING;