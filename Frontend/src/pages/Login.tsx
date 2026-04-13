import React, { useState } from "react";
import { loginUser } from "../api/AuthServices";

  

const Login: React.FC = () => {

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
    <div className="min-h-screen bg-[#bfc6d6] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 p-10">
          <button
            className="mb-6 text-gray-400 hover:text-gray-600"
            onClick={onGoToHome}
          >
            ←
          </button>

          <h1 className="text-2xl font-semibold mb-6">
            Inicia sesión en FiNext
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-500">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-500">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <p className="text-xs text-gray-400 mb-4 cursor-pointer hover:underline">
            ¿Has olvidado tu contraseña?
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full text-white py-2 rounded-full transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed ${
              isFormComplete
                ? "bg-blue-400 hover:bg-blue-500"
                : "bg-blue-300 hover:bg-blue-400"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-400">O</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google */}
          <button className="w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="text-sm">Continuar con Google</span>
          </button>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            Al continuar, aceptas nuestros Términos y Política de Privacidad
          </p>

          <p className="text-sm text-gray-600 text-center mt-6">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-gradient-to-br from-[#dfe6f3] to-[#cfd8ea] flex flex-col justify-center p-10">
          <h2 className="text-xl font-semibold mb-4">
            Bienvenido de nuevo.
          </h2>

          <p className="text-sm text-gray-600 max-w-sm">
            Accede a tu cuenta y sigue controlando tus finanzas de forma inteligente con FiNext.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;