const PHONE_ALLOWED_CHARS_REGEX = /^\+?[0-9\s().-]+$/;
const REAL_NAME_HAS_NUMBER_REGEX = /\d/;

export const hasNumbers = (value: string) => REAL_NAME_HAS_NUMBER_REGEX.test(value);

export const isValidPhoneNumber = (value: string) => {
  const trimmedValue = value.trim();
  const digits = trimmedValue.replace(/\D/g, "");

  return (
    PHONE_ALLOWED_CHARS_REGEX.test(trimmedValue) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
};

