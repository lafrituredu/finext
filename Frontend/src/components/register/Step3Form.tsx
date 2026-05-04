import React from "react";

type FormDataType = {
  dni: string;
  birthdate: string;
  empresa: string;
  estado_civil: string;
};

type Props = {
  formData: FormDataType;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => void;
  isEstadoCivilOpen: boolean;
  setIsEstadoCivilOpen: (value: boolean) => void;
  estadoCivilDropdownRef: React.RefObject<HTMLDivElement | null>;
  getEstadoCivilLabel: (estado: string) => string;
  prevStep: () => void;
  isStep3Complete: boolean;
  loading: boolean;
  t: (key: string) => string;
};

const Step3Form: React.FC<Props> = ({
  formData,
  handleChange,
  isEstadoCivilOpen,
  setIsEstadoCivilOpen,
  estadoCivilDropdownRef,
  getEstadoCivilLabel,
  prevStep,
  isStep3Complete,
  loading,
  t
}) => {
  const maxBirthdate = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("dni_label")}
        </label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("birthdate_label")}
        </label>
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          max={maxBirthdate}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("empresa_label")}
        </label>
        <input
          type="text"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-400 inter">
          {t("estado_civil_label")}
        </label>

        <div className="relative" ref={estadoCivilDropdownRef}>
          <button
            type="button"
            onClick={() => setIsEstadoCivilOpen(!isEstadoCivilOpen)}
            className="w-full mt-2 px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-left transition-all inter"
          >
            {getEstadoCivilLabel(formData.estado_civil)}
          </button>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isEstadoCivilOpen ? "rotate-180" : ""
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

          {isEstadoCivilOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden">
              {["soltero", "casado", "divorciado", "viudo"].map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => {
                    handleChange({ target: { name: "estado_civil", value: estado } });
                    setIsEstadoCivilOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                    formData.estado_civil === estado
                      ? "bg-blue-50 dark:bg-blue-900/30 text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {getEstadoCivilLabel(estado)}
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
          type="submit"
          disabled={loading}
          className={`flex-1 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inter font-medium cursor-pointer ${
            isStep3Complete && !loading ? "bg-primary hover:bg-primary/90 shadow-md" : "bg-primary/60"
          }`}
        >
          {loading ? t("registering") : t("register_button")}
        </button>
      </div>
    </>
  );
};

export default Step3Form;
