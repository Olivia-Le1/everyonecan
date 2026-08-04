import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, RotateCcw } from "lucide-react";

interface Question {
  flag: string;
  country: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase
      .from("quiz_questions")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setQuestions(
          (data ?? []).map((q: any) => ({
            flag: q.flag,
            country: q.country,
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d].filter((o) => o && o.length > 0),
            correct: q.correct_index,
            explanation: q.explanation,
          }))
        );
      });
  }, []);

  const handlePick = (i: number) => {
    if (selected !== null || !questions) return;
    setSelected(i);
    if (i === questions[idx].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (!questions) return;
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const q = questions?.[idx];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-pink">Bias Quiz</span>
            <h1 className="mt-2 text-4xl md:text-6xl font-black tracking-tighter">
              How biased are you? <span className="inline-block animate-float">✨</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              {questions ? `A ${questions.length}-question quiz on countries you think you know.` : " "}
            </p>
          </div>

          {questions === null ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-muted-foreground">No quiz questions yet.</p>
          ) : !done && q ? (
            <div className="bg-white rounded-[2.5rem] shadow-pop p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-muted-foreground">
                  Question {idx + 1} / {questions.length}
                </span>
                <span className="text-xs font-bold text-pink">Score: {score}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-pink transition-all duration-500"
                  style={{ width: `${((idx + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{q.flag}</span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{q.country}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-balance leading-tight">{q.question}</h2>

              <div className="mt-8 space-y-3">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct;
                  const isPicked = i === selected;
                  const show = selected !== null;
                  const cls = !show
                    ? "bg-secondary hover:bg-pink-soft hover:scale-[1.01]"
                    : isCorrect
                    ? "bg-mint"
                    : isPicked
                    ? "bg-rose"
                    : "bg-secondary opacity-60";
                  return (
                    <button
                      key={`${opt}-${i}`}
                      onClick={() => handlePick(i)}
                      disabled={show}
                      className={`w-full text-left px-5 py-4 rounded-2xl font-semibold transition flex items-center justify-between ${cls}`}
                    >
                      <span>{opt}</span>
                      {show && isCorrect && <Check className="size-5" />}
                      {show && isPicked && !isCorrect && <X className="size-5" />}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-6 p-4 rounded-2xl bg-butter animate-fade-in">
                  <p className="text-sm font-semibold leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {selected !== null && (
                <button
                  onClick={handleNext}
                  className="mt-6 w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition"
                >
                  {idx + 1 >= questions.length ? "See results" : "Next question →"}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-pop p-10 text-center animate-fade-up">
              <div className="text-6xl mb-4">
                {score >= questions.length * 0.8 ? "🎉" : score >= questions.length * 0.4 ? "👏" : "🌱"}
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
                You scored {score} / {questions.length}
              </h2>
              <button
                onClick={reset}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink text-white font-bold hover:scale-105 transition"
              >
                <RotateCcw className="size-4" /> Try again
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
