import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight } from "lucide-react";

export interface Country {
  id: string;
  flag: string;
  name: string;
  subtitle: string;
  description: string;
  articles: number;
  bg: string;
}

export const CountryCard = ({ c }: { c: Country }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
  if (!user) {
    navigate("/auth");
    return;
  }
  navigate(`/country/${encodeURIComponent(c.name)}`);
};

  return (
    <button
      onClick={handleClick}
      className={`group relative block w-full rounded-[2rem] p-6 sm:p-7 ${c.bg} shadow-soft hover-lift overflow-hidden text-left border-0 cursor-pointer`}
    >
      <div className="absolute top-5 right-5 size-9 rounded-full bg-white/70 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="size-4" />
      </div>
      <div className="text-5xl mb-5 transition-transform group-hover:scale-110 group-hover:-rotate-6">{c.flag}</div>
      <h3 className="text-2xl font-black tracking-tight">{c.name}</h3>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mt-1">{c.subtitle}</p>
      <p className="text-sm text-foreground/70 mt-3 leading-relaxed line-clamp-2">{c.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs font-bold">
          📚 {c.articles} articles
        </span>
        <span className="text-xs font-bold text-foreground/70 group-hover:text-pink transition-colors">
          {user ? "Explore →" : "Sign in →"}
        </span>
      </div>
    </button>
  );
};
