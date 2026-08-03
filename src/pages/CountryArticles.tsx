import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  description: string;
  image_url: string;
  country_flag: string;
  country_name: string;
}

const CountryArticles = () => {
  const { name } = useParams();
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    if (!name) return;

    supabase
      .from("articles")
      .select("*")
      .ilike("country_name", `%${decodeURIComponent(name)}%`)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setArticles((data as Article[]) ?? []);
      });
  }, [name]);

  if (articles === null) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="container py-16">
      <h1 className="text-4xl font-black tracking-tighter mb-8">
        {decodeURIComponent(name ?? "")} Articles
      </h1>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">
          No articles found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.id}`}
              className="block rounded-[1.5rem] overflow-hidden bg-white shadow-soft hover-lift"
            >
              {a.image_url && (
                <img
                  src={a.image_url}
                  alt={a.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              )}

              <div className="p-5">
                <h2 className="font-bold text-lg">
                  {a.title}
                </h2>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {a.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default CountryArticles;
