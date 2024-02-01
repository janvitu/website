type DecodedCokkie = {
	ad_storage: string | boolean;
	analytics_storage: string | boolean;
};

export const setCookie = (
	cookieName: string,
	cookieValue: string,
	expirationDays: number,
) => {
	const date = new Date();
	date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
	const expires = "expires=" + date.toUTCString();
	document.cookie = `${cookieName}=${cookieValue};${expires};SameSite=Strict;path=/`;
};

export const getCookie = (cookieName: string) => {
	const name = cookieName + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie
		.split(";")
		.map((cookie) => cookie.split(" ").join(""));
	const cookie = cookieArray
		.find((c) => c.indexOf(name) == 0)
		?.substring(name.length);

	return cookie;
};

export const setConsentCookies = (adStorage: boolean, analStorage: boolean) => {
	setCookie(
		"consent",
		JSON.stringify({
			ad_storage: adStorage,
			analytics_storage: analStorage,
		}),
		180,
	);

	// @ts-ignore
	gtag("consent", {
		ad_storage: adStorage ? "granted" : "denied",
		analytics_storage: analStorage ? "granted" : "denied",
	});
};
