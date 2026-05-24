import { CountryCard, type Country } from "./CountryCard";

const countries: Country[] = [
  { flag: "🇰🇷", name: "한국", subtitle: "Korea", description: "K-팝, 매운맛, 그리고 빨리빨리 문화 너머의 진짜 한국.", articles: 24, bg: "bg-pink-soft" },
  { flag: "🇺🇸", name: "미국", subtitle: "USA", description: "햄버거와 자유의 나라? 그 너머의 50개 다른 세계.", articles: 18, bg: "bg-butter" },
  { flag: "🇯🇵", name: "일본", subtitle: "Japan", description: "조용하고 정중한 나라라는 오해, 다시 들여다보기.", articles: 21, bg: "bg-mint" },
  { flag: "🇫🇷", name: "프랑스", subtitle: "France", description: "낭만의 도시 파리, 그리고 우리가 모르는 일상.", articles: 16, bg: "bg-lavender" },
  { flag: "🇧🇷", name: "브라질", subtitle: "Brazil", description: "축구와 카니발만 있는 게 아니에요. 더 다채로운 풍경.", articles: 12, bg: "bg-peach" },
  { flag: "🇮🇹", name: "이탈리아", subtitle: "Italy", description: "파스타와 피자의 진실, 지역마다 다른 식문화.", articles: 14, bg: "bg-rose" },
  { flag: "🇬🇧", name: "영국", subtitle: "UK", description: "맛없다는 영국 음식의 오해, 그리고 차 한 잔의 진심.", articles: 11, bg: "bg-sky" },
  { flag: "🇮🇳", name: "인도", subtitle: "India", description: "카레의 나라? 28개 주, 22개 공용어의 다채로움.", articles: 9, bg: "bg-sage" },
];

export const Countries = () => (
  <section id="countries" className="container py-20 md:py-28">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-pink">Explore</span>
        <h2 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-balance">
          어떤 나라를 탐험할까? <span className="inline-block animate-float">🧭</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">한 나라당 평균 15개의 이야기. 가볍게 시작해보세요.</p>
      </div>
      <a href="#" className="self-start md:self-auto px-5 py-2.5 rounded-full bg-white shadow-soft font-bold text-sm hover:bg-secondary transition">
        모든 나라 보기 →
      </a>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {countries.map((c) => <CountryCard key={c.name} c={c} />)}
    </div>
  </section>
);
