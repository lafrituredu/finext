import { useTranslation } from "react-i18next";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

type CookieBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: Array<{
    label: string;
    href: string;
  }>;
};

function CookiesPolicy() {
  const { t } = useTranslation("cookiesPolicy");
  const blocks = t("blocks", { returnObjects: true }) as CookieBlock[];

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
            {blocks.map((block, index) => (
              <section className="mb-8 last:mb-0" key={`${block.heading ?? "intro"}-${index}`}>
                {block.heading && (
                  <h2 className="mont_semibold mb-4 text-2xl text-black dark:text-white">
                    {block.heading}
                  </h2>
                )}

                {block.paragraphs?.map((paragraph) => (
                  <p className="mb-4 last:mb-0" key={paragraph}>
                    {paragraph}
                  </p>
                ))}

                {block.bullets && (
                  <ul className="mb-4 list-disc space-y-3 pl-6">
                    {block.bullets.map((bullet) => (
                      <li key={bullet.href}>
                        {bullet.label}:{" "}
                        <a
                          className="text-primary underline-offset-4 hover:underline"
                          href={bullet.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {bullet.href}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
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

export default CookiesPolicy;
