import { useEffect, useState } from "react";
import { ArticleCard, type Article } from "./ArticleCard";
import { supabase } from "@/integrations/supabase/client";
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

const filters = ["All", "Culture", "Food", "Lifestyle"];

export const Articles = () => {
  const [items, setItems] = useState<Article[]>([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        const mapped: Article[] = (data ?? []).map((a: any) => ({
          image: fallbackImages[a.image_url] ?? a.image_url,
          category: `${a.country_flag} ${a.category}`,
          categoryColor: a.category_color,
          title: a.title,
          description: a.description,
          date: new Date(a.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          views: a.views,
        }));
        setItems(mapped);
      });
  }, []);

  return (
    <section id="articles" className="container py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-pink">Trending Now</span>
          <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
            Today's top stories <span className="inline-block animate-float">🔥</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl">The most-read bias-busting reads this week.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${active === t ? "bg-primary text-primary-foreground" : "bg-white shadow-soft hover:bg-secondary"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => <ArticleCard key={a.title} a={a} />)}
      </div>
    </section>
  );
};
