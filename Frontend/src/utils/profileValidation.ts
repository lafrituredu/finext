const NUMBER_REGEX = /^\d+$/;
const REAL_NAME_HAS_NUMBER_REGEX = /\d/;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const BLOCKED_IDENTITY_DOCUMENTS = new Set([
  "00000000T",
  "00000001R",
  "11111111H",
  "12345678Z",
  "87654321X",
  "X0000000T",
  "Y0000000Z",
  "Z0000000M"
]);

const normalizeIdentityDocument = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");

const hasRepeatedDigits = (value: string) => /^(\d)\1+$/.test(value);

const hasSequentialDigits = (value: string) =>
  value.length > 0 &&
  ("0123456789".includes(value) || "9876543210".includes(value));

const hasSuspiciousIdentityNumber = (normalizedValue: string) => {
  if (BLOCKED_IDENTITY_DOCUMENTS.has(normalizedValue)) {
    return true;
  }

  const numericPart = normalizedValue.match(/^[XYZ]?(\d+)[A-Z]$/)?.[1] ?? "";

  return hasRepeatedDigits(numericPart) || hasSequentialDigits(numericPart);
};

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

  if (hasSuspiciousIdentityNumber(normalizedValue)) {
    return false;
  }

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

