import { whatsappService } from "#wapi/services";
import { z } from "zod";

const SetLocaleSchema = z.object({
	locale: z.enum(["id", "en", "es"] as const),
});

export async function setLocale({ body }: { body: unknown }) {
	try {
		const validatedBody = SetLocaleSchema.parse(body);

		whatsappService.setLocale(validatedBody.locale);

		return {
			success: true,
			message: `Locale set to ${validatedBody.locale}`,
			locale: validatedBody.locale,
		};
	} catch (error) {
		console.error("Error setting locale:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function getLocale() {
	try {
		const currentLocale = whatsappService.getCurrentLocale();

		return {
			success: true,
			locale: currentLocale,
		};
	} catch (error) {
		console.error("Error getting locale:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function getSupportedLocales() {
	try {
		const supportedLocales = whatsappService.getSupportedLocales();

		return {
			success: true,
			supportedLocales,
		};
	} catch (error) {
		console.error("Error getting supported locales:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
