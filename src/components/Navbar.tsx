import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Home", to: "/" },
  { label: "Quiz", to: "/quiz" },
  { label: "About", to: "/#about" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleArticlesClick = () => {
  if (window.location.pathname !== "/") {
    navigate("/");
    setTimeout(() => {
      document
        .getElementById("articles")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
    return;
  }

  document
    .getElementById("articles")
    ?.scrollIntoView({ behavior: "smooth" });
};

  const handleAboutClick = () => {
    if (window.location.pathname === "/") {
      document
        .getElementById("about")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#about");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-[999] bg-white/85 backdrop-blur-xl border-b border-border/60 pointer-events-auto">
      <nav className="container relative z-[1000] flex items-center justify-between h-18 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:rotate-12">
            🌏
          </span>
          <span className="text-xl font-black tracking-tight">
            World Bias
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={handleArticlesClick}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            Articles
          </button>

          {links.map((l) =>
            l.label === "About" ? (
              <button
                key={l.label}
                onClick={handleAboutClick}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              >
                {l.label}
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

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-semibold text-pink hover:bg-pink-soft rounded-full cursor-pointer"
            >
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-sm font-bold hover:bg-pink-soft transition"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-pink text-white text-sm font-bold shadow-pop hover:scale-105 transition-transform"
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
        <div className="md:hidden border-t border-border/60 bg-white animate-fade-in relative z-[1000]">
          <div className="container py-4 flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                handleArticlesClick();
              }}
              className="px-4 py-3 rounded-2xl text-base font-semibold text-left hover:bg-secondary"
            >
              Articles
            </button>

            {links.map((l) =>
              l.label === "About" ? (
                <button
                  key={l.label}
                  onClick={() => {
                    setOpen(false);
                    handleAboutClick();
                  }}
                  className="px-4 py-3 rounded-2xl text-base font-semibold text-left hover:bg-secondary"
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl text-base font-semibold hover:bg-secondary"
                >
                  {l.label}
                </Link>
              )
            )}

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
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-secondary font-bold"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-pink text-white font-bold"
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
