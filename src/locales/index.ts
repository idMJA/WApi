import type { SupportedLocale } from "./types";
import { id } from "./id";
import { en } from "./en";
import { es } from "./es";

const localeMap = {
	id,
	en,
	es,
};

class LocalizationService {
	private currentLocale: SupportedLocale = "id";

	setLocale(locale: SupportedLocale): void {
		if (!localeMap[locale]) {
			throw new Error(`Unsupported locale: ${locale}`);
		}
		this.currentLocale = locale;
	}

	getCurrentLocale(): SupportedLocale {
		return this.currentLocale;
	}

	getTranslations() {
		return localeMap[this.currentLocale];
	}

	formatOTPMessage(params: {
		websiteName: string;
		otp: string;
		minutes: number;
	}): string {
		const translations = this.getTranslations();
		const { websiteName, otp, minutes } = params;

		const title = translations.otp.title.replace("{websiteName}", websiteName);
		const codeLabel = translations.otp.codeLabel.replace("{otp}", otp);
		const validityMessage = translations.otp.validityMessage.replace(
			"{minutes}",
			minutes.toString(),
		);
		const securityWarning = translations.otp.securityWarning;
		const tags = translations.otp.tags;

		return `${title}\n\n${codeLabel}\n\n${validityMessage}\n${securityWarning}\n\n${tags}`;
	}

	getSupportedLocales(): SupportedLocale[] {
		return Object.keys(localeMap) as SupportedLocale[];
	}
}

export const localizationService = new LocalizationService();
