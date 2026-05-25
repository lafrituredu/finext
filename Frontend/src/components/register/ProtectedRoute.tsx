import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DarkButton from "../buttons/DarkButton.tsx";
import Language from "../buttons/Lang.tsx";
import api from "../../api/axiosInstance";
import FiNextIcon from '/src/assets/icons/finext.svg?react'

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "unverified"; email: string }
  | { status: "authenticated" };

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Al refrescar una ruta privada no nos fiamos solo de localStorage:
        // preguntamos a /me para confirmar que el token existe y pertenece a un usuario.
        const response = await api.get("/me");
        const user = response.data;

        // El backend puede reconocer el token pero bloquear el acceso si el email
        // aun no esta verificado. En ese caso se envia a la pantalla de verificacion.
        if (!user?.email_verified_at) {
          setAuthState({
            status: "unverified",
            email: user?.email || ""
          });
          return;
        }

        setAuthState({ status: "authenticated" });
      } catch (error) {
        // Si /me falla, el token ya no sirve. Se elimina para no dejar una
        // sesion rota en el navegador.
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({ status: "unauthenticated" });
      }
    };

    checkToken();
  }, []);

  if (authState.status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark-background gap-4">
        <FiNextIcon className="w-24 animate-pulse"/>
        <div className="hidden">
          <Language/><DarkButton/>
        </div>
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to="/login" />;
  }else if (authState.status === "unverified") {
    return (
      <Navigate
        to={`/verify-email?status=pending&email=${encodeURIComponent(authState.email)}`}
        replace
      />
    );
  }else if (authState.status === "authenticated"){
    return children;
  }

};

export default ProtectedRoute;
