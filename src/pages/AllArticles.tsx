import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const AllArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setArticles(data ?? []);
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <button
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft font-bold text-sm hover:scale-105 transition"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tighter">All stories 📚</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every bias-busting read, all in one place.
        </p>

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
                  <img
                    src={a.image_url}
                    alt={a.title}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                )}
                <div className="p-5">
                  <span className="text-xs font-bold text-pink">
                    {a.country_flag} {a.country_name}
                  </span>
                  <h2 className="font-bold text-lg mt-1">{a.title}</h2>
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

export default AllArticles;
