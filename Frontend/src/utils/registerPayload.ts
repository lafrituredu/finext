import type { RegisterFormData } from "./registerValidation";

export type RegisterPayload = Omit<RegisterFormData, "confirmPassword">;

export const buildRegisterPayload = (
  formData: RegisterFormData
): RegisterPayload => {
  // El formulario trabaja con confirmPassword para la vista, pero el backend
  // no lo necesita. Aqui se crea solo el contrato que espera /api/register.
  const payload: RegisterPayload = {
    email: formData.email,
    password: formData.password,
    username: formData.username,
    full_name: formData.full_name,
    phone_number: formData.phone_number,
    rol: formData.rol,
    dni: "",
    birthdate: "",
    modulo_iva: "",
    estado_civil: "",
    empresa: "",
    irpf: "",
    google_setup_token: formData.google_setup_token
  };

  // Los campos fiscales solo viajan cuando el usuario se registra como autonomo.
  // Para particulares se dejan vacios y Laravel no los exige.
  if (formData.rol === "autonomo") {
    payload.dni = formData.dni;
    payload.birthdate = formData.birthdate;
    payload.modulo_iva = formData.modulo_iva;
    payload.estado_civil = formData.estado_civil;
    payload.empresa = formData.empresa;
    payload.irpf = formData.irpf;
  }

  return payload;
};
