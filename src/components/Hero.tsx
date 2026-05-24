import worldMap from "@/assets/world-map.jpg";

export const Hero = () => (
  <section id="home" className="relative overflow-hidden">
    {/* decorative blobs */}
    <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-pink-soft blur-3xl opacity-70 animate-blob" />
    <div className="pointer-events-none absolute top-40 -right-32 size-[28rem] rounded-full bg-butter blur-3xl opacity-60 animate-blob" />
    <div className="pointer-events-none absolute bottom-0 left-1/3 size-80 rounded-full bg-mint blur-3xl opacity-50 animate-blob" />

    <div className="container relative pt-16 pb-24 md:pt-24 md:pb-32 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft text-xs font-bold text-pink mb-6">
          🌸 새로운 시즌 오픈
        </span>
        <h1 className="text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-black tracking-tighter">
          세상의 편견을<br />
          <span className="relative inline-block">
            탐험해요
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-pink/40 -z-10 rounded-full" />
          </span>
          <span className="inline-block ml-2 animate-float">🌏</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          나라마다 숨겨진 진짜 이야기, 우리가 몰랐던 오해와 진실.
          <br className="hidden sm:block" />
          가볍게 읽고, 깊게 생각해보세요.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#countries" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-soft hover:scale-105 transition-transform">
            지금 탐험하기 →
          </a>
          <a href="#articles" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white font-bold shadow-soft hover:bg-secondary transition-colors">
            인기 기사 보기
          </a>
        </div>
        <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
          <div><span className="text-2xl font-black text-foreground">120+</span> 기사</div>
          <div className="h-8 w-px bg-border" />
          <div><span className="text-2xl font-black text-foreground">28</span> 나라</div>
          <div className="h-8 w-px bg-border" />
          <div><span className="text-2xl font-black text-foreground">50K</span> 독자</div>
        </div>
      </div>

      <div className="relative animate-fade-up [animation-delay:200ms]">
        <div className="relative aspect-square max-w-lg mx-auto">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-hero shadow-pop" />
          <img src={worldMap} alt="pastel world map" width={1280} height={960} className="absolute inset-0 size-full object-cover rounded-[3rem] mix-blend-multiply" />
          {/* floating stickers */}
          <div className="absolute -top-6 -left-6 px-4 py-2 rounded-2xl bg-white shadow-soft text-sm font-bold animate-float">
            🍣 일본 #스시
          </div>
          <div className="absolute top-10 -right-4 px-4 py-2 rounded-2xl bg-pink text-white shadow-pop text-sm font-bold animate-float [animation-delay:1s]">
            🥖 France
          </div>
          <div className="absolute bottom-8 -left-8 px-4 py-2 rounded-2xl bg-butter shadow-soft text-sm font-bold animate-float [animation-delay:2s]">
            🇧🇷 Brazil
          </div>
          <div className="absolute -bottom-4 right-10 px-4 py-2 rounded-2xl bg-mint shadow-soft text-sm font-bold animate-float [animation-delay:0.5s]">
            ✨ K-Culture
          </div>
        </div>
      </div>
    </div>
  </section>
);
