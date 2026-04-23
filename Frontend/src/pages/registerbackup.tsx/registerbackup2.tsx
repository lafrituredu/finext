import React, { useState, useEffect, useRef } from "react";
import { registerUser, checkEmail, checkUsername } from "../api/AuthServices";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import DarkButton from  "../components/buttons/DarkButton.tsx";
import Language from '../components/buttons/Lang.tsx';

type FormDataType = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name: string;
  phone_number: string;
  rol: string;
  // Campos adicionales para autónomos
  dni?: string;
  birthdate?: string;
  modulo_iva?: string;
  estado_civil?: string;
  empresa?: string;
  irpf?: string;
};

const Register: React.FC = () => {
  const { t } = useTranslation("register");
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRolOpen, setIsRolOpen] = useState<boolean>(false);
  const [isEstadoCivilOpen, setIsEstadoCivilOpen] = useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const rolDropdownRef = useRef<HTMLDivElement>(null);
  const estadoCivilDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    full_name: "",
    phone_number: "",
    rol: "particular",
    dni: "",
    birthdate: "",
    modulo_iva: "",
    estado_civil: "soltero",
    empresa: "",
    irpf: ""
  });

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
      if (estadoCivilDropdownRef.current && !estadoCivilDropdownRef.current.contains(event.target as Node)) {
        setIsEstadoCivilOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
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
      const emailData = await checkEmail(formData.email);
      const usernameData = await checkUsername(formData.username);

      setAvailability({
        email: emailData.available,
        username: usernameData.available
      });

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

  const nextToStep3 = () => {
    if (!formData.full_name || !formData.phone_number) {
      setError("Completa todos los campos");
      return;
    }

    // Si es autónomo, ir al paso 3
    if (formData.rol === "autonomo") {
      setError("");
      setStep(3);
    } else {
      // Si es gestor o particular, registrar directamente
      handleSubmit(new Event('submit') as any);
    }
  };

  const prevStep = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
    setError("");
  };

  const handleBackOrLogin = () => {
    if (step > 1) {
      prevStep();
    } else {
      navigate("/login");
    }
  };

  const onGoToHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación según el paso
    if (step === 2 && (!formData.full_name || !formData.phone_number)) {
      setError("Completa todos los campos");
      setLoading(false);
      return;
    }

    if (step === 3 && formData.rol === "autonomo") {
      if (!formData.dni || !formData.birthdate || !formData.modulo_iva || !formData.empresa || !formData.irpf) {
        setError("Completa todos los campos");
        setLoading(false);
        return;
      }
    }

    try {
      const dataToSend: any = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        rol: formData.rol
      };

      // Si es autónomo, añadir campos adicionales
      if (formData.rol === "autonomo") {
        dataToSend.dni = formData.dni;
        dataToSend.birthdate = formData.birthdate;
        dataToSend.modulo_iva = formData.modulo_iva;
        dataToSend.estado_civil = formData.estado_civil;
        dataToSend.empresa = formData.empresa;
        dataToSend.irpf = formData.irpf;
      }

      const data = await registerUser(dataToSend);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user.username);

      navigate("/dashboard");

    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const isStep1Complete = formData.email && formData.password && formData.username && formData.confirmPassword && passwordsMatch;
  const isStep2Complete = formData.full_name && formData.phone_number;
  const isStep3Complete = formData.dni && formData.birthdate && formData.modulo_iva && formData.empresa && formData.irpf;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "autonomo":
        return t('role_autonomo');
      case "gestor":
        return t('role_gestor');
      case "particular":
        return t('role_particular');
      default:
        return t('role_particular');
    }
  };

  const getEstadoCivilLabel = (estado: string) => {
    switch (estado) {
      case "soltero":
        return t('estado_civil_soltero');
      case "casado":
        return t('estado_civil_casado');
      case "divorciado":
        return t('estado_civil_divorciado');
      case "viudo":
        return t('estado_civil_viudo');
      default:
        return t('estado_civil_soltero');
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

          <h1 className="mont_semibold text-3xl mb-8 text-black dark:text-white">
            {t('register_title')}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASO 1 */}
            {step === 1 && (
              <>
                {/* Username */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('username_label')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                        availability.username === null
                          ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400 dark:focus:ring-blue-500"
                          : availability.username
                            ? "border-green-400 dark:border-green-600 focus:ring-green-400 dark:focus:ring-green-500"
                            : "border-red-400 dark:border-red-600 focus:ring-red-400 dark:focus:ring-red-500"
                      }`}
                    />
                    {availability.username !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1">
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
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('email_label')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                        availability.email === null
                          ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400 dark:focus:ring-blue-500"
                          : availability.email
                            ? "border-green-400 dark:border-green-600 focus:ring-green-400 dark:focus:ring-green-500"
                            : "border-red-400 dark:border-red-600 focus:ring-red-400 dark:focus:ring-red-500"
                      }`}
                    />
                    {availability.email !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1">
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
                    <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                      {t('password_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                          formData.password === "" || formData.confirmPassword === ""
                            ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400 dark:focus:ring-blue-500"
                            : passwordsMatch
                              ? "border-green-400 dark:border-green-600 focus:ring-green-400 dark:focus:ring-green-500"
                              : "border-red-400 dark:border-red-600 focus:ring-red-400 dark:focus:ring-red-500"
                        }`}
                      />
                      {formData.password !== "" && formData.confirmPassword !== "" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1">
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
                    <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                      {t('confirm_password_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                          formData.confirmPassword === "" || formData.password === ""
                            ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400 dark:focus:ring-blue-500"
                            : passwordsMatch
                              ? "border-green-400 dark:border-green-600 focus:ring-green-400 dark:focus:ring-green-500"
                              : "border-red-400 dark:border-red-600 focus:ring-red-400 dark:focus:ring-red-500"
                        }`}
                      />
                      {formData.confirmPassword !== "" && formData.password !== "" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1">
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

                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 inter">
                  {t('password_requirements')}
                </p>

                {/* Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={checkingAvailability}
                  className={`w-full text-white py-3 rounded-xl transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed inter font-medium ${
                    isStep1Complete
                      ? "bg-primary hover:bg-primary/90 shadow-md"
                      : "bg-primary/60"
                  }`}
                >
                  {checkingAvailability ? t('verifying') : t('next')}
                </button>
              </>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <>
                {/* Full Name */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('full_name_label')}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('phone_label')}
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Rol - Select personalizado */}
                <div className="mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('role_label')}
                  </label>
                  <div className="relative" ref={rolDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsRolOpen(!isRolOpen)}
                      className="w-full mt-2 px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 cursor-pointer text-left transition-all inter"
                    >
                      {getRoleLabel(formData.rol)}
                    </button>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none">
                      <svg
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isRolOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Dropdown menu */}
                    {isRolOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, rol: "particular" });
                            setIsRolOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.rol === "particular" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('role_particular')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, rol: "autonomo" });
                            setIsRolOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.rol === "autonomo" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('role_autonomo')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, rol: "gestor" });
                            setIsRolOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.rol === "gestor" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('role_gestor')}
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
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl transition-all inter font-medium"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="button"
                    onClick={nextToStep3}
                    disabled={loading}
                    className={`flex-1 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inter font-medium ${
                      isStep2Complete && !loading
                        ? "bg-primary hover:bg-primary/90 shadow-md"
                        : "bg-primary/60"
                    }`}
                  >
                    {loading ? t('registering') : (formData.rol === "autonomo" ? t('next') : t('register_button'))}
                  </button>
                </div>
              </>
            )}

            {/* PASO 3 - Solo para autónomos */}
            {step === 3 && formData.rol === "autonomo" && (
              <>
                {/* DNI */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('dni_label')}
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Birthdate */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('birthdate_label')}
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Empresa */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('empresa_label')}
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Estado Civil */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                    {t('estado_civil_label')}
                  </label>
                  <div className="relative" ref={estadoCivilDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsEstadoCivilOpen(!isEstadoCivilOpen)}
                      className="w-full mt-2 px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 cursor-pointer text-left transition-all inter"
                    >
                      {getEstadoCivilLabel(formData.estado_civil || "soltero")}
                    </button>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none">
                      <svg
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isEstadoCivilOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isEstadoCivilOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, estado_civil: "soltero" });
                            setIsEstadoCivilOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.estado_civil === "soltero" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('estado_civil_soltero')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, estado_civil: "casado" });
                            setIsEstadoCivilOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.estado_civil === "casado" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('estado_civil_casado')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, estado_civil: "divorciado" });
                            setIsEstadoCivilOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.estado_civil === "divorciado" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('estado_civil_divorciado')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, estado_civil: "viudo" });
                            setIsEstadoCivilOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                            formData.estado_civil === "viudo" ? "bg-blue-50 dark:bg-blue-900/30 text-primary" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {t('estado_civil_viudo')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Módulo IVA e IRPF - lado a lado */}
                <div className="mb-6 flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                      {t('modulo_iva_label')}
                    </label>
                    <input
                      type="number"
                      name="modulo_iva"
                      value={formData.modulo_iva}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 inter">
                      {t('irpf_label')}
                    </label>
                    <input
                      type="number"
                      name="irpf"
                      value={formData.irpf}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl transition-all inter font-medium"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inter font-medium ${
                      isStep3Complete && !loading
                        ? "bg-primary hover:bg-primary/90 shadow-md"
                        : "bg-primary/60"
                    }`}
                  >
                    {loading ? t('registering') : t('register_button')}
                  </button>
                </div>
              </>
            )}
          </form>

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
            {t('terms_text')}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6 inter">
            {t('already_registered')}{" "}
            <button
              type="button"
              onClick={handleBackOrLogin}
              className="text-primary hover:text-primary/80 font-medium hover:underline"
            >
              {t('login')}
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
            }}>
          {/* Contenido */}
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Logo arriba */}
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>
              </svg>
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

              {/* Indicadores de progreso */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className={`text-sm inter transition-colors ${step >= 1 ? 'text-black dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                    {t('step1_title')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className={`text-sm inter transition-colors ${step >= 2 ? 'text-black dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                    {t('step2_title')}
                  </span>
                </div>
                {formData.rol === "autonomo" && (
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className={`text-sm inter transition-colors ${step >= 3 ? 'text-black dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                      {t('step3_title')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Espacio para estética */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;