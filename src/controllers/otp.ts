import type { Context } from "elysia";
import { whatsappService } from "#wapi/services";
import { OTPRequestSchema, OTPValidationSchema } from "#wapi/types";

export const sendOTP = async ({ body, set }: Context) => {
	try {
		const validationResult = OTPRequestSchema.safeParse(body);

		if (!validationResult.success) {
			set.status = 400;
			return {
				success: false,
				message: "Invalid input data",
				error: validationResult.error.issues
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(", "),
			};
		}

		const { phoneNumber, websiteName, otp, locale } = validationResult.data;

		if (!whatsappService.connected) {
			set.status = 503;
			return {
				success: false,
				message: "WhatsApp is not connected. Please try again later.",
				connectionState: whatsappService.state,
			};
		}

		try {
			const success = await whatsappService.sendOTPMessage(
				phoneNumber,
				otp,
				websiteName,
				locale,
			);

			if (success) {
				return {
					success: true,
					message: "OTP sent successfully",
					data: {
						phoneNumber: phoneNumber,
						websiteName: websiteName,
						otpLength: otp.length,
						locale: locale || whatsappService.getCurrentLocale(),
						timestamp: new Date().toISOString(),
					},
				};
			} else {
				set.status = 500;
				return {
					success: false,
					message: "Failed to send OTP message",
				};
			}
		} catch (sendError) {
			console.error("Send OTP error:", sendError);
			set.status = 500;
			return {
				success: false,
				message:
					sendError instanceof Error &&
					sendError.message === "Number is not registered on WhatsApp"
						? "Phone number is not registered on WhatsApp"
						: "Failed to send OTP message",
				error: sendError instanceof Error ? sendError.message : "Unknown error",
			};
		}
	} catch (error) {
		console.error("Error in send-otp endpoint:", error);
		set.status = 500;
		return {
			success: false,
			message: "Internal server error",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export const validateOTP = async ({ body, set }: Context) => {
	try {
		const validationResult = OTPValidationSchema.safeParse(body);

		if (!validationResult.success) {
			set.status = 400;
			return {
				success: false,
				message: "Invalid input data",
				error: validationResult.error.issues
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(", "),
			};
		}

		const { phoneNumber, otp, sessionId } = validationResult.data;

		return {
			success: true,
			message: "OTP validation endpoint - implement your validation logic here",
			data: {
				phoneNumber,
				otp,
				sessionId,
				timestamp: new Date().toISOString(),
			},
		};
	} catch (error) {
		console.error("Error in validate-otp endpoint:", error);
		set.status = 500;
		return {
			success: false,
			message: "Internal server error",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
