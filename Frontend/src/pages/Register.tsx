import React, { useEffect, useRef, useState } from "react";
import { registerUser, checkEmail, checkUsername } from "../api/AuthServices";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Step1Form from "../components/register/Step1Form";
import Step2Form from "../components/register/Step2Form";
import Step3Form from "../components/register/Step3Form";
import RegisterHero from "../components/register/RegisterHero";

import DarkButton from "../components/buttons/DarkButton";
import Language from "../components/buttons/Lang";
import {
  getAvailabilityError,
  validateStep1,
  validateStep2,
  validateStep3,
  type RegisterFormData
} from "../utils/registerValidation";
import { buildRegisterPayload } from "../utils/registerPayload";
import { getFriendlyApiError } from "../utils/getFriendlyApiError";

type FormDataType = RegisterFormData;

const Register: React.FC = () => {
  const { t } = useTranslation("register");
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRolOpen, setIsRolOpen] = useState(false);
  const [isEstadoCivilOpen, setIsEstadoCivilOpen] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rolDropdownRef.current &&
        !rolDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRolOpen(false);
      }

      if (
        estadoCivilDropdownRef.current &&
        !estadoCivilDropdownRef.current.contains(event.target as Node)
      ) {
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
  }, [navigate]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setError("");

    if (name === "email" || name === "username") {
      setAvailability((current) => ({
        ...current,
        [name]: null
      }));
    }
  };

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    setError("");

    try {
      const [emailData, usernameData] = await Promise.all([
        checkEmail(formData.email),
        checkUsername(formData.username)
      ]);

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
      console.error("Error verifying availability:", err);

      return {
        isAvailable: false,
        emailAvailable: false,
        usernameAvailable: false,
        requestFailed: true
      };
    } finally {
      setCheckingAvailability(false);
    }
  };

  const nextStep = async () => {
    const validationError = validateStep1(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = await checkAvailability();

    if (!result.isAvailable) {
      setError(getAvailabilityError(result) ?? "Error al verificar disponibilidad");
      return;
    }

    setError("");
    setStep(2);
  };

  const nextToStep3 = () => {
    const validationError = validateStep2(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (formData.rol === "autonomo") {
      setError("");
      setStep(3);
      return;
    }

    void handleSubmit();
  };

  const prevStep = () => {
    setStep((current) => Math.max(1, current - 1));
    setError("");
  };

  const handleBackOrLogin = () => {
    if (step > 1) {
      prevStep();
      return;
    }

    navigate("/login");
  };

  const onGoToHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    if (step === 2) {
      const validationError = validateStep2(formData);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
    }

    if (step === 3 && formData.rol === "autonomo") {
      const validationError = validateStep3(formData);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
    }

    try {
      const dataToSend = buildRegisterPayload(formData);
      const data = await registerUser(dataToSend);

      if (data.token && data.user?.username) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.user.username);
      }

      navigate(
        `/verify-email?status=pending&email=${encodeURIComponent(formData.email)}`,
        {
          state: {
            message:
              data.message || "Te hemos enviado un correo para verificar tu cuenta."
          }
        }
      );
    } catch (err: any) {
      setError(getFriendlyApiError(err, "Ha ocurrido un error inesperado al registrarte."));
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";
  const isStep1Complete =
    Boolean(formData.email) &&
    Boolean(formData.password) &&
    Boolean(formData.username) &&
    Boolean(formData.confirmPassword) &&
    passwordsMatch;
  const isStep2Complete =
    Boolean(formData.full_name) && Boolean(formData.phone_number);
  const isStep3Complete =
    Boolean(formData.dni) &&
    Boolean(formData.birthdate) &&
    Boolean(formData.empresa);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "autonomo":
        return t("role_autonomo");
      case "gestor":
        return t("role_gestor");
      case "particular":
      default:
        return t("role_particular");
    }
  };

  const getEstadoCivilLabel = (estado: string) => {
    switch (estado) {
      case "casado":
        return t("estado_civil_casado");
      case "divorciado":
        return t("estado_civil_divorciado");
      case "viudo":
        return t("estado_civil_viudo");
      case "soltero":
      default:
        return t("estado_civil_soltero");
    }
  };

  return (
    <div className="min-h-screen bg-[#bfc6d6] dark:bg-dark-background flex items-center justify-center p-6">
      <div className="hidden">
        <DarkButton />
        <Language />
      </div>

      <div className="w-full max-w-6xl bg-white dark:bg-dark-card rounded-3xl shadow-lg flex overflow-hidden">
        <div className="lg:w-[45%] w-full p-10 lg:p-12">
          <button
            className="mb-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
            onClick={onGoToHome}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="mont_semibold text-3xl mb-8 text-black dark:text-white">
            {t("register_title")}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Step1Form
                formData={formData}
                handleChange={handleChange}
                availability={availability}
                passwordsMatch={passwordsMatch}
                checkingAvailability={checkingAvailability}
                nextStep={nextStep}
                isStep1Complete={isStep1Complete}
                t={t}
              />
            )}

            {step === 2 && (
              <Step2Form
                formData={formData}
                handleChange={handleChange}
                isRolOpen={isRolOpen}
                setIsRolOpen={setIsRolOpen}
                rolDropdownRef={rolDropdownRef}
                getRoleLabel={getRoleLabel}
                onRoleChange={(role) =>
                  setFormData((current) => ({ ...current, rol: role }))
                }
                prevStep={prevStep}
                nextStep={nextToStep3}
                isStep2Complete={isStep2Complete}
                loading={loading}
                t={t}
              />
            )}

            {step === 3 && formData.rol === "autonomo" && (
              <Step3Form
                formData={formData}
                handleChange={handleChange}
                isEstadoCivilOpen={isEstadoCivilOpen}
                setIsEstadoCivilOpen={setIsEstadoCivilOpen}
                estadoCivilDropdownRef={estadoCivilDropdownRef}
                getEstadoCivilLabel={getEstadoCivilLabel}
                prevStep={prevStep}
                isStep3Complete={isStep3Complete}
                loading={loading}
                t={t}
              />
            )}
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-400 dark:text-gray-500 inter">
              {t("or")}
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          <button className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-background transition-colors cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 inter">
              {t("continue_with_google")}
            </span>
          </button>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-6 inter">
            {t("terms_text")}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6 inter">
            {t("already_registered")}{" "}
            <button
              type="button"
              onClick={handleBackOrLogin}
              className="text-primary hover:text-primary/80 font-medium hover:underline cursor-pointer"
            >
              {t("login")}
            </button>
          </p>
        </div>

        <RegisterHero step={step} role={formData.rol} t={t} />
      </div>
    </div>
  );
};

export default Register;
