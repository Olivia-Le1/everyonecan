import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const AllMonths = () => {
  const navigate = useNavigate();
  const [months, setMonths] = useState<any[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const [{ data: rows }, { data: arts }] = await Promise.all([
        supabase
          .from("months")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true }),
        supabase.from("articles").select("month_id").eq("is_published", true),
      ]);

      const counts = new Map<string, number>();
      (arts ?? []).forEach((a: any) => {
        if (a.month_id) counts.set(a.month_id, (counts.get(a.month_id) ?? 0) + 1);
      });

      setMonths(
        (rows ?? []).map((m: any) => ({ ...m, articles: counts.get(m.id) ?? 0 }))
      );
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

        <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tighter">
          Every month 🔑
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          All keyword-of-the-month collections, January through December.
        </p>

        {months === null ? (
          <p className="mt-10 text-muted-foreground">Loading...</p>
        ) : months.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No months yet.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {months.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/month/${m.id}`)}
                className={`group relative block w-full rounded-[2rem] p-6 sm:p-7 ${m.bg || "bg-butter"} shadow-soft hover-lift overflow-hidden text-left border-0 cursor-pointer`}
              >
                <div className="absolute top-5 right-5 size-9 rounded-full bg-white/70 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="size-4" />
                </div>
                <div className="text-5xl mb-5 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  {m.emoji || "🗓️"}
                </div>
                <h2 className="text-2xl font-black tracking-tight">{m.label}</h2>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed line-clamp-2">
                  {m.description}
                </p>
                <span className="mt-5 inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs font-bold">
                  📚 {m.articles} articles
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllMonths;
