import type {
  UpdateUserProfilePayload,
  UserProfile
} from "../api/AuthServices";
import type { ProfileFormData } from "../pages/Profile";

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
  modulo_iva: String(user.autonomo?.modulo_iva ?? ""),
  civil_state: user.autonomo?.civil_state ?? "soltero",
  company: user.autonomo?.company ?? "",
  irpf: String(user.autonomo?.irpf ?? "")
});

export const profileFormToPayload = (
  form: ProfileFormData
): UpdateUserProfilePayload => {
  const payload: UpdateUserProfilePayload = {
    username: form.username.trim(),
    full_name: form.full_name.trim(),
    phone_number: form.phone_number.trim(),
    rol: form.rol
  };

  if (form.rol === "autonomo") {
    payload.dni = form.dni.trim();
    payload.birth_date = form.birth_date;
    payload.modulo_iva = form.modulo_iva;
    payload.civil_state = form.civil_state;
    payload.company = form.company.trim();
    payload.irpf = form.irpf;
  }

  return payload;
};
