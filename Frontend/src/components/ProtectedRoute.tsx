import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DarkButton from "./buttons/DarkButton.tsx";
import Language from "./buttons/Lang.tsx";
import api from "../api/axiosInstance";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get("/me"); //valida token 
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-background">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <div className="hidden"><DarkButton/><Language/></div>
      </div>
    );
  }

  if (!isValid) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;