import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FiNextIcon from "/src/assets/icons/finext.svg?react";

import { sendPasswordResetEmail } from "../api/AuthServices";
import DarkButton from "../components/buttons/DarkButton";
import Language from "../components/buttons/Lang";
import { getFriendlyApiError } from "../utils/getFriendlyApiError";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation("forgotPassword");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email.trim()) {
      setError(t("email_required"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t("email_invalid"));
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await sendPasswordResetEmail(email.trim());
      setMessage(response.message);
    } catch (err: any) {
      setError(getFriendlyApiError(err, t("send_error")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#bfc6d6] dark:bg-dark-background flex items-center justify-center p-6">
      <div className="hidden">
        <DarkButton />
        <Language />
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-dark-card rounded-3xl shadow-lg flex overflow-hidden">
        <div className="w-full lg:w-[48%] p-10 lg:p-12">
          <button
            className="mb-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
            onClick={() => navigate("/")}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="mont_semibold text-3xl mb-4 text-black dark:text-white">
            {t("title")}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-6 mb-6 inter">
            {t("description")}
          </p>

          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                {t("email_label")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                autoComplete="email"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all inter font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t("sending") : t("submit")}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-background transition-all inter font-medium cursor-pointer"
          >
            {t("back_login")}
          </button>
        </div>

        <div
          className="hidden lg:flex lg:w-[52%] bg-cover bg-center bg-no-repeat relative rounded-r-3xl"
          style={{
            backgroundImage: `url(${
              document.documentElement.classList.contains("dark")
                ? "/loginregister/RectangleDark.png"
                : "/loginregister/Rectangle.png"
            })`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-r-3xl"></div>
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
            </div>

            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
