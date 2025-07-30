import { z } from "zod";

export const OTPRequestSchema = z.object({
	phoneNumber: z
		.string()
		.min(8, "Phone number must be at least 8 digits")
		.max(15, "Phone number must be at most 15 digits")
		.regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format"),
	websiteName: z
		.string()
		.min(1, "Website name is required")
		.max(50, "Website name must be at most 50 characters")
		.optional()
		.default("Website"),
	otp: z
		.string()
		.min(4, "OTP must be at least 4 digits")
		.max(8, "OTP must be at most 8 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
	locale: z
		.enum(["id", "en", "es"] as const)
		.optional()
		.describe(
			"Language locale for OTP message (optional, defaults to current system locale)",
		),
});

export const OTPValidationSchema = z.object({
	phoneNumber: z
		.string()
		.min(8, "Phone number must be at least 8 digits")
		.max(15, "Phone number must be at most 15 digits")
		.regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format"),
	otp: z
		.string()
		.min(4, "OTP must be at least 4 digits")
		.max(8, "OTP must be at most 8 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
	sessionId: z.string().optional(),
});

export const AuthStatsSchema = z.object({
	totalKeys: z.number(),
	dbSize: z.number(),
	dbPath: z.string(),
});

export const ConnectionStateSchema = z.enum([
	"disconnected",
	"connecting",
	"connected",
	"logged_out",
]);

export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.any().optional(),
	error: z.string().optional(),
	connectionState: ConnectionStateSchema.optional(),
	timestamp: z.string().optional(),
});

export type OTPRequest = z.infer<typeof OTPRequestSchema>;
export type OTPValidation = z.infer<typeof OTPValidationSchema>;
export type AuthStats = z.infer<typeof AuthStatsSchema>;
export type ConnectionState = z.infer<typeof ConnectionStateSchema>;
export type ApiResponse<T = unknown> = {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
	connectionState?: ConnectionState;
	timestamp?: string;
};
