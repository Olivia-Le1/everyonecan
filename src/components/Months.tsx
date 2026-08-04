import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export interface MonthBox {
  id: string;
  label: string;
  emoji: string;
  description: string;
  bg: string;
  articles: number;
}

export const Months = () => {
  const { t } = useSiteSettings();
  const navigate = useNavigate();
  const [months, setMonths] = useState<MonthBox[]>([]);

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
        (rows ?? []).map((m: any) => ({
          id: m.id,
          label: m.label,
          emoji: m.emoji || "🗓️",
          description: m.description ?? "",
          bg: m.bg || "bg-butter",
          articles: counts.get(m.id) ?? 0,
        }))
      );
    };

    void load();
  }, []);

  if (months.length === 0) return null;

  return (
    <section id="months" className="container py-20 md:py-28">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-pink">
          {t("months_eyebrow", "Monthly")}
        </span>
        <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
          {t("months_title", "Keyword of the month")}{" "}
          <span className="inline-block animate-float">🔑</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          {t("months_subtitle", "One idea we keep coming back to, month by month.")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {months.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(`/month/${m.id}`)}
            className={`group relative block w-full rounded-[2rem] p-6 sm:p-7 ${m.bg} shadow-soft hover-lift overflow-hidden text-left border-0 cursor-pointer`}
          >
            <div className="absolute top-5 right-5 size-9 rounded-full bg-white/70 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="size-4" />
            </div>

            <div className="text-5xl mb-5 transition-transform group-hover:scale-110 group-hover:-rotate-6">
              {m.emoji}
            </div>

            <h3 className="text-2xl font-black tracking-tight">{m.label}</h3>

            <p className="text-sm text-foreground/70 mt-3 leading-relaxed line-clamp-2">
              {m.description}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs font-bold">
                📚 {m.articles} articles
              </span>
              <span className="text-xs font-bold text-foreground/70 group-hover:text-pink transition-colors">
                Explore →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
