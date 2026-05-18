import type {
  UpdateUserProfilePayload,
  UserProfile
} from "../api/AuthServices";
import type { ProfileFormData } from "../pages/Profile";

const normalizeTaxValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? "" : String(numericValue);
};

export const emptyProfileForm: ProfileFormData = {
  username: "",
  full_name: "",
  phone_number: "",
  rol: "particular",
  dni: "",
  birth_date: "",
  modulo_iva: "",
  civil_state: "soltero",
  company: "",
  irpf: ""
};

export const userToProfileForm = (user: UserProfile): ProfileFormData => ({
  username: user.username ?? "",
  full_name: user.full_name ?? "",
  phone_number: user.phone_number ?? "",
  rol: user.rol ?? "particular",
  dni: user.autonomo?.dni ?? "",
  birth_date: user.autonomo?.birth_date ?? "",
  modulo_iva: normalizeTaxValue(user.autonomo?.modulo_iva),
  civil_state: user.autonomo?.civil_state ?? "soltero",
  company: user.autonomo?.company ?? "",
  irpf: normalizeTaxValue(user.autonomo?.irpf)
});

export const profileFormToPayload = (
  form: ProfileFormData
): UpdateUserProfilePayload => {
  const payload: UpdateUserProfilePayload = {
    username: form.username.trim(),
    full_name: form.full_name.trim(),
    phone_number: form.phone_number.trim()
  };

  if (form.rol === "autonomo") {
    if (form.dni.trim()) {
      payload.dni = form.dni.trim();
    }
    payload.birth_date = form.birth_date;
    payload.modulo_iva = form.modulo_iva;
    payload.civil_state = form.civil_state;
    payload.company = form.company.trim();
    payload.irpf = form.irpf;
  }

  return payload;
};
