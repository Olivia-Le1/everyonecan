import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Home", to: "/" },
  { label: "Quiz", to: "/quiz" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });

      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);

      return;
    }

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHomeClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 500);

      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-[999] bg-white/85 backdrop-blur-xl border-b border-border/60">
      <nav className="container flex items-center justify-between h-18 py-4">

        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl transition-transform group-hover:rotate-12">
            🌏
          </span>
          <span className="text-xl font-black tracking-tight">
            World Bias
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">

          {links.map((l) =>
            l.label === "Home" ? (
              <button
                key={l.label}
                onClick={handleHomeClick}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              >
                Home
              </button>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              >
                {l.label}
              </Link>
            )
          )}

          <button
            onClick={() => scrollToSection("articles")}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            Articles
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            About
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-semibold text-pink hover:bg-pink-soft rounded-full"
            >
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-sm font-bold"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-pink text-white text-sm font-bold"
            >
              Sign in ✨
            </Link>
          )}

        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-full hover:bg-secondary"
          aria-label="menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

      </nav>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-white">
          <div className="container py-4 flex flex-col gap-1">

            <button
              onClick={() => {
                setOpen(false);
                handleHomeClick();
              }}
              className="px-4 py-3 rounded-2xl text-left font-semibold hover:bg-secondary"
            >
              Home
            </button>

            <button
              onClick={() => {
                setOpen(false);
                scrollToSection("articles");
              }}
              className="px-4 py-3 rounded-2xl text-left font-semibold hover:bg-secondary"
            >
              Articles
            </button>

            <Link
              to="/quiz"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-2xl font-semibold hover:bg-secondary"
            >
              Quiz
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                scrollToSection("about");
              }}
              className="px-4 py-3 rounded-2xl text-left font-semibold hover:bg-secondary"
            >
              About
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl font-semibold text-pink"
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="mt-2 px-5 py-3 rounded-full bg-secondary font-bold"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 rounded-full bg-pink text-white font-bold text-center"
              >
                Sign in ✨
              </Link>
            )}

          </div>
        </div>
      )}

    </header>
  );
};
