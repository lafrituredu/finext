import React from "react";
import FiNextIcon from "/src/assets/icons/finext.svg?react";

type Props = {
  step: number;
  role: string;
  t: (key: string) => string;
};

const RegisterHero: React.FC<Props> = ({ step, role, t }) => {
  return (
    <div
      className="lg:flex hidden lg:w-[55%] bg-cover bg-center bg-no-repeat relative rounded-r-3xl"
      style={{
        backgroundImage: `url(${
          document.documentElement.classList.contains("dark")
            ? "/loginregister/RectangleDark.png"
            : "/loginregister/Rectangle.png"
        })`
      }}
    >
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <FiNextIcon className="w-10 h-10 text-primary" />
          <span className="mont_semibold text-2xl text-black dark:text-white">
            FiNext
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="mont_semibold text-4xl text-black dark:text-white leading-tight">
            {t("hero_title")}
          </h2>
          <p className="inter text-base text-black dark:text-gray-300 max-w-md">
            {t("hero_description")}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  step >= 1 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              <span
                className={`text-sm inter transition-colors ${
                  step >= 1
                    ? "text-black dark:text-white font-medium"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {t("step1_title")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  step >= 2 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              <span
                className={`text-sm inter transition-colors ${
                  step >= 2
                    ? "text-black dark:text-white font-medium"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {t("step2_title")}
              </span>
            </div>

            {role === "autonomo" && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step >= 3 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <span
                  className={`text-sm inter transition-colors ${
                    step >= 3
                      ? "text-black dark:text-white font-medium"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {t("step3_title")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div />
      </div>
    </div>
  );
};

export default RegisterHero;
