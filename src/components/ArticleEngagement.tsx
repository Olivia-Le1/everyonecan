import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export const ArticleEngagement = ({ articleId }: { articleId: string }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const loadLikes = useCallback(async () => {
    const { data } = await supabase
      .from("article_likes")
      .select("user_id")
      .eq("article_id", articleId);
    setLikeCount(data?.length ?? 0);
    setLiked(!!user && !!data?.some((l) => l.user_id === user.id));
  }, [articleId, user]);

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from("article_comments")
      .select("id, user_id, author_name, content, created_at")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });
    setComments((data ?? []) as Comment[]);
  }, [articleId]);

  useEffect(() => {
    loadLikes();
    loadComments();
  }, [loadLikes, loadComments]);

  const toggleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (busy) return;
    setBusy(true);

    if (liked) {
      const { error } = await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", user.id);
      if (error) toast({ title: "Couldn't unlike", description: error.message });
    } else {
      const { error } = await supabase
        .from("article_likes")
        .insert({ article_id: articleId, user_id: user.id });
      if (error) toast({ title: "Couldn't like", description: error.message });
    }

    await loadLikes();
    setBusy(false);
  };

  const postComment = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const text = draft.trim();
    if (!text) return;
    setPosting(true);
    const { error } = await supabase.from("article_comments").insert({
      article_id: articleId,
      user_id: user.id,
      author_name: user.email?.split("@")[0] ?? "reader",
      content: text,
    });
    if (error) {
      toast({ title: "Couldn't post comment", description: error.message });
    } else {
      setDraft("");
      await loadComments();
    }
    setPosting(false);
  };

  const removeComment = async (id: string) => {
    const { error } = await supabase.from("article_comments").delete().eq("id", id);
    if (error) toast({ title: "Couldn't delete", description: error.message });
    await loadComments();
  };

  return (
    <section className="mt-12 max-w-3xl">
      <button
        onClick={toggleLike}
        disabled={busy}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this article"}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-soft transition hover:scale-105 ${
          liked ? "bg-pink text-primary-foreground" : "bg-white"
        }`}
      >
        <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
        {likeCount}
      </button>

      <h2 className="mt-10 text-2xl font-black tracking-tight">
        Comments <span className="text-muted-foreground">({comments.length})</span>
      </h2>

      {user ? (
        <div className="mt-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="Share your thoughts…"
            className="w-full rounded-2xl bg-white p-4 shadow-soft outline-none resize-y"
          />
          <button
            onClick={postComment}
            disabled={posting || !draft.trim()}
            className="mt-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-50"
          >
            {posting ? "Posting…" : "Post comment"}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-muted-foreground">
          <button onClick={() => navigate("/auth")} className="underline font-semibold">
            Sign in
          </button>{" "}
          to leave a comment.
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="p-5 rounded-2xl bg-white shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold">{c.author_name || "reader"}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
                {(isAdmin || user?.id === c.user_id) && (
                  <button
                    onClick={() => removeComment(c.id)}
                    aria-label="Delete comment"
                    className="text-muted-foreground hover:text-pink"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
