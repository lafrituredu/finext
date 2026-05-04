const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_REGEX = /^\d+$/;
const REAL_NAME_HAS_NUMBER_REGEX = /\d/;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

const normalizeIdentityDocument = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");

const isValidSpanishDniNie = (value: string) => {
  const normalizedValue = normalizeIdentityDocument(value);
  const nieMatch = normalizedValue.match(/^([XYZ])(\d{7})([A-Z])$/);
  const dniMatch = normalizedValue.match(/^(\d{8})([A-Z])$/);

  if (dniMatch) {
    const [, numbers, letter] = dniMatch;
    return DNI_LETTERS[Number(numbers) % 23] === letter;
  }

  if (nieMatch) {
    const [, prefix, numbers, letter] = nieMatch;
    const prefixMap: Record<string, string> = {
      X: "0",
      Y: "1",
      Z: "2"
    };
    const fullNumber = `${prefixMap[prefix]}${numbers}`;
    return DNI_LETTERS[Number(fullNumber) % 23] === letter;
  }

  return false;
};

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name: string;
  phone_number: string;
  rol: string;
  dni: string;
  birthdate: string;
  modulo_iva: string;
  estado_civil: string;
  empresa: string;
  irpf: string;
};

export type AvailabilityResult = {
  isAvailable: boolean;
  emailAvailable: boolean;
  usernameAvailable: boolean;
  requestFailed?: boolean;
};

export const validateStep1 = (formData: RegisterFormData) => {
  const username = formData.username.trim();
  const email = formData.email.trim();
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  if (!username) {
    return "Escribe un nombre de usuario para continuar.";
  }

  if (username.length < 3 || username.length > 20) {
    return `La longitud del nombre de usuario debe estar entre ${
      username.length > 20 ? 4 : 3
    } y 20 caracteres.`;
  }

  if (!email) {
    return "Escribe tu correo electrónico.";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "El email no tiene el formato esperado.";
  }

  if (!password) {
    return "Escribe una contraseña.";
  }

  if (password.length < 8 || password.length > 20) {
    return "La contraseña debe tener entre 8 y 20 caracteres.";
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return "La contraseña debe incluir al menos un carácter especial.";
  }

  if (!confirmPassword) {
    return "Repite la contraseña para continuar.";
  }

  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return null;
};

export const validateStep2 = (formData: RegisterFormData) => {
  const fullName = formData.full_name.trim();
  const phoneNumber = formData.phone_number.trim();

  if (!fullName) {
    return "Escribe tu nombre y apellidos.";
  }

  if (REAL_NAME_HAS_NUMBER_REGEX.test(fullName)) {
    return "El nombre completo no puede contener números.";
  }

  if (fullName.length < 3 || fullName.length > 50) {
    return "La longitud del nombre completo debe estar entre 3 y 50 caracteres.";
  }

  if (!phoneNumber) {
    return "Escribe un número de teléfono.";
  }

  if (!NUMBER_REGEX.test(phoneNumber)) {
    return "El teléfono solo puede contener números.";
  }

  return null;
};

export const validateStep3 = (formData: RegisterFormData) => {
  const dni = formData.dni.trim();

  if (!dni) {
    return "Escribe tu DNI o NIE.";
  }

  if (!isValidSpanishDniNie(dni)) {
    return "El DNI o NIE no tiene un formato válido.";
  }

  if (!formData.birthdate) {
    return "Selecciona tu fecha de nacimiento.";
  }

  if (!formData.empresa.trim()) {
    return "Escribe el nombre de la empresa.";
  }

  return null;
};

export const getAvailabilityError = (availability: AvailabilityResult) => {
  if (availability.isAvailable) {
    return null;
  }

  if (availability.requestFailed) {
    return "Error al verificar disponibilidad";
  }

  if (!availability.usernameAvailable) {
    return "Ese nombre de usuario ya está en uso.";
  }

  if (!availability.emailAvailable) {
    return "Ese correo electrónico ya está en uso.";
  }

  return "No hemos podido verificar la disponibilidad ahora mismo.";
};
