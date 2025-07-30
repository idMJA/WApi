import type { Context } from "elysia";
import { whatsappService } from "#wapi/services";

export const getAuthStats = async ({ set }: Context) => {
	try {
		const stats = await whatsappService.getAuthStats();

		return {
			success: true,
			message: "Auth database statistics retrieved successfully",
			data: {
				totalKeys: stats.totalKeys,
				dbSize: stats.dbSize,
				dbPath: stats.dbPath,
				timestamp: new Date().toISOString(),
			},
		};
	} catch (error) {
		console.error("Error getting auth stats:", error);
		set.status = 500;
		return {
			success: false,
			message: "Failed to get auth statistics",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export const clearAuthData = async ({ set }: Context) => {
	try {
		await whatsappService.clearAuthData();

		return {
			success: true,
			message:
				"Auth data cleared successfully. Please restart WhatsApp connection.",
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		console.error("Error clearing auth data:", error);
		set.status = 500;
		return {
			success: false,
			message: "Failed to clear auth data",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
