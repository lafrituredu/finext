import React, { useState } from "react";
import { loginUser } from "../api/AuthServices";
import { useTranslation } from 'react-i18next';
import FiNextIcon from '/src/assets/icons/finext.svg?react';
import DarkButton from  "../components/buttons/DarkButton.tsx";
import Language from '../components/buttons/Lang.tsx';


const Login: React.FC = () => {
  const { t } = useTranslation("login");

  if (localStorage.getItem("token")) {
    window.location.href = "/dashboard";
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormComplete = email && password;

  const onGoToHome = () => {
    window.location.href = "/";
  };

  const onGoToRegister = () => {
    window.location.href = "/register";
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user.username);

      window.location.href = "/dashboard";

    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#bfc6d6] dark:bg-dark-background flex items-center justify-center p-6">
      <div className="hidden"><DarkButton/><Language/></div>
      <div className="w-full max-w-6xl bg-white dark:bg-dark-card rounded-3xl shadow-lg flex overflow-hidden">

        {/* LEFT SIDE - Formulario */}
        <div className="lg:w-[45%] w-full p-10 lg:p-12">
          <button
            className="mb-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            onClick={onGoToHome}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="mont_semibold text-3xl mb-2 text-black dark:text-white">
            {t('welcome_back')}
          </h1>
          <h1 className="mont_semibold text-3xl mb-8 text-black dark:text-white">
            {t('to_finext')}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 dark:text-gray-400 inter">
              {t('email_label')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-400 inter">
              {t('password_label')}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 cursor-pointer hover:underline inter">
            {t('forgot_password')}
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed inter font-medium ${
              isFormComplete
                ? "bg-primary hover:bg-primary/90 shadow-md"
                : "bg-primary/60"
            }`}
          >
            {loading ? t('logging_in') : t('continue')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-400 dark:text-gray-500 inter">{t('or')}</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Google */}
          <button className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-background transition-colors">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 inter">{t('continue_with_google')}</span>
          </button>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-6 inter">
            {t('terms_text')} <span className="underline cursor-pointer">{t('terms')}</span> {t('and')} <span className="underline cursor-pointer">{t('privacy')}</span>
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6 inter">
            {t('no_account')}{" "}
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-primary hover:text-primary/80 font-medium hover:underline"
            >
              {t('register')}
            </button>
          </p>
        </div>

        {/* RIGHT SIDE - Hero con imagen de fondo */}
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
          {/* Overlay para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-r-3xl"></div>

          {/* Contenido */}
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Logo arriba */}
            <div className="flex items-center gap-3">
              <FiNextIcon className="w-10 h-10 text-primary"/>
              <span className="mont_semibold text-2xl text-black dark:text-white">FiNext</span>
            </div>

            {/* Texto hero */}
            <div className="space-y-4">
              <h2 className="mont_semibold text-4xl text-black dark:text-white leading-tight">
                {t('hero_title')}
              </h2>
              <p className="inter text-base text-black dark:text-gray-300 max-w-md">
                {t('hero_description')}
              </p>
            </div>

            {/* Espacio para estética */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;