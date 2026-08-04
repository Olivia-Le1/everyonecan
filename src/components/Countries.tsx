import { useEffect, useState } from "react";
import { CountryCard, type Country } from "./CountryCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

export const Countries = () => {
  const { t } = useSiteSettings();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ data: rows }, { data: arts }] = await Promise.all([
        supabase
          .from("countries")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabase.from("articles").select("country_name").eq("is_published", true),
      ]);

      const counts = new Map<string, number>();
      (arts ?? []).forEach((a: any) => {
        counts.set(a.country_name, (counts.get(a.country_name) ?? 0) + 1);
      });

      setCountries(
        (rows ?? []).map((c: any) => ({
          id: c.id,
          flag: c.flag,
          name: c.name,
          subtitle: c.subtitle || c.name,
          bg: c.bg || "bg-pink-soft",
          description: c.description ?? "",
          articles: counts.get(c.name) ?? 0,
        }))
      );
    };

    void load();
  }, []);

  if (countries.length === 0) return null;

  return (
    <section id="countries" className="container py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-pink">
            {t("countries_eyebrow", "Explore")}
          </span>

          <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
            {t("countries_title", "Which country next?")} 🧭
          </h2>

          <p className="mt-3 text-muted-foreground max-w-xl">
            {t("countries_subtitle", "Explore stories from around the world.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {countries.map((c) => (
          <CountryCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
};
