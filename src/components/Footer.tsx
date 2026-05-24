export const Footer = () => (
  <footer id="about" className="mt-12">
    <div className="container">
      <div className="rounded-[3rem] bg-gradient-pink p-10 md:p-16 text-center shadow-pop">
        <p className="text-sm font-bold uppercase tracking-widest text-foreground/70">Newsletter</p>
        <h3 className="mt-3 text-3xl md:text-5xl font-black tracking-tighter text-balance">
          매주 새로운 편견 이야기를 받아보세요 💌
        </h3>
        <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="이메일 주소"
            className="flex-1 px-5 py-3.5 rounded-full bg-white/90 text-sm font-semibold outline-none focus:ring-2 ring-primary"
          />
          <button className="px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition">
            구독하기
          </button>
        </form>
      </div>

      <div className="py-12 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌏</span>
          <span className="text-xl font-black">World Bias</span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          © 2026 World Bias. 세상의 편견을 가볍게, 진심으로.
        </p>
        <div className="flex gap-4 md:justify-end text-sm font-semibold text-muted-foreground">
          <a href="#" className="hover:text-foreground">Instagram</a>
          <a href="#" className="hover:text-foreground">X</a>
          <a href="#" className="hover:text-foreground">YouTube</a>
        </div>
      </div>
    </div>
  </footer>
);
