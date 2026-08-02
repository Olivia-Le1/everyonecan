import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ArrowUp, ArrowDown, Eye, EyeOff, Upload } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  category_color: string;
  country_flag: string;
  country_name: string;
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
  content: "",
  image_url: "",
  category: "",
  category_color: "bg-pink-soft text-foreground",
  country_flag: "🌏",
  country_name: "",
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
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    // 로그인하지 않거나 관리자가 아니면 홈으로 이동
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [loading, user, isAdmin, navigate]);

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
    setPreviewImage("");
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ ...a, keyword_month: a.keyword_month ?? "" });
    setPreviewImage(a.image_url || "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("PNG, JPG, GIF, WebP만 업로드 가능합니다");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { data, error } = await supabase.storage
        .from("articles")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        toast.error("이미지 업로드 실패: " + error.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("articles")
        .getPublicUrl(filePath);

      setForm({ ...form, image_url: publicUrl });
      setPreviewImage(publicUrl);
      toast.success("이미지 업로드 완료!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("이미지 업로드 중 오류 발생");
    } finally {
      setUploading(false);
    }
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
      toast.success("기사가 업데이트되었습니다");
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("기사가 생성되었습니다");
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("이 기사를 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("삭제되었습니다");
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
    toast.success("저장되었습니다");
  };

  if (loading) return <div className="p-10">로딩 중...</div>;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">관리자 스튜디오</h1>
            <p className="text-muted-foreground mt-1">기사, 순서, 발행 여부 및 페이지 텍스트를 관리합니다.</p>
          </div>
          {tab === "articles" && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink text-white font-bold shadow-pop hover:scale-105 transition"
            >
              <Plus className="size-4" /> 새 기사
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          {([["articles", "기사"], ["text", "페이지 텍스트"]] as const).map(([k, label]) => (
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
                  <th className="p-4 font-bold">순서</th>
                  <th className="p-4 font-bold">제목</th>
                  <th className="p-4 font-bold">국가</th>
                  <th className="p-4 font-bold">상태</th>
                  <th className="p-4 font-bold text-right">작업</th>
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
                      {a.is_keyword && <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-soft text-xs font-bold">키워드</span>}
                    </td>
                    <td className="p-4">{a.country_flag} {a.country_name}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(a)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${a.is_published ? "bg-mint" : "bg-secondary text-muted-foreground"}`}
                      >
                        {a.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        {a.is_published ? "발행됨" : "임시저장"}
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
                    저장
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
              <h2 className="text-2xl font-black">{editing.id ? "기사 수정" : "새 기사"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold mb-1.5">기사 이미지</label>
              <div className="space-y-3">
                {previewImage && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-border">
                    <img
                      src={previewImage}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-sm font-bold cursor-pointer hover:bg-blue-50 transition">
                  <Upload className="size-4" />
                  {uploading ? "업로드 중..." : "이미지 선택 (PNG, JPG)"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {form.image_url && (
                  <p className="text-xs text-muted-foreground">✓ 이미지가 업로드되었습니다</p>
                )}
              </div>
            </div>

            {(
              [
                ["title", "제목", true],
                ["description", "설명", true],
                ["content", "기사 본문", true],
                ["category", "카테고리", true],
                ["country_flag", "국가 이모지", true],
                ["country_name", "국가명", true],
                ["sort_order", "표시 순서 (낮을수록 먼저)", true],
                ["keyword_month", "키워드 월 (예: 2026년 8월)", false],
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
              월간 키워드 기사
            </label>
            <label className="flex items-center gap-2 mt-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              발행
            </label>

            <button type="submit" disabled={uploading} className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-50">
              저장
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
