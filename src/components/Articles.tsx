import { useEffect, useState } from "react";
import { ArticleCard, type Article } from "./ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";
import a4 from "@/assets/article-4.jpg";
import a5 from "@/assets/article-5.jpg";
import a6 from "@/assets/article-6.jpg";

const fallbackImages: Record<string, string> = {
  "/src/assets/article-1.jpg": a1,
  "/src/assets/article-2.jpg": a2,
  "/src/assets/article-3.jpg": a3,
  "/src/assets/article-4.jpg": a4,
  "/src/assets/article-5.jpg": a5,
  "/src/assets/article-6.jpg": a6,
};

export const Articles = () => {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useSiteSettings();

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        const mapped: Article[] = (data ?? []).map((a: any) => ({
          id: a.id,
          image: fallbackImages[a.image_url] ?? a.image_url,
          category: a.category ? `${a.country_flag} ${a.category}` : `${a.country_flag} ${a.country_name}`,
          categoryColor: a.category_color,
          title: a.title,
          description: a.description,
        }));
        setItems(mapped);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="articles" className="container py-20 md:py-28">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="container py-20 md:py-28">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-pink">
          {t("articles_eyebrow", "Trending Now")}
        </span>
        <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
          {t("articles_title", "Today's top stories")} <span className="inline-block animate-float">🔥</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          {t("articles_subtitle", "The most-read bias-busting reads this week.")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
    </section>
  );
};
