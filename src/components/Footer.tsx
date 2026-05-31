export const Footer = () => (
  <footer id="about" className="mt-12">
    <div className="container">
      <div className="rounded-[3rem] bg-gradient-pink p-10 md:p-16 text-center shadow-pop">
        <p className="text-sm font-bold uppercase tracking-widest text-foreground/70">About</p>
        <h3 className="mt-3 text-3xl md:text-5xl font-black tracking-tighter text-balance">
          The world is bigger than the stereotypes 💫
        </h3>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80">
          World Bias is an editorial magazine exploring the hidden truths behind every country —
          told lightly, taken seriously.
        </p>
      </div>

      <div className="py-12 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌏</span>
          <span className="text-xl font-black">World Bias</span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          © 2026 World Bias. Bias, lightly. Honestly.
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
