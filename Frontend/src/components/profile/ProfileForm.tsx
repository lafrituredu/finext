import { useTranslation } from "react-i18next";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { UserProfile } from "../../api/AuthServices";
import type { ProfileFormData, ProfileRole } from "../../pages/Profile";
import DropdownSelect from "../materials/DropdownSelect";
import { ivaOptions } from "../../utils/taxOptions";
import { hasNumbers, isValidPhoneNumber } from "../../utils/profileValidation";
import GearIcon from "/src/assets/icons/Gear.svg?react";
import PadlockIcon from "/src/assets/icons/Padlock.svg?react";

const inputClass =
  "w-full mt-2 px-4 py-3 rounded-xl border border-[#0000001a] dark:border-[#1d2344] bg-white dark:bg-[#070d22] text-black dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary transition-all";
const labelClass = "text-sm text-[#7B7B7B] dark:text-dark-text inter";
const errorClass = "mt-1 text-xs text-red-500";

const sanitizeFullNameInput = (value: string) => value.replace(/\d/g, "");

// Keep only characters that can be used in a phone number.
const sanitizePhoneInput = (value: string) =>
  value.replace(/[^\d+\s().-]/g, "").replace(/(?!^)\+/g, "");

// Tax numbers can have a maximum of two decimals.
const hasMaxTwoDecimals = (value: string) => /^\d+(\.\d{1,2})?$/.test(value);

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
  onFieldChange: (name: keyof ProfileFormData, value: string) => void;
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
  // Autonomo users have extra tax fields.
  const isAutonomo = form.rol === "autonomo";
  const civilStateOptions = [
    { value: "soltero", label: t("civil_single") },
    { value: "casado", label: t("civil_married") },
    { value: "divorciado", label: t("civil_divorced") },
    { value: "separado", label: t("civil_separated") },
    { value: "viudo", label: t("civil_widowed") },
    { value: "pareja_de_hecho", label: t("civil_partner") }
  ];
  const fullNameField = register("full_name", {
    // Full name is required and cannot contain numbers.
    required: t("validation.full_name_required"),
    minLength: {
      value: 3,
      message: t("validation.full_name_min")
    },
    maxLength: {
      value: 50,
      message: t("validation.full_name_max")
    },
    validate: (value) =>
      !hasNumbers(value) || t("validation.full_name_no_numbers")
  });
  const phoneField = register("phone_number", {
    // Phone number is required and must have a valid format.
    required: t("validation.phone_required"),
    validate: (value) =>
      isValidPhoneNumber(value) ||
      t("validation.phone_format")
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
        // Success message after saving profile changes.
        <div className="mb-5 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-500">
          {message}
        </div>
      )}

      {error && (
        // Error message from validation or backend.
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
            value={form.full_name}
            onChange={(event) => {
              onFieldChange("full_name", sanitizeFullNameInput(event.target.value));
            }}
          />
          {errors.full_name && (
            <p className={errorClass}>{errors.full_name.message}</p>
          )}
        </label>

        <label className={labelClass}>
          {t("username")}
          <div className="relative">
            {/* Username is locked and cannot be changed here. */}
            <input
              className={`${inputClass} pr-11 bg-[#ECEFF4] text-[#6B7280] border-[#D7DBE4] cursor-not-allowed select-none dark:bg-[#091126] dark:text-[#7F8AA9] dark:border-[#1d2344]`}
              readOnly
              aria-readonly="true"
              tabIndex={-1}
              {...register("username", {
                required: t("validation.username_required")
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
            {/* Email is locked because it is used for login and verification. */}
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
            inputMode="tel"
            {...phoneField}
            value={form.phone_number}
            onChange={(event) => {
              onFieldChange("phone_number", sanitizePhoneInput(event.target.value));
            }}
          />
          {errors.phone_number && (
            <p className={errorClass}>{errors.phone_number.message}</p>
          )}
          {!errors.phone_number && (
            <p className="mt-1 text-xs text-[#7B7B7B] dark:text-dark-text">
              {t("phone_hint")}
            </p>
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
        // Tax section is only shown for autonomo users.
        <div className="mt-8 pt-7 border-t border-[#0000001a] dark:border-[#1d2344]">
          <p className="montserrat font-semibold">{t("tax_info")}</p>
          <p className="text-[#7B7B7B] dark:text-dark-text mb-5">
            {t("tax_hint")}
          </p>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <label className={labelClass}>
              {t("birth_date")}
              <input
                className={inputClass}
                type="date"
                {...register("birth_date", {
                  required: t("validation.birth_date_required"),
                  validate: (value) => {
                    if (!value) return t("validation.birth_date_required");
                    return (
                      new Date(value) <= new Date() ||
                      t("validation.birth_date_future")
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
                  required: t("validation.iva_required")
                })}
              />
              {errors.modulo_iva && (
                <p className={errorClass}>{errors.modulo_iva.message}</p>
              )}
            </label>

            <label className={labelClass}>
              {t("irpf")}
              <input
                className={inputClass}
                type="number"
                inputMode="decimal"
                min={0}
                max={60}
                step={0.01}
                {...register("irpf", {
                  required: t("validation.irpf_required"),
                  min: {
                    value: 0,
                    message: t("validation.irpf_range")
                  },
                  max: {
                    value: 60,
                    message: t("validation.irpf_range")
                  },
                  validate: (value) =>
                    hasMaxTwoDecimals(value) || t("validation.irpf_decimals")
                })}
              />
              {errors.irpf && (
                <p className={errorClass}>{errors.irpf.message}</p>
              )}
            </label>

            <label className={labelClass}>
              {t("civil_state")}
              <DropdownSelect
                name="civil_state"
                value={form.civil_state}
                placeholder={t("select_option")}
                options={civilStateOptions}
                onChange={onFieldChange}
                buttonClassName={inputClass}
              />
              <input type="hidden" {...register("civil_state")} />
            </label>

            <label className={labelClass}>
              {t("company")}
              <input
                className={inputClass}
                {...register("company", {
                  required: t("validation.company_required"),
                  minLength: {
                    value: 2,
                    message: t("validation.company_min")
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
