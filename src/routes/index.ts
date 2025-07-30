import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
	healthCheck,
	getStatus,
	getQRCode,
	restartConnection,
	logout,
	sendOTP,
	serveAdminPanel,
	validateOTP,
	getAuthStats,
	clearAuthData,
	setLocale,
	getLocale,
	getSupportedLocales,
} from "#wapi/controllers";

// Create Elysia app
export const app = new Elysia()
	.use(
		cors({
			origin: "*",
			allowedHeaders: ["Content-Type", "Authorization"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
		}),
	)
	// Routes
	.get("/", healthCheck)
	.get("/status", getStatus)
	.get("/qr", getQRCode)
	.get("/admin", serveAdminPanel)
	.get("/auth/stats", getAuthStats)
	.get("/locale", getLocale)
	.get("/locale/supported", getSupportedLocales)
	.post("/restart", restartConnection)
	.post("/logout", logout)
	.post("/send-otp", sendOTP)
	.post("/validate-otp", validateOTP)
	.post("/auth/clear", clearAuthData)
	.post("/locale", setLocale);
