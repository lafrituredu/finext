import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FiNextIcon from "/src/assets/icons/finext.svg?react";

import { resendVerificationEmail } from "../api/AuthServices";
import DarkButton from "../components/buttons/DarkButton";
import Language from "../components/buttons/Lang";

const EMAIL_VERIFICATION_STORAGE_KEY = "email-verification-event";

const VerifyEmail: React.FC = () => {
  const { t } = useTranslation("verifyEmail");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(
    (location.state as { message?: string } | null)?.message || ""
  );
  const [error, setError] = useState("");
  const hasActiveSession = Boolean(localStorage.getItem("token"));

  const clearPendingSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const goToLogin = () => {
    clearPendingSession();
    navigate("/login");
  };

  const goToRegister = () => {
    clearPendingSession();
    navigate("/register");
  };

  const [status, setStatus] = useState(searchParams.get("status") || "pending");
  const [email, setEmail] = useState(searchParams.get("email") || "");

  useEffect(() => {
    const nextStatus = searchParams.get("status") || "pending";
    const nextEmail = searchParams.get("email") || "";
    setStatus(nextStatus);
    setEmail(nextEmail);
  }, [searchParams]);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    localStorage.setItem(
      EMAIL_VERIFICATION_STORAGE_KEY,
      JSON.stringify({
        status: "success",
        email,
        timestamp: Date.now()
      })
    );
  }, [email, status]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== EMAIL_VERIFICATION_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const payload = JSON.parse(event.newValue) as {
          status?: string;
          email?: string;
        };

        if (payload.status !== "success") {
          return;
        }

        if (email && payload.email && payload.email !== email) {
          return;
        }

        setStatus("success");
        if (payload.email) {
          setEmail(payload.email);
        }
        setMessage((current) =>
          current || "Tu correo ya ha sido verificado correctamente."
        );
      } catch {
        // Ignore malformed storage payloads
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [email]);

  useEffect(() => {
    if (status !== "success" || !hasActiveSession) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/dashboard");
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasActiveSession, navigate, status]);

  const content = useMemo(() => {
    if (status === "success") {
      return {
        title: t("verified_title"),
        description: t("verified_description"),
        primaryLabel: hasActiveSession ? t("primary_dashboard") : t("primary_login"),
        primaryAction: () => navigate(hasActiveSession ? "/dashboard" : "/login"),
        showResend: false,
        showRegister: false
      };
    }

    if (status === "invalid") {
      return {
        title: t("invalid_title"),
        description: t("invalid_description"),
        primaryLabel: t("primary_back_login"),
        primaryAction: goToLogin,
        showResend: Boolean(email),
        showRegister: true
      };
    }

    return {
      title: t("pending_title"),
      description: t("pending_description"),
      primaryLabel: t("primary_login"),
      primaryAction: goToLogin,
      showResend: Boolean(email),
      showRegister: true
    };
  }, [email, hasActiveSession, navigate, status, t]);

  const handleResend = async () => {
    if (!email) {
      setError(t("missing_email"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await resendVerificationEmail(email);
      setMessage(response.message);
    } catch (err: any) {
      setError(err.response?.data?.message || t("resend_error"));
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
            className="mb-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
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
            {content.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-6 mb-6 inter">
            {content.description}
          </p>

          {email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 inter">
              {t("email_label")}:{" "}
              <span className="font-medium text-black dark:text-white">{email}</span>
            </p>
          )}

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

          <button
            type="button"
            onClick={content.primaryAction}
            className="w-full text-white py-3 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all inter font-medium mb-3"
          >
            {content.primaryLabel}
          </button>

          {content.showResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-background transition-all inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("resending") : t("resend")}
            </button>
          )}

          {content.showRegister && (
            <button
              type="button"
              onClick={goToRegister}
              className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-background transition-all inter font-medium mt-3"
            >
              {t("secondary_register")}
            </button>
          )}
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

export default VerifyEmail;
