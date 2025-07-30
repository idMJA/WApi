import type { Context } from "elysia";
import { whatsappService } from "#wapi/services";

export const healthCheck = () => {
	return {
		message: "WhatsApp OTP API is running",
		status: "ok",
		whatsappConnected: whatsappService.connected,
		connectionState: whatsappService.state,
	};
};

export const getStatus = () => {
	return {
		connected: whatsappService.connected,
		connectionState: whatsappService.state,
		hasQR: whatsappService.hasQR,
		timestamp: new Date().toISOString(),
	};
};

export const getQRCode = ({ set }: Context) => {
	if (!whatsappService.currentQRCode) {
		set.status = 404;
		return {
			success: false,
			message: "No QR code available. Please restart the connection.",
			connectionState: whatsappService.state,
		};
	}

	return {
		success: true,
		qrCode: whatsappService.currentQRCode,
		message: "Scan this QR code with WhatsApp",
		connectionState: whatsappService.state,
	};
};

export const restartConnection = async ({ set }: Context) => {
	try {
		await whatsappService.restart();

		return {
			success: true,
			message: "WhatsApp connection restarted. New QR code will be generated.",
			connectionState: whatsappService.state,
		};
	} catch (error) {
		set.status = 500;
		return {
			success: false,
			message: "Failed to restart connection",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export const logout = async ({ set }: Context) => {
	try {
		await whatsappService.logout();

		return {
			success: true,
			message: "Successfully logged out from WhatsApp",
		};
	} catch (error) {
		set.status =
			error instanceof Error && error.message === "WhatsApp is not connected"
				? 400
				: 500;
		return {
			success: false,
			message: error instanceof Error ? error.message : "Failed to logout",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
