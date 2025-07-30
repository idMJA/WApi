# 🌍 Translation & Localization Guide

<div align="center">
  <h3>Contributing to WhatsApp OTP API Translations</h3>
  <p>Help make this project accessible to users worldwide!</p>
  
  ![Localization](https://img.shields.io/badge/Localization-Ready-brightgreen?style=for-the-badge)
  ![Contributors](https://img.shields.io/badge/Contributors-Welcome-blue?style=for-the-badge)
</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Project Structure](#️-project-structure)
- [🌐 Currently Supported Languages](#-currently-supported-languages)
- [➕ Adding New Languages](#-adding-new-languages)
- [✅ Translation Guidelines](#-translation-guidelines)
- [🧪 Testing Translations](#-testing-translations)
- [👥 Contributors](#-contributors)
- [📞 Contact & Support](#-contact--support)

---

## 🎯 Overview

This project uses a flexible localization system that allows for easy addition of new languages and dynamic switching between locales. All OTP messages are fully translatable and can be customized per language.

### Key Features
- ✨ **Dynamic Locale Switching** - Change language per request
- 🔄 **Runtime Configuration** - No restart required
- 📝 **Template-based Messages** - Consistent formatting across languages
- 🛡️ **Type-safe Translations** - Full TypeScript support
- 🌍 **Extensible System** - Easy to add new languages

---

## 🏗️ Project Structure

```
src/locales/
├── types.ts          # TypeScript interfaces & type definitions
├── index.ts          # Main localization service
├── id.ts             # 🇮🇩 Indonesian (Bahasa Indonesia)
├── en.ts             # 🇺🇸 English
└── README.md         # Documentation (you are here)
```

### Core Files Description

| File | Purpose | Modify When |
|------|---------|-------------|
| `types.ts` | Interface definitions for translations | Adding new message types |
| `index.ts` | Core localization service logic | Adding new locale support |
| `{locale}.ts` | Individual language translation files | Adding/updating translations |

---

## 🌐 Currently Supported Languages

| Language | Code | Status | Translator | Quality |
|----------|------|--------|------------|---------|
| 🇮🇩 **Indonesian** | `id` | ✅ Complete | [@idMJA](https://github.com/idMJA) | Native |
| 🇺🇸 **English** | `en` | ✅ Complete | [@idMJA](https://github.com/idMJA) | Native |

### Translation Coverage

All languages include translations for:
- ✅ OTP message title
- ✅ Code label
- ✅ Validity duration message
- ✅ Security warning
- ✅ Hashtags and identifiers

---

## ➕ Adding New Languages

### Step-by-Step Guide

#### 1. Create Translation File

Create a new file `src/locales/{locale_code}.ts`:

```typescript
import type { LocaleTranslations } from './types';

export const {locale_code}: LocaleTranslations = {
	otp: {
		title: '🔐 Your OTP Code for {websiteName}',
		codeLabel: 'Code: {otp}',
		validityMessage: 'This code is valid for {minutes} minutes.',
		securityWarning: 'Do not share this code with anyone.',
		tags: '#OTP #Verification'
	}
};
```

#### 2. Update Type Definitions

Add your locale to `src/locales/types.ts`:

```typescript
export type SupportedLocale = 'id' | 'en' | 'your_locale';
```

#### 3. Register in Service

Update `src/locales/index.ts`:

```typescript
import { your_locale } from './your_locale';

const localeMap = {
	id,
	en,
	your_locale
};
```

#### 4. Update API Validation

Modify `src/controllers/locale.ts`:

```typescript
const SetLocaleSchema = z.object({
	locale: z.enum(['id', 'en', 'your_locale'] as const),
});
```

#### 5. Test Your Translation

Run the test suite to ensure everything works:

```bash
bun test
bun start
curl -X POST http://localhost:3759/locale -d '{"locale":"your_locale"}'
```

---

## ✅ Translation Guidelines

### 📝 Writing Quality Translations

1. **Keep Placeholders Intact**
   - Always preserve `{websiteName}`, `{otp}`, `{minutes}` exactly
   - These are replaced dynamically by the system

2. **Maintain Professional Tone**
   - Use formal language appropriate for security messages
   - Avoid casual or colloquial expressions

3. **Security Messaging**
   - Emphasize the importance of not sharing the code
   - Keep urgency appropriate to the context

4. **Cultural Adaptation**
   - Adapt emoji usage to cultural norms
   - Consider local communication styles

### 🎨 Message Structure

Each OTP message follows this structure:

```
{title}

{codeLabel}

{validityMessage}
{securityWarning}

{tags}
```

**Example Output (English):**
```
🔐 Your OTP Code for MyApp

Code: 123456

This code is valid for 5 minutes.
Do not share this code with anyone.

#OTP #Verification
```

---

## 🧪 Testing Translations

### Manual Testing

1. **Start the server:**
   ```bash
   bun start
   ```

2. **Set your locale:**
   ```bash
   curl -X POST http://localhost:3759/locale \
     -H "Content-Type: application/json" \
     -d '{"locale":"your_locale"}'
   ```

3. **Test OTP sending:**
   ```bash
   curl -X POST http://localhost:3759/send-otp \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber":"08123456789",
       "websiteName":"TestApp",
       "otp":"123456",
       "locale":"your_locale"
     }'
   ```

### Automated Testing

```bash
# Run type checking
bun run build

# Run tests
bun test

# Verify locale registration
curl http://localhost:3759/locale/supported
```

---

## 👥 Contributors

### Core Team

| Contributor | Role | Languages | GitHub Profile |
|-------------|------|-----------|----------------|
| **iaMJ** | Project Lead & Core Translator | 🇮🇩 Indonesian, 🇺🇸 English | [@idMJA](https://github.com/idMJA) |

### How to Become a Contributor

1. **Fork** this repository
2. **Create** a feature branch for your translation
3. **Add** your translation following the guidelines above
4. **Test** thoroughly in your local environment
5. **Submit** a Pull Request with:
   - Clear description of language added
   - Evidence of testing (screenshots/logs)
   - Your preferred attribution information

### Recognition

All contributors will be:
- ✨ Listed in this file with full attribution
- 🏆 Mentioned in project releases
- 🌟 Given contributor access for future updates
- 📢 Promoted in project documentation

---

## 📞 Contact & Support

### Getting Help

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/idMJA/WApi/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/idMJA/WApi/discussions)
- 🌍 **Translation Questions:** Create an issue with `translation` label
- 💬 **General Support:** Open a discussion or contact [@idMJA](https://github.com/idMJA)

### Translation Standards

We follow industry best practices for internationalization:
- 📚 **Reference:** [Mozilla L10n Style Guide](https://mozilla-l10n.github.io/styleguides/)
- 🎯 **Focus:** Security, clarity, and cultural appropriateness
- ⚡ **Updates:** Regular reviews and improvements welcome

---

<div align="center">
  <h3>🌟 Thank you for helping make this project globally accessible! 🌟</h3>
  <p>Every translation contributes to connecting users worldwide.</p>
  
  <a href="https://github.com/idMJA/WApi">⭐ Star this project</a> •
  <a href="https://github.com/idMJA/WApi/fork">🍴 Fork & Contribute</a> •
  <a href="https://github.com/idMJA/WApi/issues">🐛 Report Issues</a>
</div>
