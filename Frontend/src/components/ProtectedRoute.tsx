import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  if (isValid === null) return <div>Loading...</div>;

  if (!isValid) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;