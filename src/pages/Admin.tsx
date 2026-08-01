import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  category_color: string;
  country_flag: string;
  country_name: string;
  views: string;
  sort_order: number;
  is_published: boolean;
  is_keyword: boolean;
  keyword_month: string | null;
}

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
}

const empty = {
  title: "",
  description: "",
  image_url: "",
  category: "",
  category_color: "bg-pink-soft text-foreground",
  country_flag: "🌏",
  country_name: "",
  views: "0",
  sort_order: 0,
  is_published: true,
  is_keyword: false,
  keyword_month: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"articles" | "text">("articles");
  const [items, setItems] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const load = async () => {
    const [{ data: arts }, { data: sets }] = await Promise.all([
      supabase.from("articles").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").order("key"),
    ]);
    setItems((arts as Article[]) ?? []);
    setSettings((sets as Setting[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const openNew = () => {
    setEditing({ id: "" } as Article);
    setForm({ ...empty, sort_order: items.length + 1 });
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ ...a, keyword_month: a.keyword_month ?? "" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      keyword_month: form.keyword_month || null,
    };
    if (editing.id) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Article updated");
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Article created");
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const togglePublish = async (a: Article) => {
    const { error } = await supabase.from("articles").update({ is_published: !a.is_published }).eq("id", a.id);
    if (error) return toast.error(error.message);
    load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    const results = await Promise.all([
      supabase.from("articles").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("articles").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    const err = results.find((r) => r.error)?.error;
    if (err) return toast.error(err.message);
    load();
  };

  const saveSetting = async (s: Setting, value: string) => {
    const { error } = await supabase.from("site_settings").update({ value }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-black tracking-tighter">Admin only</h1>
          <p className="mt-3 text-muted-foreground">
            Your account ({user.email}) doesn't have admin access.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Your user ID: <code>{user.id}</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Admin studio</h1>
            <p className="text-muted-foreground mt-1">Manage articles, order, publishing, and page copy.</p>
          </div>
          {tab === "articles" && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink text-white font-bold shadow-pop hover:scale-105 transition"
            >
              <Plus className="size-4" /> New article
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          {([["articles", "Articles"], ["text", "Page text"]] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${tab === k ? "bg-primary text-primary-foreground" : "bg-white shadow-soft hover:bg-secondary"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "articles" ? (
          <div className="bg-white rounded-[2rem] shadow-soft overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-secondary">
                <tr className="text-left">
                  <th className="p-4 font-bold">Order</th>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Country</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a, i) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-full hover:bg-secondary disabled:opacity-30">
                          <ArrowUp className="size-4" />
                        </button>
                        <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 rounded-full hover:bg-secondary disabled:opacity-30">
                          <ArrowDown className="size-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      {a.title}
                      {a.is_keyword && <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-soft text-xs font-bold">Keyword</span>}
                    </td>
                    <td className="p-4">{a.country_flag} {a.country_name}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(a)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${a.is_published ? "bg-mint" : "bg-secondary text-muted-foreground"}`}
                      >
                        {a.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        {a.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(a)} className="p-2 rounded-full hover:bg-secondary">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => remove(a.id)} className="p-2 rounded-full hover:bg-rose">
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-soft p-6 md:p-8 space-y-5 max-w-2xl">
            {settings.map((s) => (
              <div key={s.id}>
                <label className="block text-xs font-bold mb-1.5">{s.label || s.key}</label>
                <div className="flex gap-2">
                  <input
                    defaultValue={s.value}
                    onChange={(e) => (s.value = e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-sm font-semibold outline-none focus:ring-2 ring-primary"
                  />
                  <button
                    onClick={() => saveSetting(s, s.value)}
                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={save}
            className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-pop"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editing.id ? "Edit article" : "New article"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>
            {(
              [
                ["title", "Title", true],
                ["description", "Description", true],
                ["image_url", "Image URL", true],
                ["category", "Category label", true],
                ["country_flag", "Country flag emoji", true],
                ["country_name", "Country name", true],
                ["views", "Views", true],
                ["sort_order", "Display order (lower = first)", true],
                ["keyword_month", "Keyword month (e.g. August 2026)", false],
              ] as const
            ).map(([key, label, required]) => (
              <div key={key} className="mb-3">
                <label className="block text-xs font-bold mb-1.5">{label}</label>
                <input
                  required={required}
                  value={(form as any)[key] ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary text-sm font-semibold outline-none focus:ring-2 ring-primary"
                />
              </div>
            ))}

            <label className="flex items-center gap-2 mt-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.is_keyword}
                onChange={(e) => setForm({ ...form, is_keyword: e.target.checked })}
              />
              Keyword of the month article
            </label>
            <label className="flex items-center gap-2 mt-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              Published
            </label>

            <button type="submit" className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
