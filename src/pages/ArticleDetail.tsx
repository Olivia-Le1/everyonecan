import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setArticle(data);
      });
  }, [id]);

  if (!article) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="container py-20">

      <img
        src={article.image_url}
        alt={article.title}
        className="w-full max-w-4xl rounded-3xl"
      />

      <h1 className="mt-8 text-4xl font-black">
        {article.title}
      </h1>

      {/* summary는 누구나 보기 */}
      <p className="mt-4 text-muted-foreground text-lg">
        {article.description}
      </p>

      {/* 로그인한 경우만 본문 표시 */}
      {user ? (
        <div className="mt-8 whitespace-pre-line leading-relaxed">
          {article.content}
        </div>
      ) : (
        <div className="mt-10 p-8 rounded-[2rem] bg-secondary text-center">
          <h2 className="text-2xl font-black mb-3">
            Sign up to read the full article ✨
          </h2>

          <p className="text-muted-foreground mb-6">
            Create an account to explore the complete story.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-3 rounded-full bg-pink text-white font-bold"
          >
            Sign up
          </button>
        </div>
      )}

    </main>
  );
};

export default ArticleDetail;
