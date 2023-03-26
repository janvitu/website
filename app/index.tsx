import { render } from "solid-js/web";
import { CookieProvider } from "./src/context/cookieProvider";
import { App } from "./app";

document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("cookie-consent");

	render(() => {
		return (
			<CookieProvider>
				<App />
			</CookieProvider>
		);
	}, root!);
});
