import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FiNextIcon from "/src/assets/icons/finext.svg?react";

import DarkButton from "../components/buttons/DarkButton";
import Language from "../components/buttons/Lang";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const googleSetupToken = useMemo(
    () => searchParams.get("google_setup_token") || "",
    [searchParams]
  );
  const googleEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const googleFullName = useMemo(
    () => searchParams.get("full_name") || "",
    [searchParams]
  );
  const googleUsername = useMemo(
    () => searchParams.get("username") || "",
    [searchParams]
  );
  const username = useMemo(
    () => searchParams.get("username") || searchParams.get("email") || "",
    [searchParams]
  );
  const googleError = useMemo(() => searchParams.get("error") || "", [searchParams]);

  useEffect(() => {
    if (googleError) {
      setError(googleError);
      return;
    }

    // Si el backend no encuentra usuario completo, devuelve google_setup_token.
    // Se manda a Register para completar telefono, rol y datos fiscales si toca.
    if (googleSetupToken) {
      const params = new URLSearchParams({
        google_setup_token: googleSetupToken,
        email: googleEmail,
        full_name: googleFullName,
        username: googleUsername
      });

      navigate(`/register?${params.toString()}`, { replace: true });
      return;
    }

    if (!token || !username) {
      setError("No se ha podido iniciar sesion con Google.");
      return;
    }

    // Usuario Google ya existente o completado: se guarda el token Sanctum
    // recibido del backend y se entra en el dashboard.
    localStorage.setItem("token", token);
    localStorage.setItem("user", username);
    window.history.replaceState({}, document.title, "/auth/google/callback");
    navigate("/dashboard", { replace: true });
  }, [
    googleEmail,
    googleError,
    googleFullName,
    googleSetupToken,
    googleUsername,
    navigate,
    token,
    username
  ]);

  return (
    <div className="min-h-screen bg-[#bfc6d6] dark:bg-dark-background flex items-center justify-center p-6">
      <div className="hidden">
        <DarkButton />
        <Language />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl shadow-lg p-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FiNextIcon className="w-10 h-10 text-primary" />
          <span className="mont_semibold text-2xl text-black dark:text-white">
            FiNext
          </span>
        </div>

        {!error ? (
          <>
            <div className="mx-auto mb-5 w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
            <h1 className="mont_semibold text-2xl text-black dark:text-white mb-3">
              Conectando con Google
            </h1>
            <p className="inter text-sm text-gray-600 dark:text-gray-300">
              Estamos preparando tu sesion.
            </p>
          </>
        ) : (
          <>
            <h1 className="mont_semibold text-2xl text-black dark:text-white mb-3">
              No se pudo iniciar sesion
            </h1>
            <p className="inter text-sm text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="w-full text-white py-3 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all inter font-medium cursor-pointer"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
