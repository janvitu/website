import { coppyContent } from "./utils";
import { z } from "zod";
import { $ } from "./selector";

document.addEventListener("DOMContentLoaded", () => {
	const copyElement = document.getElementById("copyitem");
	if (copyElement) copyElement.addEventListener("click", coppyContent);

	const phoneRegex = /^((\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}){0,1}$/;

	const formContent = {
		name: {
			element: <HTMLInputElement>document.getElementById("firstname"),
			schema: z.string().min(1, "EMPTY"),
		},
		surname: {
			element: <HTMLInputElement>document.getElementById("secondname"),
			schema: z.string().min(1, "EMPTY"),
		},
		email: {
			element: <HTMLInputElement>document.getElementById("email"),
			schema: z.string().min(1, "EMPTY").email("FORMAT"),
		},
		phone: {
			element: <HTMLInputElement>document.getElementById("phone"),
			schema: z.string().regex(phoneRegex, "FORMAT").optional(),
		},
		company: {
			element: <HTMLInputElement>document.getElementById("company"),
			schema: z.string(),
		},
		message: {
			element: <HTMLInputElement>document.getElementById("message"),
			schema: z.string().min(1, "EMPTY"),
		},
	};

	formContent.name.element.addEventListener("input", () =>
		validateInputValue("name"),
	);
	formContent.surname.element.addEventListener("input", () =>
		validateInputValue("surname"),
	);
	formContent.email.element.addEventListener("input", () =>
		validateInputValue("email"),
	);
	formContent.phone.element.addEventListener("input", () =>
		validateInputValue("phone"),
	);
	formContent.message.element.addEventListener("input", () =>
		validateInputValue("message"),
	);

	type FormElementType =
		| "name"
		| "surname"
		| "email"
		| "phone"
		| "company"
		| "message";
	function validateInputValue(formElement: FormElementType) {
		const elementSchema = formContent[formElement];
		const element = elementSchema.element;
		const errorElementEmpty = element
			.closest("div")
			.querySelector("[data-validation-empty]");
		const errorElementFormat = element
			.closest("div")
			.querySelector("[data-validation-format]");

		// @ts-ignore
		let validation = elementSchema.schema.safeParse(element.value);

		if (validation.success === false) {
			if (validation.error.issues[0].message === "EMPTY") {
				if (errorElementEmpty) errorElementEmpty.classList.remove("hidden");
				if (errorElementFormat) errorElementFormat.classList.add("hidden");
			} else if (validation.error.issues[0].message === "FORMAT") {
				if (errorElementFormat) errorElementFormat.classList.remove("hidden");
				if (errorElementEmpty) errorElementEmpty.classList.add("hidden");
			}
		} else {
			if (errorElementEmpty) errorElementEmpty.classList.add("hidden");
			if (errorElementFormat) errorElementFormat.classList.add("hidden");
		}
	}

	$("form").addEventListener("submit", handleSubmit);
	function handleSubmit(event: Event) {
		event.preventDefault();

		const formValidation = z.object({
			name: formContent.name.schema,
			surname: formContent.surname.schema,
			email: formContent.email.schema,
			phone: formContent.phone.schema,
			company: formContent.company.schema,
			message: formContent.message.schema,
		});

		const formDataValidate = {
			name: formContent.name.element.value,
			surname: formContent.surname.element.value,
			email: formContent.email.element.value,
			phone: formContent.phone.element.value,
			company: formContent.company.element.value,
			message: formContent.message.element.value,
		};
		const isValidData = formValidation.parse(formDataValidate);

		if (!isValidData) {
			validateInputValue("name");
			validateInputValue("surname");
			validateInputValue("email");
			validateInputValue("phone");
			validateInputValue("message");
			return;
		}

		const myForm = event.target;
		const formData = new FormData(myForm);

		fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(formData).toString(),
		})
			.then(() => {
				const button = $("button[type='submit']");
				button.classList.remove(
					"hover:bg-neutral-700",
					"hover:text-neutral-50",
					"bg-neutral-50",
				);
				button.classList.add(
					"cursor-not-allowed",
					"bg-emerald-400",
					"hover:fill-neutral-50",
				);
				button.querySelector("span").classList.remove("hidden");
				console.log("Form successfully submitted");
			})
			.catch((error) => console.error(error));
	}
});
