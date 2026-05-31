
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  category_color TEXT NOT NULL DEFAULT 'bg-pink-soft text-foreground',
  country_flag TEXT NOT NULL,
  country_name TEXT NOT NULL,
  views TEXT NOT NULL DEFAULT '0',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles" ON public.articles
  FOR SELECT USING (true);
CREATE POLICY "Only admins can insert articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete articles" ON public.articles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed
INSERT INTO public.articles (title, description, image_url, category, category_color, country_flag, country_name, views, published_at) VALUES
('Do Koreans really eat kimchi every day?', 'The real story behind Korea''s most famous food, and what locals actually eat.', '/src/assets/article-1.jpg', 'Korea', 'bg-pink-soft text-foreground', '🇰🇷', 'Korea', '12.4K', '2026-05-20'),
('New York is not all of America', '50 states, 50 lifestyles. The real meaning of diversity in the US.', '/src/assets/article-2.jpg', 'USA', 'bg-butter text-foreground', '🇺🇸', 'USA', '9.8K', '2026-05-18'),
('Quiet Japanese? Shibuya tells another story', 'Behind the politeness, the new faces of Gen Z Tokyo.', '/src/assets/article-3.jpg', 'Japan', 'bg-mint text-foreground', '🇯🇵', 'Japan', '15.2K', '2026-05-16'),
('Are Parisians really that chic?', 'Locals on real Paris, and the everyday romance you don''t see in films.', '/src/assets/article-4.jpg', 'France', 'bg-lavender text-foreground', '🇫🇷', 'France', '8.1K', '2026-05-14'),
('Brazil is so much more than football', 'Beyond Rio: the Amazon, the northeast, and stories you''ve never heard.', '/src/assets/article-5.jpg', 'Brazil', 'bg-peach text-foreground', '🇧🇷', 'Brazil', '6.5K', '2026-05-12'),
('The secret of Italian pasta, region by region', 'North vs south, and 20 regions with completely different tables.', '/src/assets/article-6.jpg', 'Italy', 'bg-rose text-foreground', '🇮🇹', 'Italy', '11.0K', '2026-05-10');
