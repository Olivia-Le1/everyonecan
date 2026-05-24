import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "홈", href: "#home" },
  { label: "퀴즈", href: "#quiz" },
  { label: "소개", href: "#about" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-border/60">
      <nav className="container flex items-center justify-between h-18 py-4">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:rotate-12">🌏</span>
          <span className="text-xl font-black tracking-tight">World Bias</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              {l.label}
            </a>
          ))}
          <a href="#quiz" className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-pink text-white text-sm font-bold shadow-pop hover:scale-105 transition-transform">
            퀴즈 시작하기 <span>✨</span>
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-secondary" aria-label="menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-white animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3 rounded-2xl text-base font-semibold hover:bg-secondary">
                {l.label}
              </a>
            ))}
            <a href="#quiz" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-pink text-white font-bold">
              퀴즈 시작하기 ✨
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
