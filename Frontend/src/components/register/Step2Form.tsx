import React from "react";

type FormDataType = {
  full_name: string;
  phone_number: string;
  rol: string;
};

type Props = {
  formData: FormDataType;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => void;
  isRolOpen: boolean;
  setIsRolOpen: (value: boolean) => void;
  rolDropdownRef: React.RefObject<HTMLDivElement | null>;
  getRoleLabel: (role: string) => string;
  onRoleChange: (role: string) => void;
  prevStep: () => void;
  nextStep: () => void;
  isStep2Complete: boolean;
  loading: boolean;
  t: (key: string) => string;
};

const Step2Form: React.FC<Props> = ({
  formData,
  handleChange,
  isRolOpen,
  setIsRolOpen,
  rolDropdownRef,
  getRoleLabel,
  onRoleChange,
  prevStep,
  nextStep,
  isStep2Complete,
  loading,
  t
}) => {
  return (
    <>
      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("full_name_label")}
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("phone_label")}
        </label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("role_label")}
        </label>
        <div className="relative" ref={rolDropdownRef}>
          <button
            type="button"
            onClick={() => setIsRolOpen(!isRolOpen)}
            className="w-full mt-2 px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-left transition-all inter cursor-pointer"
          >
            {getRoleLabel(formData.rol)}
          </button>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isRolOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isRolOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden">
              {["particular", "autonomo", "gestor"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onRoleChange(role);
                    setIsRolOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                    formData.rol === role
                      ? "bg-blue-50 dark:bg-blue-900/30 text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {getRoleLabel(role)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl transition-all inter font-medium cursor-pointer"
        >
          {t("back")}
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={loading}
          className={`flex-1 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inter font-medium cursor-pointer ${
            isStep2Complete && !loading ? "bg-primary hover:bg-primary/90 shadow-md" : "bg-primary/60"
          }`}
        >
          {loading
            ? t("registering")
            : formData.rol === "autonomo"
            ? t("next")
            : t("register_button")}
        </button>
      </div>
    </>
  );
};

export default Step2Form;
