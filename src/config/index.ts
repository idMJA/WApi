import "dotenv/config";
import type { SupportedLocale } from "../locales/types";

export const CONFIG = {
	server: {
		port: 3759,
	},
	whatsapp: {
		logLevel: "silent" as const, // Set to 'info' for debugging
	},
	database: {
		authDbPath: process.env.DB_FILE_NAME || "data/auth.db", // SQLite database path for auth data
	},
	otp: {
		expirationMinutes: 5,
	},
	localization: {
		defaultLocale: (process.env.DEFAULT_LOCALE || "id") as SupportedLocale,
	},
} as const;
