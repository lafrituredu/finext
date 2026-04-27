import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DarkButton from "../buttons/DarkButton.tsx";
import Language from "../buttons/Lang.tsx";
import api from "../../api/axiosInstance";

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
        const response = await api.get("/me");
        const user = response.data;

        if (!user?.email_verified_at) {
          setAuthState({
            status: "unverified",
            email: user?.email || ""
          });
          return;
        }

        setAuthState({ status: "authenticated" });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({ status: "unauthenticated" });
      }
    };

    checkToken();
  }, []);

  if (authState.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-background">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <div className="hidden">
          <DarkButton />
          <Language />
        </div>
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to="/login" />;
  }

  if (authState.status === "unverified") {
    return (
      <Navigate
        to={`/verify-email?status=pending&email=${encodeURIComponent(authState.email)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
