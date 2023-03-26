import { createSignal, onMount } from "solid-js";
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
	const [consetFilled, setConsentFIlled] = createSignal(!!consetCookie);

	const updateConset = (adStorage: boolean, analyticsStorage: boolean) => {
		consent.setState({
			analytics_storage: analyticsStorage,
			ad_storage: adStorage,
		});
		setConsentCookies(adStorage, analyticsStorage);
		setConsentFIlled(true);
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
		<div class="fixed left-[8.333vw] right-[8.333vw] bottom-4 max-h-[80vh] border-2 border-neutral-600 bg-white sm:left-auto">
			<div
				class={`${
					consetFilled() || consentDialog() ? "hidden" : "flex"
				} flex-col p-3 sm:right-4 sm:flex-row sm:items-center`}
			>
				<CookieBanner
					content={langContent.cookieBanner}
					setConsent={updateConset}
					openDialog={openDialog}
				/>
			</div>
			<div
				class={`${consentDialog() ? "block" : "hidden"} px-3 pb-3 sm:right-4 `}
			>
				<CookieDialog
					content={langContent.cookieDialog}
					consent={consent}
					setConsent={updateConset}
				/>
			</div>
		</div>
	);
};