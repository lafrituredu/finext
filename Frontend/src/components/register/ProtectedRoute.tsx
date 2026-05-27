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
        // When a private route is refreshed, do not trust only localStorage.
        // Ask /me to check that the token exists and belongs to a user.
        const response = await api.get("/me");
        const user = response.data;

        // The backend can know the token but the email can still be unverified.
        // In that case, send the user to the verification page.
        if (!user?.email_verified_at) {
          setAuthState({
            status: "unverified",
            email: user?.email || ""
          });
          return;
        }

        setAuthState({ status: "authenticated" });
      } catch (error) {
        // If /me fails, the token is not valid anymore.
        // Remove it so the browser does not keep a broken session.
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
