import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

const MONTH_NUMBERS: Record<string, number> = {
  january: 1, jan: 1, "1월": 1,
  february: 2, feb: 2, "2월": 2,
  march: 3, mar: 3, "3월": 3,
  april: 4, apr: 4, "4월": 4,
  may: 5, "5월": 5,
  june: 6, jun: 6, "6월": 6,
  july: 7, jul: 7, "7월": 7,
  august: 8, aug: 8, "8월": 8,
  september: 9, sep: 9, sept: 9, "9월": 9,
  october: 10, oct: 10, "10월": 10,
  november: 11, nov: 11, "11월": 11,
  december: 12, dec: 12, "12월": 12,
};

const monthNumber = (label: string) => {
  const key = label.trim().toLowerCase();
  if (MONTH_NUMBERS[key]) return MONTH_NUMBERS[key];
  const digits = key.match(/\d{1,2}/);
  return digits ? Number(digits[0]) : 0;
};

// 현재 계절에 해당하는 달들만 노출
const SEASONS: number[][] = [
  [12, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
];

const currentSeasonMonths = () => {
  const m = new Date().getMonth() + 1;
  return SEASONS.find((s) => s.includes(m)) ?? [];
};


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
