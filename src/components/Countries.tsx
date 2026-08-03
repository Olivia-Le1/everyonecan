import { useEffect, useState } from "react";
import { CountryCard, type Country } from "./CountryCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

const backgrounds = [
  "bg-pink-soft",
  "bg-butter",
  "bg-mint",
  "bg-lavender",
  "bg-peach",
  "bg-rose",
  "bg-sky",
  "bg-sage",
];

export const Countries = () => {
  const { t } = useSiteSettings();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("country_flag, country_name")
        .eq("is_published", true);

      if (error) {
        console.error(error);
        return;
      }

      const unique = Array.from(
        new Map(
          (data ?? []).map((item: any) => [
            item.country_name,
            item,
          ])
        ).values()
      );

      const mapped = unique.map((c: any, index) => ({
        id: c.country_name.toLowerCase(),
        flag: c.country_flag,
        name: c.country_name,
        subtitle: c.country_name,
        bg: backgrounds[index % backgrounds.length],
        description: t(
          `country_${c.country_name.toLowerCase()}_description`,
          ""
        ),
        articles: data?.filter(
          (a: any) => a.country_name === c.country_name
        ).length ?? 0,
      }));

      setCountries(mapped);
    };

    loadCountries();
  }, [t]);

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
            {t(
              "countries_subtitle",
              "Explore stories from around the world."
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {countries.map((c) => (
          <CountryCard key={c.name} c={c} />
        ))}
      </div>
    </section>
  );
};
