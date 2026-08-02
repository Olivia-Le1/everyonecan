import { CountryCard, type Country } from "./CountryCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const countries: Country[] = [
  {
    id: "korea",
    flag: "🇰🇷",
    name: "Korea",
    subtitle: "South Korea",
    description: "Beyond K-pop, spicy food, and the 'palli palli' rush — the real Korea.",
    articles: 24,
    bg: "bg-pink-soft"
  },
  {
    id: "usa",
    flag: "🇺🇸",
    name: "USA",
    subtitle: "United States",
    description: "Burgers and freedom? Try 50 completely different worlds.",
    articles: 18,
    bg: "bg-butter"
  },
  {
    id: "japan",
    flag: "🇯🇵",
    name: "Japan",
    subtitle: "Nippon",
    description: "Quiet and polite? Take another look at modern Japan.",
    articles: 21,
    bg: "bg-mint"
  },
  {
    id: "france",
    flag: "🇫🇷",
    name: "France",
    subtitle: "République Française",
    description: "Romantic Paris — and the everyday life you've never seen.",
    articles: 16,
    bg: "bg-lavender"
  },
  {
    id: "brazil",
    flag: "🇧🇷",
    name: "Brazil",
    subtitle: "Brasil",
    description: "It isn't just football and carnival. There's so much more.",
    articles: 12,
    bg: "bg-peach"
  },
  {
    id: "italy",
    flag: "🇮🇹",
    name: "Italy",
    subtitle: "Italia",
    description: "The truth about pasta and pizza, region by region.",
    articles: 14,
    bg: "bg-rose"
  },
  {
    id: "uk",
    flag: "🇬🇧",
    name: "UK",
    subtitle: "Britain",
    description: "British food is bad? The myth, and the heart in every cup of tea.",
    articles: 11,
    bg: "bg-sky"
  },
  {
    id: "india",
    flag: "🇮🇳",
    name: "India",
    subtitle: "Bharat",
    description: "Just curry? 28 states, 22 official languages, infinite stories.",
    articles: 9,
    bg: "bg-sage"
  },
];

export const Countries = () => {
  const { t } = useSiteSettings();
  return (
  <section id="countries" className="container py-20 md:py-28">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-pink">{t("countries_eyebrow", "Explore")}</span>
        <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
          {t("countries_title", "Which country next?")} <span className="inline-block animate-float">🧭</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">{t("countries_subtitle", "Around 15 stories per country. Start anywhere.")}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {countries.map((c) => <CountryCard key={c.name} c={c} />)}
    </div>
  </section>
  );
};
