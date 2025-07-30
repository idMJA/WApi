import type { Context } from "elysia";

export const serveAdminPanel = async ({ set }: Context) => {
	try {
		const file = Bun.file("admin.html");
		const html = await file.text();

		set.headers["content-type"] = "text/html";
		return html;
	} catch (_error) {
		set.status = 404;
		set.headers["content-type"] = "text/html";
		return "<h1>Error: admin.html not found</h1><p>Please make sure admin.html exists in the project root.</p>";
	}
};
