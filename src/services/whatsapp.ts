import {
	default as makeWASocket,
	DisconnectReason,
	fetchLatestBaileysVersion,
	type WASocket,
} from "@whiskeysockets/baileys";
import type { Boom } from "@hapi/boom";
import P from "pino";
import type { ConnectionState } from "#wapi/types";
import { formatPhoneNumber } from "#wapi/utils";
import { CONFIG } from "#wapi/config";
import { useSQLiteAuthState, AuthDatabase } from "#wapi/db";
import { localizationService } from "../locales";
import type { SupportedLocale } from "../locales/types";

const logger = P({ level: CONFIG.whatsapp.logLevel });

class WhatsAppService {
	private sock: WASocket | null = null;
	private isConnected = false;
	private qrCode: string | null = null;
	private connectionState: ConnectionState = "disconnected";
	private authDb: AuthDatabase;

	constructor() {
		this.initializeWhatsApp = this.initializeWhatsApp.bind(this);
		this.sendOTPMessage = this.sendOTPMessage.bind(this);
		this.authDb = new AuthDatabase(CONFIG.database.authDbPath);

		// Initialize localization service with default locale
		localizationService.setLocale(CONFIG.localization.defaultLocale);
	}

	get connected(): boolean {
		return this.isConnected;
	}

	get state(): ConnectionState {
		return this.connectionState;
	}

	get currentQRCode(): string | null {
		return this.qrCode;
	}

	get hasQR(): boolean {
		return this.qrCode !== null;
	}

	async initializeWhatsApp(): Promise<WASocket | null> {
		try {
			this.connectionState = "connecting";

			const { state, saveCreds } = useSQLiteAuthState({
				dbPath: CONFIG.database.authDbPath,
			});
			const { version, isLatest } = await fetchLatestBaileysVersion();

			console.log(`Using WA v${version.join(".")}, isLatest: ${isLatest}`);
			console.log("Using Drizzle ORM for auth storage");

			this.sock = makeWASocket({
				version,
				auth: state,
				logger,
				printQRInTerminal: false,
				generateHighQualityLinkPreview: true,
				syncFullHistory: false,
				markOnlineOnConnect: true,
			});

			this.sock.ev.on("connection.update", (update) => {
				const { connection, lastDisconnect, qr } = update;

				if (qr) {
					this.qrCode = qr;
					console.log(
						"New QR Code received. Use GET /qr endpoint to retrieve it.",
					);
				}

				if (connection === "close") {
					const shouldReconnect =
						(lastDisconnect?.error as Boom)?.output?.statusCode !==
						DisconnectReason.loggedOut;
					const errorStatusCode = (lastDisconnect?.error as Boom)?.output
						?.statusCode;

					console.log(
						"Connection closed due to:",
						lastDisconnect?.error?.message || "Unknown error",
					);
					console.log("Error status code:", errorStatusCode);
					console.log("Should reconnect:", shouldReconnect);

					this.qrCode = null;
					this.isConnected = false;

					if (shouldReconnect) {
						this.connectionState = "connecting";

						let delay = 3000;

						if (errorStatusCode === 515) {
							delay = 5000;
							console.log(
								"Stream error detected, waiting 5 seconds before reconnect...",
							);
						} else if (errorStatusCode === 401) {
							delay = 10000;
							console.log(
								"Unauthorized error, waiting 10 seconds before reconnect...",
							);
						}

						setTimeout(() => {
							console.log("Attempting to reconnect...");
							this.initializeWhatsApp().catch(console.error);
						}, delay);
					} else {
						this.connectionState = "logged_out";
						console.log("Not reconnecting - user logged out");
					}
				} else if (connection === "open") {
					console.log("WhatsApp connection opened successfully");
					this.connectionState = "connected";
					this.isConnected = true;
					this.qrCode = null;
				} else if (connection === "connecting") {
					this.connectionState = "connecting";
					console.log("Connecting to WhatsApp...");
				}
			});

			this.sock.ev.on("creds.update", saveCreds);

			this.sock.ev.on("messages.upsert", async (_m) => {});

			return this.sock;
		} catch (error) {
			console.error("Failed to initialize WhatsApp:", error);
			this.connectionState = "disconnected";

			setTimeout(() => {
				console.log("Retrying WhatsApp initialization...");
				this.initializeWhatsApp().catch(console.error);
			}, 5000);

			throw error;
		}
	}

	async sendOTPMessage(
		phoneNumber: string,
		otp: string,
		websiteName: string = "Website",
		locale?: SupportedLocale,
	): Promise<boolean> {
		if (!this.sock || !this.isConnected) {
			throw new Error("WhatsApp is not connected");
		}

		try {
			const formattedNumber = formatPhoneNumber(phoneNumber);

			// Save current locale if we need to temporarily change it
			const currentLocale = localizationService.getCurrentLocale();

			// Use provided locale or keep current one
			if (locale && locale !== currentLocale) {
				localizationService.setLocale(locale);
			}

			const message = localizationService.formatOTPMessage({
				websiteName,
				otp,
				minutes: CONFIG.otp.expirationMinutes,
			});

			// Restore original locale if we changed it
			if (locale && locale !== currentLocale) {
				localizationService.setLocale(currentLocale);
			}

			console.log(`Sending OTP to ${formattedNumber}...`);

			try {
				const existsCheck = await this.sock.onWhatsApp(formattedNumber);
				if (
					!existsCheck ||
					existsCheck.length === 0 ||
					!existsCheck[0]?.exists
				) {
					console.warn(
						`Number ${formattedNumber} is not on WhatsApp, but proceeding anyway`,
					);
				}
			} catch (checkError) {
				console.warn(
					"Could not verify WhatsApp number, proceeding anyway:",
					checkError,
				);
			}

			await this.sock.sendMessage(formattedNumber, { text: message });
			console.log(`OTP sent successfully to ${formattedNumber}`);
			return true;
		} catch (error) {
			console.error("Failed to send OTP:", error);
			return false;
		}
	}

	async restart(): Promise<void> {
		if (this.sock) {
			this.sock.end(undefined);
			this.sock = null;
		}

		this.isConnected = false;
		this.qrCode = null;
		this.connectionState = "connecting";

		setTimeout(() => {
			this.initializeWhatsApp().catch(console.error);
		}, 1000);
	}

	async logout(): Promise<void> {
		if (!this.sock) {
			throw new Error("WhatsApp is not connected");
		}

		await this.sock.logout();
		this.sock = null;
		this.isConnected = false;
		this.qrCode = null;
		this.connectionState = "logged_out";

		await this.authDb.clearAll();
	}

	async getAuthStats(): Promise<{
		totalKeys: number;
		dbSize: number;
		dbPath: string;
	}> {
		return await this.authDb.getStats();
	}

	async clearAuthData(): Promise<void> {
		await this.authDb.clearAll();
		this.isConnected = false;
		this.qrCode = null;
		this.connectionState = "disconnected";
	}

	async getPreKeys(): Promise<string[]> {
		return await this.authDb.getKeysByPattern("pre-key-%");
	}

	async getSessions(): Promise<string[]> {
		return await this.authDb.getKeysByPattern("session-%");
	}

	setLocale(locale: SupportedLocale): void {
		localizationService.setLocale(locale);
	}

	getCurrentLocale(): SupportedLocale {
		return localizationService.getCurrentLocale();
	}

	getSupportedLocales(): SupportedLocale[] {
		return localizationService.getSupportedLocales();
	}

	optimizeDatabase(): void {
		this.authDb.optimize();
	}

	closeDatabase(): void {
		this.authDb.close();
	}
}

export const whatsappService = new WhatsAppService();
