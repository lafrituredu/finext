import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { UserProfile } from "../../api/AuthServices";
import type { ProfileFormData, ProfileRole } from "../../pages/Profile";
import DropdownSelect from "../materials/DropdownSelect";
import { irpfOptions, ivaOptions } from "../../utils/taxOptions";
import GearIcon from "/src/assets/icons/Gear.svg?react";

const roleOptions: ProfileRole[] = ["particular", "autonomo", "gestor"];

const inputClass =
  "w-full mt-2 px-4 py-3 rounded-xl border border-[#0000001a] dark:border-[#1d2344] bg-white dark:bg-[#070d22] text-black dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary transition-all";
const labelClass = "text-sm text-[#7B7B7B] dark:text-dark-text inter";

type ProfileFormProps = {
  form: ProfileFormData;
  user: UserProfile | null;
  saving: boolean;
  message: string;
  error: string;
  roleLabel: (role: ProfileRole) => string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFieldChange: (name: string, value: string) => void;
  onRoleChange: (role: ProfileRole) => void;
};

function ProfileForm({
  form,
  user,
  saving,
  message,
  error,
  roleLabel,
  onSubmit,
  onChange,
  onFieldChange,
  onRoleChange
}: ProfileFormProps) {
  const { t } = useTranslation("profile");

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
            name="full_name"
            value={form.full_name}
            onChange={onChange}
            required
          />
        </label>

        <label className={labelClass}>
          {t("username")}
          <input
            className={inputClass}
            name="username"
            value={form.username}
            disabled
            required
          />
        </label>

        <label className={labelClass}>
          {t("email")}
          <input
            className={`${inputClass} opacity-70`}
            value={user?.email ?? ""}
            disabled
          />
        </label>

        <label className={labelClass}>
          {t("phone")}
          <input
            className={inputClass}
            name="phone_number"
            value={form.phone_number}
            onChange={onChange}
          />
        </label>
      </div>

      <div className="mt-7">
        <p className={labelClass}>{t("role")}</p>
        <div className="mt-2 bg-[#EFEFEF] dark:bg-[#070d22] w-fit px-2 py-1 rounded-3xl flex flex-wrap items-center gap-2 border border-[#0000001a] dark:border-[#1d2344] montserrat">
          {roleOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1 rounded-2xl transition-all cursor-pointer ${
                form.rol === role
                  ? "bg-white dark:bg-[#1a2957] text-black dark:text-dark-text"
                  : "text-[#7B7B7B] dark:text-dark-text"
              }`}
            >
              {roleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {form.rol === "autonomo" && (
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
                name="dni"
                value={form.dni}
                onChange={onChange}
                required
              />
            </label>

            <label className={labelClass}>
              {t("birth_date")}
              <input
                className={inputClass}
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={onChange}
              />
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
            </label>

            <label className={labelClass}>
              {t("civil_state")}
              <select
                className={inputClass}
                name="civil_state"
                value={form.civil_state}
                onChange={onChange}
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
                name="company"
                value={form.company}
                onChange={onChange}
                required
              />
            </label>
          </div>
        </div>
      )}
    </form>
  );
}

export default ProfileForm;
