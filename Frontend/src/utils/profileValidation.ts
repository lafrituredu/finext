const NUMBER_REGEX = /^\d+$/;
const REAL_NAME_HAS_NUMBER_REGEX = /\d/;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

const normalizeIdentityDocument = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");

export const hasNumbers = (value: string) => REAL_NAME_HAS_NUMBER_REGEX.test(value);

export const isValidPhoneNumber = (value: string) => {
  const trimmedValue = value.trim();
  return (
    NUMBER_REGEX.test(trimmedValue) &&
    trimmedValue.length >= 9 &&
    trimmedValue.length <= 15
  );
};

export const isValidSpanishDniNie = (value: string) => {
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

