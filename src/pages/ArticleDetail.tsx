import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

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

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
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

      <p className="mt-4 text-muted-foreground">
        {article.description}
      </p>

      {session ? (
        <div className="mt-8 whitespace-pre-line">
          {article.content}
        </div>
      ) : (
        <div className="mt-8">
          <div className="whitespace-pre-line blur-[1px] max-h-32 overflow-hidden">
            {article.content}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-secondary text-center">
            <p className="font-bold text-lg">
              Sign up to read the full article.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default ArticleDetail;
