import { useTranslation } from "react-i18next";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { UserProfile } from "../../api/AuthServices";
import type { ProfileFormData, ProfileRole } from "../../pages/Profile";
import DropdownSelect from "../materials/DropdownSelect";
import { irpfOptions, ivaOptions } from "../../utils/taxOptions";
import {
  hasNumbers,
  isValidPhoneNumber,
  isValidSpanishDniNie
} from "../../utils/profileValidation";
import GearIcon from "/src/assets/icons/Gear.svg?react";
import PadlockIcon from "/src/assets/icons/Padlock.svg?react";

const inputClass =
  "w-full mt-2 px-4 py-3 rounded-xl border border-[#0000001a] dark:border-[#1d2344] bg-white dark:bg-[#070d22] text-black dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary transition-all";
const labelClass = "text-sm text-[#7B7B7B] dark:text-dark-text inter";
const errorClass = "mt-1 text-xs text-red-500";

type ProfileFormProps = {
  form: ProfileFormData;
  user: UserProfile | null;
  saving: boolean;
  message: string;
  error: string;
  roleLabel: (role: ProfileRole) => string;
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  onSubmit: () => void;
  onFieldChange: (name: string, value: string) => void;
};

function ProfileForm({
  form,
  user,
  saving,
  message,
  error,
  roleLabel,
  register,
  errors,
  onSubmit,
  onFieldChange
}: ProfileFormProps) {
  const { t } = useTranslation("profile");
  const isAutonomo = form.rol === "autonomo";
  const fullNameField = register("full_name", {
    required: "El nombre completo es obligatorio.",
    minLength: {
      value: 3,
      message: "El nombre debe tener al menos 3 caracteres."
    },
    maxLength: {
      value: 50,
      message: "El nombre no puede superar 50 caracteres."
    },
    validate: (value) =>
      !hasNumbers(value) || "El nombre no puede contener numeros."
  });
  const phoneField = register("phone_number", {
    validate: (value) =>
      !value ||
      isValidPhoneNumber(value) ||
      "El telefono debe contener solo numeros y tener entre 9 y 15 digitos."
  });
  const dniField = register("dni", {
    required: "El DNI o NIE es obligatorio.",
    validate: (value) =>
      isValidSpanishDniNie(value) || "El DNI o NIE no tiene un formato valido."
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#F9F9FA] dark:bg-dark-card border border-[#0000001a] dark:border-[#1d2344] rounded-2xl p-7"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="montserrat font-semibold flex items-center gap-2">
          <GearIcon className="size-6" />
          {t("profile_info")}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inter w-full sm:w-48 h-10 bg-primary text-white rounded-full cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-500">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-500">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <label className={labelClass}>
          {t("full_name")}
          <input
            className={inputClass}
            {...fullNameField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/\d/g, "");
              fullNameField.onChange(event);
            }}
          />
          {errors.full_name && (
            <p className={errorClass}>{errors.full_name.message}</p>
          )}
        </label>

        <label className={labelClass}>
          {t("username")}
          <div className="relative">
            <input
              className={`${inputClass} pr-11 bg-[#ECEFF4] text-[#6B7280] border-[#D7DBE4] cursor-not-allowed select-none dark:bg-[#091126] dark:text-[#7F8AA9] dark:border-[#1d2344]`}
              readOnly
              aria-readonly="true"
              tabIndex={-1}
              {...register("username", {
                required: "El usuario es obligatorio."
              })}
            />
            <PadlockIcon className="absolute right-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-[#7B7B7B] dark:text-[#7F8AA9]" />
          </div>
          <p className="mt-1 text-xs text-[#7B7B7B] dark:text-dark-text">
            {t("username_locked_hint")}
          </p>
        </label>

        <label className={labelClass}>
          {t("email")}
          <div className="relative">
            <input
              className={`${inputClass} pr-11 bg-[#ECEFF4] text-[#6B7280] border-[#D7DBE4] cursor-not-allowed select-none dark:bg-[#091126] dark:text-[#7F8AA9] dark:border-[#1d2344]`}
              value={user?.email ?? ""}
              readOnly
              aria-readonly="true"
              tabIndex={-1}
            />
            <PadlockIcon className="absolute right-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-[#7B7B7B] dark:text-[#7F8AA9]" />
          </div>
          <p className="mt-1 text-xs text-[#7B7B7B] dark:text-dark-text">
            {t("email_locked_hint")}
          </p>
        </label>

        <label className={labelClass}>
          {t("phone")}
          <input
            className={inputClass}
            inputMode="numeric"
            {...phoneField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/\D/g, "");
              phoneField.onChange(event);
            }}
          />
          {errors.phone_number && (
            <p className={errorClass}>{errors.phone_number.message}</p>
          )}
        </label>
      </div>

      <div className="mt-7">
        <p className={labelClass}>{t("role")}</p>
        <p className="mt-2 inline-flex rounded-full bg-[#84A2EB33] text-primary px-3 py-1 text-sm montserrat">
          {roleLabel(form.rol)}
        </p>
      </div>

      {isAutonomo && (
        <div className="mt-8 pt-7 border-t border-[#0000001a] dark:border-[#1d2344]">
          <p className="montserrat font-semibold">{t("tax_info")}</p>
          <p className="text-[#7B7B7B] dark:text-dark-text mb-5">
            {t("tax_hint")}
          </p>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <label className={labelClass}>
              {t("dni")}
              <input
                className={inputClass}
                {...dniField}
                onChange={(event) => {
                  event.target.value = event.target.value
                    .toUpperCase()
                    .replace(/\s/g, "");
                  dniField.onChange(event);
                }}
              />
              {errors.dni && <p className={errorClass}>{errors.dni.message}</p>}
            </label>

            <label className={labelClass}>
              {t("birth_date")}
              <input
                className={inputClass}
                type="date"
                {...register("birth_date", {
                  required: "La fecha de nacimiento es obligatoria.",
                  validate: (value) => {
                    if (!value) return "La fecha de nacimiento es obligatoria.";
                    return (
                      new Date(value) <= new Date() ||
                      "La fecha de nacimiento no puede ser futura."
                    );
                  }
                })}
              />
              {errors.birth_date && (
                <p className={errorClass}>{errors.birth_date.message}</p>
              )}
            </label>

            <label className={labelClass}>
              {t("modulo_iva")}
              <DropdownSelect
                name="modulo_iva"
                value={form.modulo_iva}
                placeholder={t("select_option")}
                options={ivaOptions}
                onChange={onFieldChange}
                buttonClassName={inputClass}
              />
              <input
                type="hidden"
                {...register("modulo_iva", {
                  required: "Selecciona un tipo de IVA."
                })}
              />
              {errors.modulo_iva && (
                <p className={errorClass}>{errors.modulo_iva.message}</p>
              )}
            </label>

            <label className={labelClass}>
              {t("irpf")}
              <DropdownSelect
                name="irpf"
                value={form.irpf}
                placeholder={t("select_option")}
                options={irpfOptions}
                onChange={onFieldChange}
                buttonClassName={inputClass}
              />
              <input
                type="hidden"
                {...register("irpf", {
                  required: "Selecciona un tipo de IRPF."
                })}
              />
              {errors.irpf && (
                <p className={errorClass}>{errors.irpf.message}</p>
              )}
            </label>

            <label className={labelClass}>
              {t("civil_state")}
              <select
                className={inputClass}
                {...register("civil_state")}
              >
                <option value="soltero">{t("civil_single")}</option>
                <option value="casado">{t("civil_married")}</option>
                <option value="divorciado">{t("civil_divorced")}</option>
                <option value="separado">{t("civil_separated")}</option>
                <option value="viudo">{t("civil_widowed")}</option>
                <option value="pareja_de_hecho">{t("civil_partner")}</option>
              </select>
            </label>

            <label className={labelClass}>
              {t("company")}
              <input
                className={inputClass}
                {...register("company", {
                  required: "La empresa es obligatoria.",
                  minLength: {
                    value: 2,
                    message: "La empresa debe tener al menos 2 caracteres."
                  }
                })}
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </label>
          </div>
        </div>
      )}
    </form>
  );
}

export default ProfileForm;
