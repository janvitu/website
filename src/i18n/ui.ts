import en from "./en.json";
import cs from "./cs.json";

export const ui = { en, cs } as const;
export type Locale = keyof typeof ui;
export const defaultLocale: Locale = "en";
export const enabledLocales: Locale[] = ["en"]; // czech reserved, not yet routed
