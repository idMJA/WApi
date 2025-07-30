# WhatsApp OTP API

<div align="center">
  <h3>🚀 Modern WhatsApp OTP Service with Baileys Integration</h3>
  <p>Production-ready API for sending OTP messages via WhatsApp Web protocol with multilingual support</p>
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
  ![ElysiaJS](https://img.shields.io/badge/ElysiaJS-8B5CF6?style=for-the-badge&logo=elysia&logoColor=white)
  ![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
</div>

---

## ✨ Features

### 🔐 Authentication & Session Management
- **Persistent WhatsApp Sessions** - Automatic session restore using Baileys
- **QR Code Generation** - Simple web interface for WhatsApp Web connection
- **Auth State Management** - SQLite database with Drizzle ORM for reliable session storage

### 📱 OTP Delivery System
- **Smart Number Formatting** - Automatic international format conversion
- **Reliable Message Delivery** - Robust error handling with fallback mechanisms
- **Template Customization** - Configurable OTP message templates

### 🌍 Internationalization
- **Multi-language Support** - Indonesian and English localization
- **Runtime Language Switching** - Dynamic locale configuration per request
- **Extensible Translation System** - Easy addition of new languages

### 🎨 Admin Interface
- **Modern Dark Theme** - Next.js-inspired professional design
- **Real-time Status** - Live connection status and message statistics
- **Responsive Design** - Mobile-friendly admin panel

### 🛡️ Type Safety & Validation
- **Full TypeScript Coverage** - End-to-end type safety
- **Zod Schema Validation** - Runtime request validation
- **Error Boundaries** - Comprehensive error handling

---

## 🚀 Quick Start

### Prerequisites
- **Bun** >= 1.0.0
- **Node.js** >= 18.0.0 (for compatibility)
- **SQLite** (included with Bun)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd WApi

# Install dependencies
bun install

# Start the server
bun run start
```

### First Setup

1. **Start the service**:
   ```bash
   bun run start
   ```

2. **Connect WhatsApp**:
   - Open `http://localhost:3000/admin.html`
   - Scan the QR code with WhatsApp on your phone
   - Wait for connection confirmation

3. **Test the API**:
   ```bash
   curl -X POST http://localhost:3000/send-otp \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber": "+6281234567890",
       "otp": "123456",
       "websiteName": "MyApp",
       "locale": "id"
     }'
   ```

---

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 🔐 Authentication

##### `GET /qr`
Generate QR code for WhatsApp Web connection.

**Response:**
```json
{
  "success": true,
  "qr": "data:image/png;base64,..."
}
```

##### `GET /status`
Check WhatsApp connection status.

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "phoneNumber": "+6281234567890"
}
```

#### 📱 OTP Services

##### `POST /send-otp`
Send OTP message via WhatsApp.

**Request Body:**
```json
{
  "phoneNumber": "+6281234567890",
  "otp": "123456",
  "websiteName": "MyApp",
  "locale": "id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Parameters:**
- `phoneNumber` (string, required) - Target phone number in international format
- `otp` (string, required) - OTP code to send
- `websiteName` (string, optional) - Name of your application
- `locale` (string, optional) - Language locale (`id` or `en`, defaults to `id`)

#### 🌍 Localization

##### `GET /locales`
Get all available locales.

**Response:**
```json
{
  "success": true,
  "locales": ["id", "en"]
}
```

##### `GET /locales/:locale`
Get translations for specific locale.

**Response:**
```json
{
  "success": true,
  "translations": {
    "otpMessage": "Kode OTP Anda untuk {websiteName} adalah: {otp}. Kode ini berlaku selama 5 menit.",
    "defaultWebsiteName": "Aplikasi Kami"
  }
}
```

---

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=./auth_info_baileys/auth.db

# Localization
DEFAULT_LOCALE=id

# WhatsApp Configuration
WHATSAPP_SESSION_PATH=./auth_info_baileys
```

### Custom Localization

To add a new language:

1. Create a new language file in `src/locales/languages/`:
   ```typescript
   // src/locales/languages/fr.ts
   export const fr = {
     otpMessage: "Votre code OTP pour {websiteName} est: {otp}. Ce code expire dans 5 minutes.",
     defaultWebsiteName: "Notre Application"
   };
   ```

2. Update the locale types:
   ```typescript
   // src/locales/types.ts
   export type Locale = 'id' | 'en' | 'fr';
   ```

3. Register the language:
   ```typescript
   // src/locales/languages/index.ts
   export { fr } from './fr';
   ```

---

## 🏗️ Architecture

### Project Structure
```
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── db/             # Database and auth state
│   ├── locales/        # Internationalization
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types and schemas
│   └── utils/          # Helper utilities
├── auth_info_baileys/  # WhatsApp session storage
├── admin.html          # Admin panel interface
└── test.html          # Testing interface
```

### Tech Stack

- **Runtime**: Bun for high-performance JavaScript/TypeScript execution
- **Framework**: ElysiaJS for modern web API development
- **Database**: SQLite with Drizzle ORM for type-safe database operations
- **WhatsApp**: Baileys for WhatsApp Web protocol implementation
- **Validation**: Zod for runtime type checking and validation
- **UI**: Vanilla HTML/CSS/JS with modern design principles

---

## 🔧 Development

### Scripts

```bash
# Development server with hot reload
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Clean restart (clears auth data)
bun run start:clean

# Run tests
bun run test

# API testing
bun run test:api
```

### Development Workflow

1. **Make changes** to source files
2. **Test locally** using the admin panel
3. **Validate** with the test API script
4. **Build** for production deployment

### Debugging

Enable debug logs:
```bash
DEBUG=baileys:* bun run start
```

Check connection status:
```bash
curl http://localhost:3000/status
```

---

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
   ```bash
   bun run build
   ```

2. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

3. **Start the service**:
   ```bash
   bun run start
   ```

### Docker Deployment

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Process Management

Using PM2:
```bash
pm2 start ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'whatsapp-otp-api',
    script: 'bun',
    args: 'run start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

---

## 🛡️ Security Considerations

### Authentication
- Keep WhatsApp session files secure
- Regularly rotate session data
- Monitor for unauthorized access

### API Security
- Implement rate limiting for production use
- Add API key authentication
- Validate all input parameters

### Data Protection
- Encrypt sensitive configuration
- Use HTTPS in production
- Regular security audits

---

## 🤝 Contributing

We welcome contributions! Please see [src/locales/TRANSLATIONS.md](src/locales/TRANSLATIONS.md) for translation contributions.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Format with Prettier

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Common Issues

**Connection Problems:**
- Ensure WhatsApp Web is not open in other browsers
- Clear auth data and reconnect
- Check network connectivity

**Message Delivery:**
- Verify phone number format
- Check WhatsApp connection status
- Review error logs

**Localization Issues:**
- Verify locale parameter format
- Check available locales endpoint
- Validate translation files

### Getting Help

- 📚 Check the documentation
- 🐛 Report bugs via GitHub Issues
- 💡 Request features via GitHub Discussions
- 📧 Contact support for urgent issues

---

<div align="center">
  <p>Made with ❤️ for modern web applications</p>
  <p>
    <a href="#whatsapp-otp-api">Back to Top</a> •
    <a href="README_ID.md">Bahasa Indonesia</a> •
    <a href="src/locales/TRANSLATIONS.md">Contribute Translations</a>
  </p>
</div>
