REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
CREATE POLICY "Anyone can read published articles" ON public.articles FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins can read all articles" ON public.articles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));