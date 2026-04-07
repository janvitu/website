import { ui, defaultLocale, type Locale } from "./ui";

type Dict = Record<string, unknown>;

function lookup(dict: Dict, key: string): string | undefined {
	const parts = key.split(".");
	let cur: unknown = dict;
	for (const p of parts) {
		if (cur && typeof cur === "object" && p in (cur as Dict)) {
			cur = (cur as Dict)[p];
		} else {
			return undefined;
		}
	}
	return typeof cur === "string" ? cur : undefined;
}

export function getT(locale: string | undefined) {
	const loc = (locale && locale in ui ? locale : defaultLocale) as Locale;
	const dict = ui[loc] as Dict;
	const fallback = ui[defaultLocale] as Dict;
	return function t(key: string, fallbackText?: string): string {
		return lookup(dict, key) ?? lookup(fallback, key) ?? fallbackText ?? key;
	};
}
