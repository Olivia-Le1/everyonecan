import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, ArrowUp, ArrowDown, Eye, EyeOff, Upload } from "lucide-react";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

const bgOptions = [
  "bg-pink-soft",
  "bg-butter",
  "bg-mint",
  "bg-lavender",
  "bg-peach",
  "bg-rose",
  "bg-sky",
  "bg-sage",
];

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
  month_id: string | null;
}

interface Country {
  id: string;
  flag: string;
  name: string;
  subtitle: string;
  description: string;
  bg: string;
  sort_order: number;
  is_visible: boolean;
}

interface MonthRow {
  id: string;
  label: string;
  emoji: string;
  description: string;
  bg: string;
  sort_order: number;
  is_visible: boolean;
}

interface QuizRow {
  id: string;
  flag: string;
  country: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_index: number;
  explanation: string;
  sort_order: number;
  is_visible: boolean;
}

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
}

const emptyArticle = {
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
  month_id: "",
};

const emptyCountry = {
  flag: "🌏",
  name: "",
  subtitle: "",
  description: "",
  bg: "bg-pink-soft",
  sort_order: 0,
  is_visible: true,
};

const emptyMonth = {
  label: "",
  emoji: "🗓️",
  description: "",
  bg: "bg-butter",
  sort_order: 0,
  is_visible: true,
};

const emptyQuiz = {
  flag: "🌏",
  country: "",
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_index: 0,
  explanation: "",
  sort_order: 0,
  is_visible: true,
};

const label = "block text-xs font-bold mb-1.5";
const field =
  "w-full px-4 py-2.5 rounded-xl bg-secondary text-sm font-semibold outline-none focus:ring-2 ring-primary";

