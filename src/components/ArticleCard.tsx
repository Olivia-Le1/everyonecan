import { Eye } from "lucide-react";

export interface Article {
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  date: string;
  views: string;
}

export const ArticleCard = ({ a }: { a: Article }) => (
  <article className="group cursor-pointer hover-lift bg-white rounded-[2rem] overflow-hidden shadow-soft">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={a.image}
        alt={a.title}
        loading="lazy"
        width={1024}
        height={768}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full ${a.categoryColor} text-xs font-bold shadow-soft`}>
        {a.category}
      </span>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-black tracking-tight leading-snug line-clamp-2 group-hover:text-pink transition-colors">
        {a.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{a.description}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground font-semibold">
        <span>{a.date}</span>
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3.5" /> {a.views}
        </span>
      </div>
    </div>
  </article>
);
