export function formatPhoneNumber(phoneNumber: string): string {
	let cleaned = phoneNumber.replace(/\D/g, "");

	if (!cleaned.startsWith("62")) {
		if (cleaned.startsWith("0")) {
			cleaned = `62${cleaned.substring(1)}`;
		} else {
			cleaned = `62${cleaned}`;
		}
	}

	return `${cleaned}@s.whatsapp.net`;
}

/**
 * Generate a random numeric OTP code
 * @param length - Length of the OTP (default: 6)
 * @returns Generated OTP as string
 */
export function generateOTP(length: number = 6): string {
	const digits = "0123456789";
	let otp = "";

	for (let i = 0; i < length; i++) {
		otp += digits[Math.floor(Math.random() * digits.length)];
	}

	return otp;
}

/**
 * Create OTP request object with optional parameters
 * @param phoneNumber - Recipient phone number
 * @param options - Optional parameters
 * @returns Complete OTP request object
 */
export function createOTPRequest(
	phoneNumber: string,
	options?: {
		websiteName?: string;
		otp?: string;
		otpLength?: number;
		locale?: "id" | "en" | "es";
	},
) {
	return {
		phoneNumber,
		websiteName: options?.websiteName || "Website",
		otp: options?.otp || generateOTP(options?.otpLength || 6),
		...(options?.locale && { locale: options.locale }),
	};
}
