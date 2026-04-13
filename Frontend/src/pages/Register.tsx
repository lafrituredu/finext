import React, { useState, useEffect, useRef } from "react";
import { registerUser } from "../api/AuthServices";



type FormDataType = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name: string;
  phone_number: string;
  rol: string;
};

const Register: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRolOpen, setIsRolOpen] = useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const rolDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    full_name: "",
    phone_number: "",
    rol: "autonomo"
  });

  if (localStorage.getItem("token")) {
    window.location.href = "/dashboard";
  }

  const [availability, setAvailability] = useState<{
    email: boolean | null;
    username: boolean | null;
  }>({
    email: null,
    username: null
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rolDropdownRef.current && !rolDropdownRef.current.contains(event.target as Node)) {
        setIsRolOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Resetear disponibilidad cuando cambia el valor
    if (e.target.name === "email" || e.target.name === "username") {
      setAvailability({
        ...availability,
        [e.target.name]: null
      });
    }
  };

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    setError("");

    try {
      // Verificar email
      const emailRes = await fetch(`http://127.0.0.1:8000/api/check-email?email=${formData.email}`);
      const emailData = await emailRes.json();

      // Verificar username
      const usernameRes = await fetch(`http://127.0.0.1:8000/api/check-username?username=${formData.username}`);
      const usernameData = await usernameRes.json();

      setAvailability({
        email: emailData.available,
        username: usernameData.available
      });

      // Retornar los valores directamente, no del estado
      return {
        isAvailable: emailData.available && usernameData.available,
        emailAvailable: emailData.available,
        usernameAvailable: usernameData.available
      };
    } catch (err) {
      console.error("Error verificando disponibilidad:", err);
      setError("Error al verificar disponibilidad");
      return {
        isAvailable: false,
        emailAvailable: false,
        usernameAvailable: false
      };
    } finally {
      setCheckingAvailability(false);
    }
  };

  const nextStep = async () => {
    if (!formData.email || !formData.password || !formData.username || !formData.confirmPassword) {
      setError("Completa todos los campos");
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Validar que incluya al menos un carácter especial
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(formData.password)) {
      setError("La contraseña debe incluir al menos un carácter especial (!@#$%^&*...)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Verificar disponibilidad de email y username
    const result = await checkAvailability();

    if (!result.isAvailable) {
      if (!result.emailAvailable && !result.usernameAvailable) {
        setError("El correo electrónico y el nombre de usuario ya están en uso");
      } else if (!result.emailAvailable) {
        setError("El correo electrónico ya está en uso");
      } else if (!result.usernameAvailable) {
        setError("El nombre de usuario ya está en uso");
      }
      return;
    }

    setError("");
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleBackOrLogin = () => {
    if (step === 2) {
      prevStep();
    } else {
      window.location.href = "/login";
    }
  };

  const onGoToHome = () => {
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!formData.full_name || !formData.phone_number) {
    setError("Completa todos los campos");
    setLoading(false);
    return;
  }

  try {
    const data = await registerUser({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      rol: formData.rol
    });

    localStorage.setItem("token", data.token);

    localStorage.setItem("user", data.user.username);


    window.location.href = "/dashboard";

  } catch (err: any) {
    setError(err.response?.data?.message || "Error al registrarse");
  } finally {
    setLoading(false);
  }
};

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const isStep1Complete = formData.email && formData.password && formData.username && formData.confirmPassword && passwordsMatch;
  const isStep2Complete = formData.full_name && formData.phone_number;

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
            Regístrate en FiNext
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASO 1 */}
            {step === 1 && (
              <>
                {/* Username */}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full mt-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                        availability.username === null
                          ? "border-gray-300 focus:ring-blue-400"
                          : availability.username
                            ? "border-green-400 focus:ring-green-400"
                            : "border-red-400 focus:ring-red-400"
                      }`}
                    />
                    {availability.username !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5">
                        {availability.username ? (
                          <span className="text-green-500 text-xl">✓</span>
                        ) : (
                          <span className="text-red-500 text-xl">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full mt-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                        availability.email === null
                          ? "border-gray-300 focus:ring-blue-400"
                          : availability.email
                            ? "border-green-400 focus:ring-green-400"
                            : "border-red-400 focus:ring-red-400"
                      }`}
                    />
                    {availability.email !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5">
                        {availability.email ? (
                          <span className="text-green-500 text-xl">✓</span>
                        ) : (
                          <span className="text-red-500 text-xl">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password y Confirm Password - lado a lado */}
                <div className="mb-2 flex gap-3">
                  {/* Password */}
                  <div className="flex-1">
                    <label className="text-sm text-gray-500">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full mt-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                          formData.password === "" || formData.confirmPassword === ""
                            ? "border-gray-300 focus:ring-blue-400"
                            : passwordsMatch
                              ? "border-green-400 focus:ring-green-400"
                              : "border-red-400 focus:ring-red-400"
                        }`}
                      />
                      {formData.password !== "" && formData.confirmPassword !== "" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5">
                          {passwordsMatch ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-red-500 text-xl">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex-1">
                    <label className="text-sm text-gray-500">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full mt-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                          formData.confirmPassword === "" || formData.password === ""
                            ? "border-gray-300 focus:ring-blue-400"
                            : passwordsMatch
                              ? "border-green-400 focus:ring-green-400"
                              : "border-red-400 focus:ring-red-400"
                        }`}
                      />
                      {formData.confirmPassword !== "" && formData.password !== "" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5">
                          {passwordsMatch ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-red-500 text-xl">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-6">
                  Mínimo 8 caracteres e incluir al menos un carácter especial (!@#$%^&*...)
                </p>

                {/* Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={checkingAvailability}
                  className={`w-full text-white py-2 rounded-full transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isStep1Complete
                      ? "bg-blue-400 hover:bg-blue-500"
                      : "bg-blue-300 hover:bg-blue-400"
                  }`}
                >
                  {checkingAvailability ? "Verificando..." : "Siguiente"}
                </button>
              </>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <>
                {/* Full Name */}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Rol - Select personalizado */}
                <div className="mb-6">
                  <label className="text-sm text-gray-500">
                    Rol
                  </label>
                  <div className="relative" ref={rolDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsRolOpen(!isRolOpen)}
                      className="w-full mt-1 px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer text-left"
                    >
                      {formData.rol === "autonomo" ? "Autónomo" : "Gestor"}
                    </button>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 pointer-events-none">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isRolOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Dropdown menu */}
                    {isRolOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, rol: "autonomo" });
                            setIsRolOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition ${
                            formData.rol === "autonomo" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          Autónomo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, rol: "gestor" });
                            setIsRolOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition ${
                            formData.rol === "gestor" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          Gestor
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-full transition"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 text-white py-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isStep2Complete && !loading
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "bg-blue-300 hover:bg-blue-400"
                    }`}
                  >
                    {loading ? "Registrando..." : "Registrarse"}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
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
            ¿Ya estás registrado?{" "}
            <button
              type="button"
              onClick={handleBackOrLogin}
              className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-gradient-to-br from-[#dfe6f3] to-[#cfd8ea] flex flex-col justify-center p-10">
          <h2 className="text-xl font-semibold mb-4">
            Únete a FiNext
          </h2>

          <p className="text-sm text-gray-600 max-w-sm">
            Crea tu cuenta y empieza a gestionar tus finanzas de forma inteligente con FiNext.
          </p>

          <div className="mt-8 space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${step >= 1 ? 'text-gray-700' : 'text-gray-400'}`}>
                Información de acceso
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${step >= 2 ? 'text-gray-700' : 'text-gray-400'}`}>
                Datos personales
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;