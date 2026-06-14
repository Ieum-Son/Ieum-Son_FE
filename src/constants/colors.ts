export const colors = {
  primary50: "#EDF8FE",
  primary100: "#CEEBFF",
  primary200: "#9CD8FF",
  primary300: "#65BCEE",
  primary400: "#3EA5E3",
  primary500: "#1C8DD3",
  primary600: "#1273AE",
  primary700: "#0B588B",
  primary800: "#063F65",
  primary900: "#012542",

  neutral0: "#FFFFFF",
  neutral50: "#F8F9FA",
  neutral100: "#F1F3F5",
  neutral200: "#E9ECEF",
  neutral300: "#DEE2E6",
  neutral400: "#CED4DA",
  neutral500: "#ADB5BD",
  neutral600: "#868E96",
  neutral700: "#495057",
  neutral800: "#343A40",
  neutral900: "#212529",
  neutral1000: "#000000",

  successGreen: "#2E7D52",
  warningAmber: "#F59E0B",
  errorRed: "#DC2626",
  infoBlue: "#7AB6D9",
} as const;

export type ColorsType = typeof colors;
