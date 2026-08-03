import { useSiteSettings } from "@/hooks/useSiteSettings";

export const About = () => {
  const { t } = useSiteSettings();

  return (
    <section id="about" className="container py-20 md:py-28">
      <div className="max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
          {t("about_title", "About World Bias")}
        </h2>

        <p className="mt-6 text-lg text-muted-foreground whitespace-pre-line">
          {t(
            "about_description",
            "World Bias challenges stereotypes and explores cultures beyond common assumptions."
          )}
        </p>
      </div>
    </section>
  );
};
