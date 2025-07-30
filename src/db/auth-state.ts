import type {
	AuthenticationState,
	SignalDataSet,
	SignalDataTypeMap,
} from "@whiskeysockets/baileys";
import { AuthDatabase } from "./index";
import { initAuthCreds, BufferJSON } from "@whiskeysockets/baileys";

export interface AuthStateOptions {
	dbPath?: string;
}

/**
 * Auth state implementation using Drizzle ORM with Bun SQLite
 */
export function useSQLiteAuthState(options: AuthStateOptions = {}): {
	state: AuthenticationState;
	saveCreds: () => Promise<void>;
	clearAuthState: () => void;
} {
	const { dbPath } = options;
	const db = new AuthDatabase(dbPath);

	const loadState = (): AuthenticationState => {
		return {
			creds: initAuthCreds(),
			keys: {
				get: async <T extends keyof SignalDataTypeMap>(
					type: T,
					ids: string[],
				) => {
					const data: { [id: string]: SignalDataTypeMap[T] } = {};

					const keys = ids.map((id) => `${type}-${id}`);
					const batchResult = await db.getAuthDataBatch(keys);

					for (const id of ids) {
						const key = `${type}-${id}`;
						const value = batchResult.get(key);
						if (value && typeof value === "string") {
							try {
								data[id] = JSON.parse(
									value,
									BufferJSON.reviver,
								) as SignalDataTypeMap[T];
							} catch (parseError) {
								console.error(
									`Failed to parse auth data for key ${key}:`,
									parseError,
								);
							}
						}
					}

					return data;
				},
				set: async (data: SignalDataSet) => {
					const entries: Array<{ key: string; data: unknown }> = [];

					for (const category in data) {
						const categoryData = data[category as keyof SignalDataSet];
						if (categoryData) {
							for (const id in categoryData) {
								const key = `${category}-${id}`;

								const jsonData = JSON.stringify(
									categoryData[id],
									BufferJSON.replacer,
								);
								entries.push({ key, data: jsonData });
							}
						}
					}

					if (entries.length > 0) {
						await db.saveAuthDataBatch(entries);
					}
				},
			},
		};
	};

	const loadCreds = async (): Promise<void> => {
		try {
			const creds = await db.getAuthData("creds");
			if (creds && typeof creds === "string" && state.creds) {
				const parsedCreds = JSON.parse(creds, BufferJSON.reviver);
				Object.assign(state.creds, parsedCreds);
			}
		} catch (error) {
			console.error("Failed to load credentials:", error);
		}
	};

	const saveCreds = async (): Promise<void> => {
		try {
			if (state.creds) {
				const credsData = JSON.stringify(state.creds, BufferJSON.replacer);
				await db.saveAuthData("creds", credsData);
			}
		} catch (error) {
			console.error("Failed to save credentials:", error);
		}
	};

	const clearAuthState = (): void => {
		try {
			db.clearAll();
		} catch (error) {
			console.error("Failed to clear auth state:", error);
		}
	};

	const state = loadState();

	loadCreds().catch(console.error);

	return {
		state,
		saveCreds,
		clearAuthState,
	};
}
