import { CountryCard, type Country } from "./CountryCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const countryDefaults = [
  { id: "korea", flag: "🇰🇷", name: "Korea", subtitle: "South Korea", bg: "bg-pink-soft" },
  { id: "usa", flag: "🇺🇸", name: "USA", subtitle: "United States", bg: "bg-butter" },
  { id: "japan", flag: "🇯🇵", name: "Japan", subtitle: "Nippon", bg: "bg-mint" },
  { id: "france", flag: "🇫🇷", name: "France", subtitle: "République Française", bg: "bg-lavender" },
  { id: "brazil", flag: "🇧🇷", name: "Brazil", subtitle: "Brasil", bg: "bg-peach" },
  { id: "italy", flag: "🇮🇹", name: "Italy", subtitle: "Italia", bg: "bg-rose" },
  { id: "uk", flag: "🇬🇧", name: "UK", subtitle: "Britain", bg: "bg-sky" },
  { id: "india", flag: "🇮🇳", name: "India", subtitle: "Bharat", bg: "bg-sage" },
];

export const Countries = () => {
  const { t } = useSiteSettings();

  const countries: Country[] = countryDefaults.map((c) => ({
    ...c,
    description: t(`country_${c.id}_description`, ""),
    articles: Number(t(`country_${c.id}_articles`, "0")),
  }));

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
            {t("countries_subtitle", "Around 15 stories per country. Start anywhere.")}
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
