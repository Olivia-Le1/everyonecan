-- COUNTRIES
CREATE TABLE public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag text NOT NULL DEFAULT '🌏',
  name text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  bg text NOT NULL DEFAULT 'bg-pink-soft',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.countries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.countries TO authenticated;
GRANT ALL ON public.countries TO service_role;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visible countries" ON public.countries FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "Admins can read all countries" ON public.countries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert countries" ON public.countries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update countries" ON public.countries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete countries" ON public.countries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MONTHS
CREATE TABLE public.months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  emoji text NOT NULL DEFAULT '🗓️',
  description text NOT NULL DEFAULT '',
  bg text NOT NULL DEFAULT 'bg-butter',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.months TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.months TO authenticated;
GRANT ALL ON public.months TO service_role;
ALTER TABLE public.months ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visible months" ON public.months FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "Admins can read all months" ON public.months FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert months" ON public.months FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update months" ON public.months FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete months" ON public.months FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER months_updated_at BEFORE UPDATE ON public.months FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- QUIZ QUESTIONS
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag text NOT NULL DEFAULT '🌏',
  country text NOT NULL DEFAULT '',
  question text NOT NULL,
  option_a text NOT NULL DEFAULT '',
  option_b text NOT NULL DEFAULT '',
  option_c text NOT NULL DEFAULT '',
  option_d text NOT NULL DEFAULT '',
  correct_index integer NOT NULL DEFAULT 0,
  explanation text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visible quiz questions" ON public.quiz_questions FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "Admins can read all quiz questions" ON public.quiz_questions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert quiz questions" ON public.quiz_questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update quiz questions" ON public.quiz_questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete quiz questions" ON public.quiz_questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ARTICLES tweaks
ALTER TABLE public.articles ALTER COLUMN category SET DEFAULT '';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS month_id uuid REFERENCES public.months(id) ON DELETE SET NULL;

-- Seed countries from existing articles
INSERT INTO public.countries (flag, name, subtitle, sort_order)
SELECT DISTINCT ON (country_name) country_flag, country_name, country_name, 0
FROM public.articles
WHERE country_name <> ''
ORDER BY country_name;

-- Seed months
INSERT INTO public.months (label, emoji, description, bg, sort_order) VALUES
  ('January', '❄️', 'Stories we kept coming back to in January.', 'bg-sky', 1),
  ('February', '💗', 'February''s keyword and the stories around it.', 'bg-rose', 2);

-- Seed quiz questions
INSERT INTO public.quiz_questions (flag, country, question, option_a, option_b, option_c, option_d, correct_index, explanation, sort_order) VALUES
  ('🇰🇷','Korea','Do Koreans really eat kimchi at every single meal?','Yes, every meal','Most meals, but not all','Only at dinner','Only on weekends',1,'Kimchi is a staple, but younger generations skip it more often than you''d think.',1),
  ('🇯🇵','Japan','Which Tokyo district is famous for loud, expressive Gen Z culture?','Ginza','Shibuya','Marunouchi','Roppongi',1,'Shibuya is the heart of youth culture — not exactly the ''quiet Japan'' stereotype.',2),
  ('🇫🇷','France','What do real Parisians complain about the most?','Croissants','The metro','Berets','Eiffel Tower',1,'The Paris metro is a national sport of complaining. Truly.',3),
  ('🇧🇷','Brazil','How many official biomes does Brazil have?','1','3','6','10',2,'Six biomes — from the Amazon to the Pampas. Way more than just beaches.',4),
  ('🇮🇹','Italy','Roughly how many official pasta shapes exist in Italy?','50','100','200','350+',3,'Over 350 shapes, each tied to a region and a specific sauce.',5);