import { app } from "./routes";
import { whatsappService } from "#wapi/services";
import { CONFIG } from "#wapi/config";

app.listen(CONFIG.server.port, () => {
	console.log(
		`🦊 WhatsApp OTP API is running at http://localhost:${CONFIG.server.port}`,
	);
	whatsappService.initializeWhatsApp().catch(console.error);
});
