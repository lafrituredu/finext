import { useTranslation } from "react-i18next";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const legalSections = [
  {
    key: "general",
    paragraphs: ["intro", "ownership", "address", "phone", "email"],
  },
  {
    key: "terms",
    subsections: [
      {
        key: "websiteObject",
        paragraphs: ["definition", "modification", "freeAccess", "registration"],
      },
      {
        key: "user",
        paragraphs: ["acceptance", "responsibilityIntro"],
        bullets: ["properUse", "truthfulData"],
        closingParagraphs: ["noCommercialRelationship", "allAges"],
      },
    ],
  },
  {
    key: "access",
    paragraphs: ["availability", "software", "misuse"],
  },
  {
    key: "links",
    paragraphs: [
      "thirdPartyLinks",
      "purpose",
      "noCommercialization",
      "noGuarantee",
      "noReview",
      "noResponsibility",
      "hyperlinkIntro",
      "noReproduction",
      "noFalseStatements",
      "protectedElements",
      "noRelationship",
    ],
  },
  {
    key: "intellectualProperty",
    paragraphs: ["ownership", "rightsReserved", "userCommitment", "notification"],
  },
  {
    key: "legalActions",
    paragraphs: ["actions", "law"],
  },
] as const;

function LegalNotice() {
  const { t } = useTranslation("legalNotice");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 dark:bg-dark-background">
        <section className="bg-gradient-to-b from-[#5B3FD8] via-[#5545C8] to-[#7B5FE8] px-6 py-12 dark:from-[#3023AE] dark:to-[#5B47D8] md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mont_semibold text-3xl text-white md:text-5xl">
              {t("hero.title")}
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
          <article className="inter rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm leading-7 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-dark-card dark:text-gray-300 md:p-10 md:text-base">
            {legalSections.map((section) => (
              <section className="mb-10 last:mb-0" key={section.key}>
                <h2 className="mont_semibold mb-4 text-2xl text-black dark:text-white">
                  {t(`sections.${section.key}.title`)}
                </h2>

                {"paragraphs" in section &&
                  section.paragraphs.map((paragraph) => (
                    <p className="mb-4 last:mb-0" key={paragraph}>
                      {t(`sections.${section.key}.paragraphs.${paragraph}`)}
                    </p>
                  ))}

                {"subsections" in section &&
                  section.subsections.map((subsection) => (
                    <div className="mb-6 last:mb-0" key={subsection.key}>
                      <h3 className="mont_semibold mb-3 text-lg text-black dark:text-white">
                        {t(`sections.${section.key}.subsections.${subsection.key}.title`)}
                      </h3>

                      {subsection.paragraphs.map((paragraph) => (
                        <p className="mb-4" key={paragraph}>
                          {t(`sections.${section.key}.subsections.${subsection.key}.paragraphs.${paragraph}`)}
                        </p>
                      ))}

                      {"bullets" in subsection && (
                        <ul className="mb-4 list-disc space-y-3 pl-6">
                          {subsection.bullets.map((bullet) => (
                            <li key={bullet}>
                              {t(`sections.${section.key}.subsections.${subsection.key}.bullets.${bullet}`)}
                            </li>
                          ))}
                        </ul>
                      )}

                      {"closingParagraphs" in subsection &&
                        subsection.closingParagraphs.map((paragraph) => (
                          <p className="mb-4 last:mb-0" key={paragraph}>
                            {t(`sections.${section.key}.subsections.${subsection.key}.closingParagraphs.${paragraph}`)}
                          </p>
                        ))}
                    </div>
                  ))}
              </section>
            ))}
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LegalNotice;
