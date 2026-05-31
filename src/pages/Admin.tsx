import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

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
}

const empty: Omit<Article, "id"> = {
  title: "",
  description: "",
  image_url: "",
  category: "",
  category_color: "bg-pink-soft text-foreground",
  country_flag: "🌏",
  country_name: "",
  views: "0",
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const load = async () => {
    const { data } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
    setItems((data as Article[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const openNew = () => {
    setEditing({ id: "", ...empty });
    setForm(empty);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm(a);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      const { error } = await supabase.from("articles").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Article updated");
    } else {
      const { error } = await supabase.from("articles").insert(form);
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

  if (loading) return <div className="p-10">Loading...</div>;

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-black tracking-tighter">Admin only</h1>
          <p className="mt-3 text-muted-foreground">
            Your account ({user.email}) doesn't have admin access. Ask the site owner to grant you the{" "}
            <span className="font-mono font-bold">admin</span> role.
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Manage articles</h1>
            <p className="text-muted-foreground mt-1">Create, edit, or remove articles.</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink text-white font-bold shadow-pop hover:scale-105 transition"
          >
            <Plus className="size-4" /> New article
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Country</th>
                <th className="p-4 font-bold">Views</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{a.title}</td>
                  <td className="p-4">{a.country_flag} {a.country_name}</td>
                  <td className="p-4 text-muted-foreground">{a.views}</td>
                  <td className="p-4 text-right">
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
                ["title", "Title"],
                ["description", "Description"],
                ["image_url", "Image URL"],
                ["category", "Category label"],
                ["country_flag", "Country flag emoji"],
                ["country_name", "Country name"],
                ["views", "Views"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="mb-3">
                <label className="block text-xs font-bold mb-1.5">{label}</label>
                <input
                  required
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary text-sm font-semibold outline-none focus:ring-2 ring-primary"
                />
              </div>
            ))}
            <button type="submit" className="mt-4 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
