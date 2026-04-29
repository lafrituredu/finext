export const TipoIVA = {
  GENERAL: 21,
  REDUCIDO: 10,
  SUPERREDUCIDO: 4,
  EXENTO: 0
} as const;

export const TipoIRPF = {
  GENERAL: 15,
  NUEVO_AUTONOMO: 7,
  SIN_RETENCION: 0
} as const;

export const ivaOptions = [
  { label: "General (21%)", value: String(TipoIVA.GENERAL) },
  { label: "Reducido (10%)", value: String(TipoIVA.REDUCIDO) },
  { label: "Superreducido (4%)", value: String(TipoIVA.SUPERREDUCIDO) },
  { label: "Exento (0%)", value: String(TipoIVA.EXENTO) }
];

export const irpfOptions = [
  { label: "General (15%)", value: String(TipoIRPF.GENERAL) },
  { label: "Nuevo autonomo (7%)", value: String(TipoIRPF.NUEVO_AUTONOMO) },
  { label: "Sin retencion (0%)", value: String(TipoIRPF.SIN_RETENCION) }
];
