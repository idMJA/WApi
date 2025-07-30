export interface OTPMessageTranslations {
	title: string;
	codeLabel: string;
	validityMessage: string;
	securityWarning: string;
	tags: string;
}

export interface LocaleTranslations {
	otp: OTPMessageTranslations;
}

export type SupportedLocale = "id" | "en" | "es";

export interface LocaleConfig {
	locale: SupportedLocale;
	translations: LocaleTranslations;
}
