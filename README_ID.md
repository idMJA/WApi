# WhatsApp OTP API

<div align="center">
  <h3>🚀 API Modern untuk Layanan OTP WhatsApp dengan Integrasi Baileys</h3>
  <p>API siap produksi untuk mengirim pesan OTP melalui protokol WhatsApp Web dengan dukungan multi-bahasa</p>
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
  ![ElysiaJS](https://img.shields.io/badge/ElysiaJS-8B5CF6?style=for-the-badge&logo=elysia&logoColor=white)
  ![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
</div>

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Manajemen Sesi
- **Sesi WhatsApp Persisten** - Pemulihan sesi otomatis menggunakan Baileys
- **Generasi QR Code** - Interface web sederhana untuk koneksi WhatsApp Web
- **Manajemen Auth State** - Database SQLite dengan Drizzle ORM untuk penyimpanan sesi yang andal

### 📱 Sistem Pengiriman OTP
- **Format Nomor Pintar** - Konversi format internasional otomatis
- **Pengiriman Pesan Andal** - Error handling yang robust dengan mekanisme fallback
- **Kustomisasi Template** - Template pesan OTP yang dapat dikonfigurasi

### 🌍 Internasionalisasi
- **Dukungan Multi-bahasa** - Lokalisasi Bahasa Indonesia dan Inggris
- **Pergantian Bahasa Runtime** - Konfigurasi locale dinamis per request
- **Sistem Terjemahan Extensible** - Penambahan bahasa baru yang mudah

### 🎨 Interface Admin
- **Tema Dark Modern** - Desain profesional terinspirasi Next.js
- **Status Real-time** - Status koneksi langsung dan statistik pesan
- **Desain Responsif** - Panel admin yang mobile-friendly

### 🛡️ Type Safety & Validasi
- **Cakupan TypeScript Penuh** - Type safety end-to-end
- **Validasi Schema Zod** - Validasi request runtime
- **Error Boundaries** - Error handling yang komprehensif

---

## 🚀 Memulai Cepat

### Prasyarat
- **Bun** >= 1.0.0
- **Node.js** >= 18.0.0 (untuk kompatibilitas)
- **SQLite** (termasuk dengan Bun)

### Instalasi

```bash
# Clone repository
git clone https://github.com/idMJA/WApi.git
cd WApi

# Install dependencies
bun install

# Jalankan server
bun run start
```

### Setup Awal

1. **Jalankan layanan**:
   ```bash
   bun run start
   ```

2. **Hubungkan WhatsApp**:
   - Buka `http://localhost:3000/admin.html`
   - Scan QR code dengan WhatsApp di ponsel Anda
   - Tunggu konfirmasi koneksi

3. **Test API**:
   ```bash
   curl -X POST http://localhost:3000/send-otp \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber": "+6281234567890",
       "otp": "123456",
       "websiteName": "AplikasiSaya",
       "locale": "id"
     }'
   ```

---

## 📖 Dokumentasi API

### URL Dasar
```
http://localhost:3000
```

### Endpoint

#### 🔐 Autentikasi

##### `GET /qr`
Generate QR code untuk koneksi WhatsApp Web.

**Response:**
```json
{
  "success": true,
  "qr": "data:image/png;base64,..."
}
```

##### `GET /status`
Cek status koneksi WhatsApp.

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "phoneNumber": "+6281234567890"
}
```

#### 📱 Layanan OTP

##### `POST /send-otp`
Kirim pesan OTP melalui WhatsApp.

**Request Body:**
```json
{
  "phoneNumber": "+6281234567890",
  "otp": "123456",
  "websiteName": "AplikasiSaya",
  "locale": "id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP berhasil dikirim"
}
```

**Parameter:**
- `phoneNumber` (string, wajib) - Nomor telepon tujuan dalam format internasional
- `otp` (string, wajib) - Kode OTP yang akan dikirim
- `websiteName` (string, opsional) - Nama aplikasi Anda
- `locale` (string, opsional) - Locale bahasa (`id` atau `en`, default `id`)

#### 🌍 Lokalisasi

##### `GET /locales`
Dapatkan semua locale yang tersedia.

**Response:**
```json
{
  "success": true,
  "locales": ["id", "en"]
}
```

##### `GET /locales/:locale`
Dapatkan terjemahan untuk locale tertentu.

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

## 🛠️ Konfigurasi

### Environment Variables

Buat file `.env` di root directory:

```env
# Konfigurasi Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=./auth_info_baileys/auth.db

# Lokalisasi
DEFAULT_LOCALE=id

# Konfigurasi WhatsApp
WHATSAPP_SESSION_PATH=./auth_info_baileys
```

### Lokalisasi Kustom

Untuk menambahkan bahasa baru:

1. Buat file bahasa baru di `src/locales/languages/`:
   ```typescript
   // src/locales/languages/fr.ts
   export const fr = {
     otpMessage: "Votre code OTP pour {websiteName} est: {otp}. Ce code expire dans 5 minutes.",
     defaultWebsiteName: "Notre Application"
   };
   ```

2. Update tipe locale:
   ```typescript
   // src/locales/types.ts
   export type Locale = 'id' | 'en' | 'fr';
   ```

3. Daftarkan bahasa:
   ```typescript
   // src/locales/languages/index.ts
   export { fr } from './fr';
   ```

---

## 🏗️ Arsitektur

### Struktur Proyek
```
├── src/
│   ├── config/          # Manajemen konfigurasi
│   ├── controllers/     # Request handler
│   ├── db/             # Database dan auth state
│   ├── locales/        # Internasionalisasi
│   ├── routes/         # Definisi route API
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types dan schema
│   └── utils/          # Helper utilities
├── auth_info_baileys/  # Penyimpanan sesi WhatsApp
├── admin.html          # Interface panel admin
└── test.html          # Interface testing
```

### Tech Stack

- **Runtime**: Bun untuk eksekusi JavaScript/TypeScript berkinerja tinggi
- **Framework**: ElysiaJS untuk pengembangan web API modern
- **Database**: SQLite dengan Drizzle ORM untuk operasi database type-safe
- **WhatsApp**: Baileys untuk implementasi protokol WhatsApp Web
- **Validasi**: Zod untuk type checking dan validasi runtime
- **UI**: HTML/CSS/JS vanilla dengan prinsip desain modern

---

## 🔧 Development

### Script

```bash
# Development server dengan hot reload
bun run dev

# Production build
bun run build

# Jalankan production server
bun run start

# Clean restart (hapus auth data)
bun run start:clean

# Jalankan test
bun run test

# API testing
bun run test:api
```

### Workflow Development

1. **Buat perubahan** pada source file
2. **Test lokal** menggunakan admin panel
3. **Validasi** dengan test API script
4. **Build** untuk deployment produksi

### Debugging

Enable debug logs:
```bash
DEBUG=baileys:* bun run start
```

Cek status koneksi:
```bash
curl http://localhost:3000/status
```

---

## 🚀 Deployment

### Deployment Produksi

1. **Build aplikasi**:
   ```bash
   bun run build
   ```

2. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

3. **Jalankan layanan**:
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

### Manajemen Proses

Menggunakan PM2:
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

## 🛡️ Pertimbangan Keamanan

### Autentikasi
- Jaga keamanan file sesi WhatsApp
- Rotasi data sesi secara teratur
- Monitor akses yang tidak sah

### Keamanan API
- Implementasikan rate limiting untuk penggunaan produksi
- Tambahkan autentikasi API key
- Validasi semua parameter input

### Perlindungan Data
- Enkripsi konfigurasi sensitif
- Gunakan HTTPS di produksi
- Audit keamanan reguler

---

## 🤝 Kontribusi

Kami menyambut kontribusi! Silakan lihat [src/locales/TRANSLATIONS.md](src/locales/TRANSLATIONS.md) untuk kontribusi terjemahan.

### Setup Development
1. Fork repository
2. Buat feature branch
3. Buat perubahan
4. Tambahkan test jika diperlukan
5. Submit pull request

### Code Style
- Ikuti best practice TypeScript
- Gunakan nama variabel yang bermakna
- Tambahkan komentar untuk logika kompleks
- Format dengan Prettier

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 🆘 Dukungan

### Masalah Umum

**Masalah Koneksi:**
- Pastikan WhatsApp Web tidak terbuka di browser lain
- Hapus auth data dan sambung ulang
- Periksa konektivitas jaringan

**Pengiriman Pesan:**
- Verifikasi format nomor telepon
- Periksa status koneksi WhatsApp
- Review error logs

**Masalah Lokalisasi:**
- Verifikasi format parameter locale
- Periksa endpoint locale yang tersedia
- Validasi file terjemahan

### Mendapatkan Bantuan

- 📚 Periksa dokumentasi
- 🐛 Laporkan bug melalui GitHub Issues
- 💡 Request fitur melalui GitHub Discussions
- 📧 Hubungi support untuk masalah urgent

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk aplikasi web modern</p>
  <p>
    <a href="#whatsapp-otp-api">Kembali ke Atas</a> •
    <a href="README.md">English</a> •
    <a href="src/locales/TRANSLATIONS.md">Kontribusi Terjemahan</a>
  </p>
</div>
