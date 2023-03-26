import { createSignal, onMount, Show } from "solid-js";
import { useCookieContext } from "./src/context/cookieProvider";
import { CookieBanner } from "./src/CookieBanner";
import { CookieDialog } from "./src/CookieDialog";
import { consentData } from "./src/data/consent";
import { getCookie, setConsentCookies } from "./src/utils/Cookies";

type Data = typeof consentData;
export type LangData = Data["en"];

export const App = () => {
	const html = document.querySelector("html");
	const cookieBtn = document.getElementById("cookie-f-button");
	let lang = "en";
	if (html) lang = html.lang;

	//@ts-ignore
	const langContent: LangData = consentData[lang];

	const consetCookie = getCookie("consent") || null;
	let decodedCookie = {
		analytics_storage: false,
		ad_storage: false,
	};
	if (consetCookie) decodedCookie = JSON.parse(consetCookie);

	const consent = useCookieContext();

	consent.setState({
		analytics_storage: decodedCookie.analytics_storage,
		ad_storage: decodedCookie.ad_storage,
	});

	const [consentDialog, setConsentDialog] = createSignal(false);

	if (consetCookie) consent.setConsentFIlled(true);

	const updateConset = (adStorage: boolean, analyticsStorage: boolean) => {
		consent.setState({
			analytics_storage: analyticsStorage,
			ad_storage: adStorage,
		});
		setConsentCookies(adStorage, analyticsStorage);
		consent.setConsentFIlled(true);
		setConsentDialog(false);
	};

	const openDialog = () => {
		setConsentDialog(true);
	};

	onMount(() => {
		if (cookieBtn)
			cookieBtn.addEventListener("click", () => {
				setConsentDialog(true);
			});
	});
	return (
		<Show when={!consent.consetFilled() || consentDialog()}>
			<div class="fixed left-[8.333vw] right-[8.333vw] bottom-4 z-50 max-h-[80vh] overflow-hidden border-2 border-neutral-600 bg-white sm:left-auto">
				<div
					class={`${
						consent.consetFilled() || consentDialog() ? "hidden" : "flex"
					} flex-col p-3 sm:right-4 sm:flex-row sm:items-center`}
				>
					<CookieBanner
						content={langContent.cookieBanner}
						setConsent={updateConset}
						openDialog={openDialog}
					/>
				</div>
				<div
					class={`${
						consentDialog() ? "flex flex-col" : "hidden"
					} h-full sm:right-4`}
				>
					<CookieDialog
						content={langContent.cookieDialog}
						setConsent={updateConset}
					/>
				</div>
			</div>
		</Show>
	);
};
