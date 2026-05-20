import { useTranslation } from "react-i18next";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

type PrivacyBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  pre?: string[];
};

type PrivacySection = {
  title: string;
  blocks: PrivacyBlock[];
};

function PrivacyPolicy() {
  const { t } = useTranslation("privacyPolicy");
  const sections = t("sections", { returnObjects: true }) as PrivacySection[];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 dark:bg-dark-background">
        <section className="bg-gradient-to-b from-[#5B3FD8] via-[#5545C8] to-[#7B5FE8] px-6 py-12 dark:from-[#3023AE] dark:to-[#5B47D8] md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mont_semibold text-3xl text-white md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="inter mt-4 text-sm text-white/85 md:text-base">
              {t("hero.site")}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
          <article className="inter rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm leading-7 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-dark-card dark:text-gray-300 md:p-10 md:text-base">
            {sections.map((section) => (
              <section className="mb-10 last:mb-0" key={section.title}>
                <h2 className="mont_semibold mb-4 text-2xl text-black dark:text-white">
                  {section.title}
                </h2>

                {section.blocks.map((block, index) => (
                  <div className="mb-6 last:mb-0" key={`${section.title}-${index}`}>
                    {block.heading && (
                      <h3 className="mont_semibold mb-3 text-lg text-black dark:text-white">
                        {block.heading}
                      </h3>
                    )}

                    {block.paragraphs?.map((paragraph) => (
                      <p className="mb-4 last:mb-0" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}

                    {block.bullets && (
                      <ul className="mb-4 list-disc space-y-3 pl-6">
                        {block.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {block.pre && (
                      <pre className="mb-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm text-gray-700 dark:bg-dark-background dark:text-gray-300">
                        {block.pre.join("\n")}
                      </pre>
                    )}
                  </div>
                ))}
              </section>
            ))}

            <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              {t("generator.before")}{" "}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href="https://textos-legales.edgartamarit.com/"
                rel="noreferrer"
                target="_blank"
              >
                {t("generator.link")}
              </a>{" "}
              {t("generator.after")}
            </p>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
