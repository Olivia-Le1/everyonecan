import { ArticleCard, type Article } from "./ArticleCard";
import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";
import a4 from "@/assets/article-4.jpg";
import a5 from "@/assets/article-5.jpg";
import a6 from "@/assets/article-6.jpg";

const articles: Article[] = [
  { image: a1, category: "🇰🇷 한국", categoryColor: "bg-pink-soft text-foreground", title: "한국인은 정말 매일 김치를 먹을까?", description: "외국인이 가장 궁금해하는 한국 식문화의 진짜 모습.", date: "2026. 05. 20", views: "12.4K" },
  { image: a2, category: "🇺🇸 미국", categoryColor: "bg-butter text-foreground", title: "뉴욕은 미국의 전부가 아니에요", description: "50개 주, 50가지 라이프스타일. 다양성의 진짜 의미.", date: "2026. 05. 18", views: "9.8K" },
  { image: a3, category: "🇯🇵 일본", categoryColor: "bg-mint text-foreground", title: "조용한 일본인? 시부야는 다릅니다", description: "정중함의 이면, MZ세대 도쿄의 새로운 표정들.", date: "2026. 05. 16", views: "15.2K" },
  { image: a4, category: "🇫🇷 프랑스", categoryColor: "bg-lavender text-foreground", title: "파리지앵은 정말 시크할까?", description: "현지인이 말하는 진짜 파리, 그리고 일상의 로맨스.", date: "2026. 05. 14", views: "8.1K" },
  { image: a5, category: "🇧🇷 브라질", categoryColor: "bg-peach text-foreground", title: "축구만이 전부는 아닌 브라질", description: "리우 너머의 다양한 풍경, 아마존의 또 다른 이야기.", date: "2026. 05. 12", views: "6.5K" },
  { image: a6, category: "🇮🇹 이탈리아", categoryColor: "bg-rose text-foreground", title: "지역마다 다른 이탈리아 파스타의 비밀", description: "북부와 남부, 그리고 20개 주의 완전히 다른 식탁.", date: "2026. 05. 10", views: "11.0K" },
];

export const Articles = () => (
  <section id="articles" className="container py-20 md:py-28">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-pink">Trending Now</span>
        <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
          오늘의 인기 기사 <span className="inline-block animate-float">🔥</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">이번 주 가장 많이 읽힌 편견 탐험 기사들.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["전체", "문화", "음식", "라이프"].map((t, i) => (
          <button key={t} className={`px-4 py-2 rounded-full text-sm font-bold transition ${i === 0 ? "bg-primary text-primary-foreground" : "bg-white shadow-soft hover:bg-secondary"}`}>
            {t}
          </button>
        ))}
      </div>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((a) => <ArticleCard key={a.title} a={a} />)}
    </div>
  </section>
);