type Tab = "articles" | "countries" | "months" | "quiz" | "text";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("articles");

  const [items, setItems] = useState<Article[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [months, setMonths] = useState<MonthRow[]>([]);
  const [quiz, setQuiz] = useState<QuizRow[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);

  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyArticle);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countryForm, setCountryForm] = useState(emptyCountry);

  const [editingMonth, setEditingMonth] = useState<MonthRow | null>(null);
  const [monthForm, setMonthForm] = useState(emptyMonth);

  const [editingQuiz, setEditingQuiz] = useState<QuizRow | null>(null);
  const [quizForm, setQuizForm] = useState(emptyQuiz);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) navigate("/");
  }, [loading, user, isAdmin, navigate]);

  const load = async () => {
    const [{ data: arts }, { data: sets }, { data: ctr }, { data: mth }, { data: qz }] = await Promise.all([
      supabase.from("articles").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").order("key"),
      supabase.from("countries").select("*").order("sort_order", { ascending: true }),
      supabase.from("months").select("*").order("sort_order", { ascending: true }),
      supabase.from("quiz_questions").select("*").order("sort_order", { ascending: true }),
    ]);
    setItems((arts as Article[]) ?? []);
    setSettings((sets as Setting[]) ?? []);
    setCountries((ctr as Country[]) ?? []);
    setMonths((mth as MonthRow[]) ?? []);
    setQuiz((qz as QuizRow[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  /* ---------------- articles ---------------- */

  const openNew = () => {
    setEditing({ id: "" } as Article);
    setForm({ ...emptyArticle, sort_order: items.length + 1 });
    setPreviewImage("");
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ ...a, month_id: a.month_id ?? "" });
    setPreviewImage(a.image_url || "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB 이하여야 합니다");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

      const { error } = await supabase.storage.from("articles").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) {
        toast.error("이미지 업로드 실패: " + error.message);
        return;
      }

      const { data: signed, error: signErr } = await supabase.storage
        .from("articles")
        .createSignedUrl(path, TEN_YEARS);
      if (signErr || !signed?.signedUrl) {
        toast.error("이미지 URL 생성 실패");
        return;
      }

      setForm((f) => ({ ...f, image_url: signed.signedUrl }));
      setPreviewImage(signed.signedUrl);
      toast.success("이미지 업로드 완료!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...form,
      category: form.category ?? "",
      sort_order: Number(form.sort_order) || 0,
      month_id: form.month_id || null,
      is_keyword: !!form.month_id,
    };
    const res = editing.id
      ? await supabase.from("articles").update(payload).eq("id", editing.id)
      : await supabase.from("articles").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("저장되었습니다");
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

  /* ---------------- countries ---------------- */

  const saveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountry) return;
    const { id: _cid, ...rest } = countryForm as any;
    const payload = { ...rest, sort_order: Number(countryForm.sort_order) || 0 };
    const res = editingCountry.id
      ? await supabase.from("countries").update(payload).eq("id", editingCountry.id)
      : await supabase.from("countries").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("저장되었습니다");
    setEditingCountry(null);
    load();
  };

  const removeCountry = async (id: string) => {
    if (!confirm("이 나라 박스를 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  /* ---------------- months ---------------- */

  const saveMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMonth) return;
    const { id: _mid, ...mrest } = monthForm as any;
    const payload = { ...mrest, sort_order: Number(monthForm.sort_order) || 0 };
    const res = editingMonth.id
      ? await supabase.from("months").update(payload).eq("id", editingMonth.id)
      : await supabase.from("months").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("저장되었습니다");
    setEditingMonth(null);
    load();
  };

  const removeMonth = async (id: string) => {
    if (!confirm("이 월 박스를 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("months").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const MONTH_PRESET = [
    ["January", "❄️"],
    ["February", "💌"],
    ["March", "🌸"],
    ["April", "🌷"],
    ["May", "🌿"],
    ["June", "☀️"],
    ["July", "🍉"],
    ["August", "🏖️"],
    ["September", "🍂"],
    ["October", "🎃"],
    ["November", "🍁"],
    ["December", "🎄"],
  ] as const;

  const addAllMonths = async () => {
    const existing = new Set(months.map((m) => m.label.trim().toLowerCase()));
    const rows = MONTH_PRESET.filter(([label]) => !existing.has(label.toLowerCase())).map(([label, emoji], i) => ({
      label,
      emoji,
      description: "",
      bg: "bg-butter",
      sort_order: MONTH_PRESET.findIndex(([l]) => l === label) + 1,
      is_visible: true,
    }));
    if (rows.length === 0) return toast.info("이미 1월~12월 박스가 모두 있습니다");
    const { error } = await supabase.from("months").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`${rows.length}개의 월 박스를 추가했습니다`);
    load();
  };

  /* ---------------- quiz ---------------- */

  const saveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;
    const { id: _qid, ...qrest } = quizForm as any;
    const payload = {
      ...qrest,
      sort_order: Number(quizForm.sort_order) || 0,
      correct_index: Number(quizForm.correct_index) || 0,
    };
    const res = editingQuiz.id
      ? await supabase.from("quiz_questions").update(payload).eq("id", editingQuiz.id)
      : await supabase.from("quiz_questions").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("저장되었습니다");
    setEditingQuiz(null);
    load();
  };

  const removeQuiz = async (id: string) => {
    if (!confirm("이 퀴즈 문항을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const saveSetting = async (s: Setting, value: string) => {
    const { error } = await supabase.from("site_settings").update({ value }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("저장되었습니다");
  };

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">관리자 권한 확인 중...</div>;
  }

  const newButton = () => {
    if (tab === "articles") return { label: "새 기사", onClick: openNew };
    if (tab === "countries")
      return {
        label: "새 나라 박스",
        onClick: () => {
          setEditingCountry({ id: "" } as Country);
          setCountryForm({ ...emptyCountry, sort_order: countries.length + 1 });
        },
      };
    if (tab === "months")
      return {
        label: "새 월 박스",
        onClick: () => {
          setEditingMonth({ id: "" } as MonthRow);
          setMonthForm({ ...emptyMonth, sort_order: months.length + 1 });
        },
      };
    if (tab === "quiz")
      return {
        label: "새 퀴즈 문항",
        onClick: () => {
          setEditingQuiz({ id: "" } as QuizRow);
          setQuizForm({ ...emptyQuiz, sort_order: quiz.length + 1 });
        },
      };
    return null;
  };

  const nb = newButton();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">관리자 스튜디오</h1>
            <p className="text-muted-foreground mt-1">
              기사, 나라 박스, 월별 박스, 퀴즈, 페이지 텍스트를 관리합니다.
            </p>
          </div>
          {nb && (
            <button
              onClick={nb.onClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink text-white font-bold shadow-pop hover:scale-105 transition"
            >
              <Plus className="size-4" /> {nb.label}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(
            [
              ["articles", "기사"],
              ["countries", "나라 박스"],
              ["months", "월별 박스"],
              ["quiz", "퀴즈"],
              ["text", "페이지 텍스트"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                tab === k ? "bg-primary text-primary-foreground" : "bg-white shadow-soft hover:bg-secondary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "articles" && (
          <div className="bg-white rounded-[2rem] shadow-soft overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-secondary">
                <tr className="text-left">
                  <th className="p-4 font-bold">순서</th>
                  <th className="p-4 font-bold">제목</th>
                  <th className="p-4 font-bold">국가</th>
                  <th className="p-4 font-bold">월</th>
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
                    <td className="p-4 font-semibold">{a.title}</td>
                    <td className="p-4">
                      {a.country_flag} {a.country_name}
                    </td>
                    <td className="p-4">{months.find((m) => m.id === a.month_id)?.label ?? "-"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(a)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          a.is_published ? "bg-mint" : "bg-secondary text-muted-foreground"
                        }`}
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
        )}

        {tab === "countries" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {countries.map((c) => (
              <div key={c.id} className={`rounded-[2rem] p-6 ${c.bg} shadow-soft`}>
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{c.flag}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingCountry(c);
                        setCountryForm({ ...c });
                      }}
                      className="p-2 rounded-full bg-white/70 hover:bg-white"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => removeCountry(c.id)} className="p-2 rounded-full bg-white/70 hover:bg-white">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-black">{c.name}</h3>
                <p className="text-sm text-foreground/70 mt-2 line-clamp-3">{c.description}</p>
                <p className="mt-3 text-xs font-bold text-foreground/50">
                  {c.is_visible ? "표시됨" : "숨김"} · 순서 {c.sort_order}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "months" && (
          <>
          <div className="mb-5">
            <button
              onClick={addAllMonths}
              className="px-4 py-2.5 rounded-full bg-secondary text-sm font-bold hover:bg-pink-soft transition"
            >
              1월~12월 박스 자동 생성
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {months.map((m) => (
              <div key={m.id} className={`rounded-[2rem] p-6 ${m.bg} shadow-soft`}>
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{m.emoji}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingMonth(m);
                        setMonthForm({ ...m });
                      }}
                      className="p-2 rounded-full bg-white/70 hover:bg-white"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => removeMonth(m.id)} className="p-2 rounded-full bg-white/70 hover:bg-white">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-black">{m.label}</h3>
                <p className="text-sm text-foreground/70 mt-2 line-clamp-3">{m.description}</p>
                <p className="mt-3 text-xs font-bold text-foreground/50">
                  {m.is_visible ? "표시됨" : "숨김"} · 기사 {items.filter((a) => a.month_id === m.id).length}개
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "quiz" && (
          <div className="space-y-4">
            {quiz.map((q) => (
              <div key={q.id} className="bg-white rounded-[1.5rem] shadow-soft p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">
                      {q.flag} {q.country} · 순서 {q.sort_order} · {q.is_visible ? "표시됨" : "숨김"}
                    </p>
                    <h3 className="mt-2 font-black text-lg">{q.question}</h3>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      {[q.option_a, q.option_b, q.option_c, q.option_d].map((o, i) => (
                        <li key={i} className={i === q.correct_index ? "font-bold text-foreground" : ""}>
                          {i + 1}. {o} {i === q.correct_index && "✓"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingQuiz(q);
                        setQuizForm({ ...q });
                      }}
                      className="p-2 rounded-full hover:bg-secondary"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => removeQuiz(q.id)} className="p-2 rounded-full hover:bg-rose">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "text" && (
          <div className="bg-white rounded-[2rem] shadow-soft p-6 md:p-8 space-y-5 max-w-2xl">
            {settings.map((s) => (
              <div key={s.id}>
                <label className={label}>{s.label || s.key}</label>
                <div className="flex gap-2">
                  <input
                    defaultValue={s.value}
                    onChange={(e) => (s.value = e.target.value)}
                    className={field + " flex-1"}
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

      {/* ARTICLE MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={save}
            className="bg-white rounded-[2rem] p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-pop"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editing.id ? "기사 수정" : "새 기사"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-5">
              <label className={label}>기사 이미지 (파일 업로드)</label>
              {previewImage && (
                <div className="mb-3 w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-border">
                  <img src={previewImage} alt="미리보기" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-sm font-bold cursor-pointer hover:bg-pink-soft transition">
                <Upload className="size-4" />
                {uploading ? "업로드 중..." : "이미지 파일 선택 (PNG, JPG, WebP)"}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            <div className="mb-4">
              <label className={label}>제목</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
            </div>

            <div className="mb-4">
              <label className={label}>요약 (Summary — 카드와 기사 상단에 표시)</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={field + " min-h-[120px] leading-relaxed font-normal"}
              />
            </div>

            <div className="mb-4">
              <label className={label}>본문 (Content — 로그인한 독자에게 표시)</label>
              <textarea
                rows={30}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={field + " min-h-[600px] leading-relaxed font-normal"}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={label}>국가 이모지</label>
                <input value={form.country_flag} onChange={(e) => setForm({ ...form, country_flag: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>국가명</label>
                <input
                  required
                  list="country-names"
                  value={form.country_name}
                  onChange={(e) => setForm({ ...form, country_name: e.target.value })}
                  className={field}
                />
                <datalist id="country-names">
                  {countries.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={label}>표시 순서 (낮을수록 먼저)</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>월별 박스 (선택 안 하면 없음)</label>
                <select value={form.month_id} onChange={(e) => setForm({ ...form, month_id: e.target.value })} className={field}>
                  <option value="">— 없음 —</option>
                  {months.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 text-sm font-bold">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              발행
            </label>

            <button type="submit" disabled={uploading} className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-50">
              저장
            </button>
          </form>
        </div>
      )}

      {/* COUNTRY MODAL */}
      {editingCountry && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={saveCountry} className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-pop">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editingCountry.id ? "나라 박스 수정" : "새 나라 박스"}</h2>
              <button type="button" onClick={() => setEditingCountry(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>국기 이모지</label>
                <input value={countryForm.flag} onChange={(e) => setCountryForm({ ...countryForm, flag: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>나라 이름 (기사의 국가명과 동일하게)</label>
                <input required value={countryForm.name} onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>소제목</label>
                <input value={countryForm.subtitle} onChange={(e) => setCountryForm({ ...countryForm, subtitle: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>배경색</label>
                <select value={countryForm.bg} onChange={(e) => setCountryForm({ ...countryForm, bg: e.target.value })} className={field}>
                  {bgOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>설명</label>
              <textarea
                rows={6}
                value={countryForm.description}
                onChange={(e) => setCountryForm({ ...countryForm, description: e.target.value })}
                className={field + " min-h-[140px] leading-relaxed font-normal"}
              />
            </div>

            <div className="mt-4">
              <label className={label}>표시 순서</label>
              <input
                type="number"
                value={countryForm.sort_order}
                onChange={(e) => setCountryForm({ ...countryForm, sort_order: Number(e.target.value) })}
                className={field}
              />
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={countryForm.is_visible}
                onChange={(e) => setCountryForm({ ...countryForm, is_visible: e.target.checked })}
              />
              페이지에 표시
            </label>

            <button type="submit" className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
              저장
            </button>
          </form>
        </div>
      )}

      {/* MONTH MODAL */}
      {editingMonth && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={saveMonth} className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-pop">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editingMonth.id ? "월 박스 수정" : "새 월 박스"}</h2>
              <button type="button" onClick={() => setEditingMonth(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>이모지</label>
                <input value={monthForm.emoji} onChange={(e) => setMonthForm({ ...monthForm, emoji: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>이름 (예: 1월 / January)</label>
                <input required value={monthForm.label} onChange={(e) => setMonthForm({ ...monthForm, label: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>배경색</label>
                <select value={monthForm.bg} onChange={(e) => setMonthForm({ ...monthForm, bg: e.target.value })} className={field}>
                  {bgOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>표시 순서</label>
                <input
                  type="number"
                  value={monthForm.sort_order}
                  onChange={(e) => setMonthForm({ ...monthForm, sort_order: Number(e.target.value) })}
                  className={field}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>설명</label>
              <textarea
                rows={6}
                value={monthForm.description}
                onChange={(e) => setMonthForm({ ...monthForm, description: e.target.value })}
                className={field + " min-h-[140px] leading-relaxed font-normal"}
              />
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={monthForm.is_visible}
                onChange={(e) => setMonthForm({ ...monthForm, is_visible: e.target.checked })}
              />
              페이지에 표시
            </label>

            <button type="submit" className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
              저장
            </button>
          </form>
        </div>
      )}

      {/* QUIZ MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={saveQuiz} className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-pop">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">{editingQuiz.id ? "퀴즈 문항 수정" : "새 퀴즈 문항"}</h2>
              <button type="button" onClick={() => setEditingQuiz(null)} className="p-2 rounded-full hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>국기 이모지</label>
                <input value={quizForm.flag} onChange={(e) => setQuizForm({ ...quizForm, flag: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>국가명</label>
                <input value={quizForm.country} onChange={(e) => setQuizForm({ ...quizForm, country: e.target.value })} className={field} />
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>질문</label>
              <textarea
                required
                rows={3}
                value={quizForm.question}
                onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                className={field + " min-h-[90px] leading-relaxed font-normal"}
              />
            </div>

            {(["option_a", "option_b", "option_c", "option_d"] as const).map((k, i) => (
              <div key={k} className="mt-3">
                <label className={label}>보기 {i + 1}</label>
                <input value={(quizForm as any)[k]} onChange={(e) => setQuizForm({ ...quizForm, [k]: e.target.value })} className={field} />
              </div>
            ))}

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={label}>정답</label>
                <select
                  value={quizForm.correct_index}
                  onChange={(e) => setQuizForm({ ...quizForm, correct_index: Number(e.target.value) })}
                  className={field}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>
                      보기 {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>표시 순서</label>
                <input
                  type="number"
                  value={quizForm.sort_order}
                  onChange={(e) => setQuizForm({ ...quizForm, sort_order: Number(e.target.value) })}
                  className={field}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>해설</label>
              <textarea
                rows={4}
                value={quizForm.explanation}
                onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                className={field + " min-h-[110px] leading-relaxed font-normal"}
              />
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={quizForm.is_visible}
                onChange={(e) => setQuizForm({ ...quizForm, is_visible: e.target.checked })}
              />
              퀴즈에 표시
            </label>

            <button type="submit" className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
              저장
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
