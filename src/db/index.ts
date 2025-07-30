import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { eq, inArray, like } from "drizzle-orm";
import { authData } from "./schema";

export * from "./auth-state";

export class AuthDatabase {
	private db: ReturnType<typeof drizzle>;
	private sqlite: Database;
	private readonly dbPath: string;

	constructor(path?: string) {
		this.dbPath = path || process.env.DB_FILE_NAME || "data/auth.db";
		this.sqlite = new Database(this.dbPath);

		this.sqlite.exec("PRAGMA journal_mode = WAL;");
		this.sqlite.exec("PRAGMA synchronous = NORMAL;");
		this.sqlite.exec("PRAGMA cache_size = 1000;");
		this.sqlite.exec("PRAGMA temp_store = MEMORY;");

		this.db = drizzle({ client: this.sqlite });
		this.initTables();
	}

	private initTables() {
		this.sqlite.exec(`
			CREATE TABLE IF NOT EXISTS auth_data (
				id TEXT PRIMARY KEY,
				data TEXT NOT NULL,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL
			)
		`);

		this.sqlite.exec(`
			CREATE INDEX IF NOT EXISTS idx_auth_data_updated_at 
			ON auth_data(updated_at)
		`);

		this.sqlite.exec(`
			CREATE INDEX IF NOT EXISTS idx_auth_data_pattern 
			ON auth_data(id) WHERE id LIKE 'pre-key-%' OR id LIKE 'session-%' OR id = 'creds'
		`);
	}

	async saveAuthData(key: string, data: unknown): Promise<void> {
		const now = Date.now();

		try {
			const dataStr = typeof data === "string" ? data : JSON.stringify(data);

			await this.db
				.insert(authData)
				.values({
					id: key,
					data: dataStr,
					createdAt: now,
					updatedAt: now,
				})
				.onConflictDoUpdate({
					target: authData.id,
					set: {
						data: dataStr,
						updatedAt: now,
					},
				});
		} catch (error) {
			console.error(`Failed to save auth data for key ${key}:`, error);
			throw error;
		}
	}

	async saveAuthDataBatch(
		entries: Array<{ key: string; data: unknown }>,
	): Promise<void> {
		const now = Date.now();

		try {
			await this.db.transaction(async (tx) => {
				for (const { key, data } of entries) {
					const dataStr =
						typeof data === "string" ? data : JSON.stringify(data);

					await tx
						.insert(authData)
						.values({
							id: key,
							data: dataStr,
							createdAt: now,
							updatedAt: now,
						})
						.onConflictDoUpdate({
							target: authData.id,
							set: {
								data: dataStr,
								updatedAt: now,
							},
						});
				}
			});
		} catch (error) {
			console.error("Failed to save auth data batch:", error);
			throw error;
		}
	}

	async getAuthData(key: string): Promise<string | null> {
		try {
			const result = await this.db
				.select({ data: authData.data })
				.from(authData)
				.where(eq(authData.id, key))
				.limit(1);

			return result[0] ? result[0].data : null;
		} catch (error) {
			console.error(`Failed to get auth data for key ${key}:`, error);
			return null;
		}
	}

	async getAuthDataBatch(keys: string[]): Promise<Map<string, string>> {
		const result = new Map<string, string>();

		if (keys.length === 0) return result;

		try {
			const rows = await this.db
				.select({ id: authData.id, data: authData.data })
				.from(authData)
				.where(inArray(authData.id, keys));

			for (const row of rows) {
				result.set(row.id, row.data);
			}
		} catch (error) {
			console.error("Failed to get auth data batch:", error);
		}

		return result;
	}

	async removeAuthData(key: string): Promise<boolean> {
		try {
			await this.db.delete(authData).where(eq(authData.id, key));

			const checkResult = await this.db
				.select({ count: authData.id })
				.from(authData)
				.where(eq(authData.id, key))
				.limit(1);

			return checkResult.length === 0;
		} catch (error) {
			console.error(`Failed to remove auth data for key ${key}:`, error);
			return false;
		}
	}

	async getAllKeys(limit?: number, offset?: number): Promise<string[]> {
		try {
			const query = this.db
				.select({ id: authData.id })
				.from(authData)
				.orderBy(authData.updatedAt);

			let results: Array<{ id: string }>;
			if (limit !== undefined) {
				if (offset !== undefined) {
					results = await query.limit(limit).offset(offset);
				} else {
					results = await query.limit(limit);
				}
			} else {
				results = await query;
			}

			return results.map((row) => row.id);
		} catch (error) {
			console.error("Failed to get all keys:", error);
			return [];
		}
	}

	async getKeysByPattern(pattern: string): Promise<string[]> {
		try {
			const results = await this.db
				.select({ id: authData.id })
				.from(authData)
				.where(like(authData.id, pattern))
				.orderBy(authData.updatedAt);

			return results.map((row) => row.id);
		} catch (error) {
			console.error(`Failed to get keys by pattern ${pattern}:`, error);
			return [];
		}
	}

	async clearAll(): Promise<number> {
		try {
			const countResult = await this.db
				.select({ count: authData.id })
				.from(authData);

			const totalCount = countResult.length;

			await this.db.delete(authData);

			this.sqlite.exec("VACUUM");
			return totalCount;
		} catch (error) {
			console.error("Failed to clear all auth data:", error);
			return 0;
		}
	}

	async getStats(): Promise<{
		totalKeys: number;
		dbSize: number;
		dbPath: string;
	}> {
		try {
			const countResult = await this.db
				.select({ count: authData.id })
				.from(authData);

			const pageSizeStmt = this.sqlite.prepare("PRAGMA page_size");
			const pageCountStmt = this.sqlite.prepare("PRAGMA page_count");

			const pageSize =
				(pageSizeStmt.get() as { page_size: number })?.page_size || 0;
			const pageCount =
				(pageCountStmt.get() as { page_count: number })?.page_count || 0;

			return {
				totalKeys: countResult.length,
				dbSize: pageSize * pageCount,
				dbPath: this.dbPath,
			};
		} catch (error) {
			console.error("Failed to get database stats:", error);
			return {
				totalKeys: 0,
				dbSize: 0,
				dbPath: this.dbPath,
			};
		}
	}

	optimize(): void {
		try {
			this.sqlite.exec("VACUUM");
			this.sqlite.exec("ANALYZE");
			console.log("Database optimized successfully");
		} catch (error) {
			console.error("Failed to optimize database:", error);
		}
	}

	close(): void {
		try {
			this.sqlite.close();
		} catch (error) {
			console.error("Failed to close database:", error);
		}
	}

	get drizzle() {
		return this.db;
	}

	get schema() {
		return { authData };
	}
}
