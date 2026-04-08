import React, { useState } from "react";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();
  console.log(data);
};


  return (
    <div className="min-h-screen bg-[#bfc6d6] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="w-1/2 p-10">
          <button className="mb-6 text-gray-400 hover:text-gray-600">
            ←
          </button>

          <h1 className="text-2xl font-semibold mb-6">
            Bienvenido a FiNext
          </h1>

          {/* Nombre */}
          <div className="mb-4">
            <label className="text-sm text-gray-500">Nombre</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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

          {/* Passwords */}
          <div className="flex gap-3 mb-2">
            <div className="w-1/2">
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

            <div className="w-1/2">
              <label className="text-sm text-gray-500">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Entre 8 y 20 caracteres
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-300 hover:bg-blue-400 text-white py-2 rounded-full transition mb-4"
          >
            Continua
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
            <span className="text-sm">Continua con Google</span>
          </button>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            Al continuar, aceptas nuestros Términos y Política de Privacidad
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-gradient-to-br from-[#dfe6f3] to-[#cfd8ea] flex flex-col justify-center p-10">
          <h2 className="text-xl font-semibold mb-4">
            El siguiente paso en tus finanzas.
          </h2>

          <p className="text-sm text-gray-600 max-w-sm">
            Con FiNext podrás controlar tus gastos para tomar decisiones
            inteligentes y planificar tu futuro con tranquilidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;