import { coppyContent } from "./utils";

document.addEventListener("DOMContentLoaded", () => {
	const copyElement = document.getElementById("copyitem");
	if (copyElement) copyElement.addEventListener("click", coppyContent);
});
