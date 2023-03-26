//@ts-nocheck
import {
	Accessor,
	createContext,
	createSignal,
	Setter,
	useContext,
} from "solid-js";

type consentType = {
	analytics_storage: boolean;
	ad_storage: boolean;
};

type consentContextType = {
	state: Accessor<consentType>;
	setState: Setter<consentType>;
};

export const CookieContext = createContext<consentContextType>();

export function CookieProvider(props) {
	const [state, setState] = createSignal({
		analytics_storage: false,
		ad_storage: false,
	});
	const store: consentContextType = { state, setState };

	return (
		<CookieContext.Provider value={store}>
			{props.children}
		</CookieContext.Provider>
	);
}

export function useCookieContext(): consentContextType {
	const context = useContext(CookieContext);

	if (!context) {
		throw new Error("useCookieContext: cannot find a CookieContext");
	}
	return { state: context.state, setState: context.setState };
}
