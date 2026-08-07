
CREATE TABLE public.article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_id, user_id)
);
GRANT SELECT ON public.article_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.article_likes TO authenticated;
GRANT ALL ON public.article_likes TO service_role;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes" ON public.article_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can like" ON public.article_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can unlike" ON public.article_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.article_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_comments TO authenticated;
GRANT ALL ON public.article_comments TO service_role;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.article_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can add comments" ON public.article_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON public.article_comments FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users or admins can delete comments" ON public.article_comments FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER article_comments_updated_at BEFORE UPDATE ON public.article_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX article_comments_article_idx ON public.article_comments(article_id, created_at DESC);
NOTIFY pgrst, 'reload schema';
