import React from "react";

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availability: {
    email: boolean | null;
    username: boolean | null;
  };
  passwordsMatch: boolean;
  checkingAvailability: boolean;
  nextStep: () => void;
  isStep1Complete: boolean;
  t: (key: string) => string;
};

const Step1Form: React.FC<Props> = ({
  formData,
  handleChange,
  availability,
  passwordsMatch,
  checkingAvailability,
  nextStep,
  isStep1Complete,
  t
}) => {
  // Step 1 asks for account login data.
  // It also shows if email, username, and passwords are valid.
  return (
    <>
      {/* Username field with availability status. */}
      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("username_label")}
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
              availability.username === null
                ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                : availability.username
                ? "border-green-400 focus:ring-green-400"
                : "border-red-400 focus:ring-red-400"
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

      {/* Email field with availability status. */}
      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("email_label")}
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
              availability.email === null
                ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                : availability.email
                ? "border-green-400 focus:ring-green-400"
                : "border-red-400 focus:ring-red-400"
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

      {/* Password and confirm password fields. */}
      <div className="mb-2 flex gap-3">
        {/* Main password. */}
        <div className="flex-1">
          <label className="text-sm text-gray-600 dark:text-gray-400 inter">
            {t("password_label")}
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                formData.password === "" || formData.confirmPassword === ""
                  ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                  : passwordsMatch
                  ? "border-green-400 focus:ring-green-400"
                  : "border-red-400 focus:ring-red-400"
              }`}
            />
          </div>
        </div>

        {/* Repeated password. It must match the first one. */}
        <div className="flex-1">
          <label className="text-sm text-gray-600 dark:text-gray-400 inter">
            {t("confirm_password_label")}
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white dark:bg-dark-background text-black dark:text-white transition-all ${
                formData.confirmPassword === "" || formData.password === ""
                  ? "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                  : passwordsMatch
                  ? "border-green-400 focus:ring-green-400"
                  : "border-red-400 focus:ring-red-400"
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
        {t("password_requirements")}
      </p>

      {/* Go to the next step after validation. */}
      <button
        type="button"
        onClick={nextStep}
        disabled={checkingAvailability}
        className={`w-full text-white py-3 rounded-xl transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed inter font-medium cursor-pointer ${
          isStep1Complete
            ? "bg-primary hover:bg-primary/90 shadow-md"
            : "bg-primary/60"
        }`}
      >
        {checkingAvailability ? t("verifying") : t("next")}
      </button>
    </>
  );
};

export default Step1Form;
