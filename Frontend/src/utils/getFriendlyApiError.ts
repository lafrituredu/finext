const TECHNICAL_ERROR_PATTERNS = [
  "SQLSTATE",
  "PDOException",
  "QueryException",
  "Stack trace",
  "at line",
  "select *",
  "insert into",
  "update `",
  "delete from",
  "127.0.0.1",
  "localhost",
  "C:\\",
  "<html",
  "<!doctype",
];

const looksTechnical = (message: string) =>
  TECHNICAL_ERROR_PATTERNS.some((pattern) =>
    message.toLowerCase().includes(pattern.toLowerCase())
  );

export const getFriendlyApiError = (error: any, fallback: string) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (typeof message !== "string" || !message.trim()) {
    return fallback;
  }

  if (status >= 500 || looksTechnical(message)) {
    return fallback;
  }

  return message;
};
