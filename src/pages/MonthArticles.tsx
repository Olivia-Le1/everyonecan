import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const MonthArticles = () => {
  const { id } = useParams();
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [articles, setArticles] = useState<any[] | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const [{ data: month }, { data: arts }] = await Promise.all([
        supabase.from("months").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("articles")
          .select("*")
          .eq("month_id", id)
          .eq("is_published", true)
          .order("sort_order", { ascending: true }),
      ]);

      setLabel(month?.label ?? "");
      setDescription(month?.description ?? "");
      setArticles(arts ?? []);
    };

    void load();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <h1 className="text-4xl font-black tracking-tighter">{label}</h1>
        {description && <p className="mt-3 text-muted-foreground max-w-2xl">{description}</p>}

        {articles === null ? (
          <p className="mt-10 text-muted-foreground">Loading...</p>
        ) : articles.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No articles yet.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link
                key={a.id}
                to={`/article/${a.id}`}
                className="block rounded-[1.5rem] overflow-hidden bg-white shadow-soft hover-lift"
              >
                {a.image_url && (
                  <img src={a.image_url} alt={a.title} className="w-full aspect-[4/3] object-cover" />
                )}
                <div className="p-5">
                  <h2 className="font-bold text-lg">{a.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MonthArticles;
