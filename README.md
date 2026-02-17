# LucidLLM Chat

[English](README.md) | [한국어](README.ko.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v3.8.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Planned-blue)

**LucidLLM** is a browser-based local Large Language Model (LLM) chat application that runs AI models entirely within your browser using [Transformers.js](https://huggingface.co/docs/transformers.js) and WebGPU technology. With zero-build architecture and complete privacy, it delivers powerful AI capabilities without sending any data to external servers.

> **Key Highlights:** 18,200+ lines of code • 4 languages • WebGPU/WASM inference • Token Streaming • Custom Virtual DOM • AES-256 encrypted backups • OPFS model caching

## ✨ Key Features

### 🤖 AI & Model

| Feature | Description |
|---------|-------------|
| **Fully Local Inference** | All AI inference runs in-browser using Transformers.js; no data leaves your device |
| **WebGPU Acceleration** | GPU-accelerated inference with automatic WASM fallback for unsupported browsers |
| **OPFS Model Caching** | Origin Private File System stores models persistently without re-downloading |
| **Model Download Manager** | Supports pause/resume, retry with exponential backoff, quantization selection |
| **Multiple Model Support** | Load and switch between multiple cached ONNX models |
| **Model Card Display** | Shows model metadata (uploader, task, downloads, license, likes, tags, description) |
| **Hugging Face Integration** | Direct model lookup and download from Hugging Face model hub |

### 💬 Chat Experience

| Feature | Description |
|---------|-------------|
| **Multi-Session Chat** | Multiple independent chat tabs with separate conversation histories |
| **Real-time Token Streaming** | Live token generation with streaming display |
| **Token Speed Statistics** | Shows Avg/Max/Min tokens per second |
| **Memory Usage Display** | Real-time memory consumption monitoring |
| **System Prompt Editor** | Customizable assistant behavior (max 20 lines) |
| **Context Window Control** | Selectable context sizes: 4k, 8k, 16k, 32k, 128k |
| **Chat Export** | Export conversations as JSON files |
| **Auto-scroll** | Automatic scroll-to-bottom with manual override button |

### 🔒 Privacy & Backup

| Feature | Description |
|---------|-------------|
| **Google Drive Backup** | Encrypted backup of settings and chat history to Google Drive |
| **AES-GCM-256 Encryption** | Client-side encryption with PBKDF2 key derivation (250,000 iterations) |
| **Gzip Compression** | Optional compression for backup payloads |
| **Auto Backup** | Automatic backup on changes with debouncing (25s) |
| **Backup Restore** | Restore from previous backup snapshots with overwrite option |
| **Backup Version History** | Multiple backup versions maintained on Drive |
| **No Server Communication** | All data stays local unless explicitly backed up |

### 🌐 User Experience

| Feature | Description |
|---------|-------------|
| **4-Language Support** | Korean, English, Japanese, Simplified Chinese with auto-detection |
| **3 Theme Options** | Dark, Light, OLED Black (pure black for OLED displays) |
| **Responsive Design** | Mobile-first with full smartphone/tablet support |
| **PWA Support** | Progressive Web App features (Planned) |
| **Sidebar Navigation** | Collapsible sidebar with chat and workspace panels |
| **Keyboard Shortcuts** | Ctrl+Shift+N (new chat), Ctrl+Shift+E (export), Ctrl+B (toggle sidebar) |

## 📋 Requirements

### Browser Requirements

| Requirement | Details |
|-------------|---------|
| **Minimum Browser** | Chrome 113+ / Edge 113+ (for WebGPU) |
| **Fallback Support** | Any browser with WASM support |
| **Security Context** | HTTPS or localhost required (OPFS) |
| **JavaScript** | ES2020+ with Module support |

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 4GB | 8GB+ |
| **Storage** | Varies by model (100MB - 2GB per model) | SSD recommended |
| **GPU** | Integrated graphics | Dedicated GPU with WebGPU support |

### Recommended Models

| Model | Size | Quantization | Use Case |
|-------|------|--------------|----------|
| SmolLM2-135M-Instruct | ~135M | FP32, BNB4 | Testing/Development |
| Qwen2.5-0.5B-Instruct | ~500M | Q4_K_M | Balanced performance |
| Phi-3-mini-4k-instruct | ~3.8B | Q4_K_M | High-quality responses |

## 🚀 Getting Started

### Hosted Version

Access the GitHub Pages deployment directly to use without installation:

👉 **[Live Demo](https://ergo9ine.github.io/LucidLLM/)**

### Local Execution

1. **Clone Repository**

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
```

2. **Run Local Server**

A security context (HTTPS or localhost) is required for OPFS and Service Worker usage.

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# Or use the included npm script
npm run serve
```

3. **Access via Browser**

Access `http://localhost:8000` (or the port you used). Chrome or Edge is recommended.

### Development Dependencies (Optional)

```bash
npm install
```

Runtime dependencies (Transformers.js, Tailwind CSS, Lucide Icons, Google Fonts) are loaded from CDN, so no separate build process is required.

## 📖 Usage Guide

### 1. Loading a Model

1. Click the **Settings** button (⚙️) in the header.
2. Navigate to the **Model Management** tab.
3. Enter a Hugging Face Model ID (e.g., `onnx-community/SmolLM2-135M-Instruct`).
4. Click **Fetch** to retrieve model information.
5. Select a quantization level from the dropdown.
6. Click **Download** to cache the model in OPFS (supports pause/resume).
7. After download completes, click **Activate** to load the model.

### 2. Starting a Chat

1. Type a message in the input field at the bottom.
2. Click **Send** or press `Enter` to submit.
3. Create new chat sessions using the **+** button in the tab bar.
4. Switch between sessions by clicking on chat tabs.

### 3. Configuring LLM Settings

Navigate to **Settings > LLM Settings**:

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| **System Prompt** | "You are a helpful assistant." | Max 20 lines | Define assistant behavior |
| **Max Output Tokens** | 512 | 1 - 32,768 | Control response length |
| **Context Window** | 8k | 4k/8k/16k/32k/128k | Select context size |
| **Temperature** | 0.9 | 0.1 - 2.0 | Response randomness |
| **Top P** | 0.9 | 0.1 - 1.0 | Nucleus sampling |
| **Presence Penalty** | 0 | -2.0 - 2.0 | Repetition control |

### 4. Inference Device Selection

Switch via the dropdown on the right side of the header:

- **⚡ WebGPU** — GPU-accelerated inference (Recommended for performance).
- **🧩 CPU (WASM)** — Fallback for browsers without WebGPU support.

### 5. Google Drive Backup

1. Go to **Settings > Backup & Restore**.
2. Enter Google OAuth Client ID (optional: Client Secret).
3. Click **Connect Google Drive** and authenticate.
4. Enable **Auto backup on change** for automatic backups.
5. Use **Backup Now** for manual backups.
6. Restore from previous backup snapshots using the **Restore** button.

## 🏗️ Project Structure

```
LucidLLM/
├── index.html                  # Main HTML entry point (728 lines)
├── bootstrap.js                # App initialization (62 lines)
├── main.js                     # Core application logic (~12,600 lines)
├── i18n.js                     # Internationalization module (~2,050 lines, 4 languages)
├── shared-utils.js             # Shared utilities & global API (~450 lines)
├── transformers-bridge.js      # Transformers.js interface layer (13 lines)
├── worker.js                   # Web Worker for inference (~200 lines)
├── drive-backup.js             # Google Drive backup with encryption (~250 lines)
├── style.css                   # Custom styles and theme definitions (~1,140 lines)
├── favicon.svg                 # App icon
├── package.json                # NPM package configuration
├── docs/
│   ├── roadmap.md              # Feature roadmap
│   └── compatibility.md        # Model compatibility information
└── tests/                      # Test suite (Vitest)
```

**Total: ~18,200+ lines of code**

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | JavaScript (ES2020+ Modules) |
| **Architecture** | Zero-build, Vanilla JS (No Framework) |
| **ML Framework** | Transformers.js v3.8.1 |
| **Inference Backend** | WebGPU / WASM (automatic fallback) |
| **Storage** | Origin Private File System (OPFS), localStorage |
| **Styling** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **Icons** | Lucide Icons (CDN) |
| **Fonts** | Space Grotesk (Google Fonts) |
| **Offline** | Planned (Service Worker) |
| **Backup Auth** | Google Identity Services (OAuth 2.0) |
| **Encryption** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **Compression** | CompressionStream API (Gzip) |
| **CDN** | jsDelivr, unpkg |

## 🔧 Configuration

### Stored Settings (localStorage)

| Category | Settings |
|----------|----------|
| **LLM** | System prompt, max tokens, context window, HF token, temperature, top_p, presence_penalty |
| **Profile** | Nickname, avatar, language, theme |
| **Inference** | Preferred device (webgpu/wasm) |
| **Backup** | Client ID, auto backup, backup limit, last sync |

### Key Storage Locations

| Storage | Purpose |
|---------|---------|
| `lucid_user_profile_v1` | User profile (nickname, avatar, language, theme) |
| `lucid_system_prompt` | System prompt configuration |
| `lucid_max_output_tokens` | Max output tokens setting |
| `lucid_context_window` | Context window size |
| `lucid_inference_device` | Inference device preference |
| `lucid_google_drive_*` | Google Drive backup settings |

## 🧪 Development Guide

### Code Conventions

- **ES Modules** — All application code uses ES Module syntax.
- **Centralized State Management** — Global state managed in single `state` object.
- **Native Architecture** — Vanilla JS core with a custom Virtual DOM implementation for high-performance dynamic UI rendering.
- **Internationalization (i18n)** — 200+ translation keys with hierarchical fallback.
- **Accessibility** — ARIA attributes, keyboard navigation, focus management.
- **Responsive Design** — Mobile-first with media queries and Tailwind CSS.

### Key Modules

#### `i18n.js` - Internationalization

```javascript
import { t, I18N_KEYS, setCurrentLanguage } from './i18n.js';

// Set language
setCurrentLanguage('ko');

// Translate with variables
t(I18N_KEYS.STATUS_MODEL_LOADING, { model: 'SmolLM2' });
// → "SmolLM2 로딩 중..."

// Apply to DOM
applyI18nToDOM(document);
```

**Supported Languages:** Korean, English, Japanese, Simplified Chinese

#### `shared-utils.js` - Utilities

```javascript
import {
    formatBytes,
    formatSpeed,
    formatEta,
    getErrorMessage,
    publishLucidApi
} from './shared-utils.js';

// Format file size
formatBytes(1024 * 1024 * 500);  // → "500 MB"

// Format speed
formatSpeed(1024 * 512);  // → "512 KB/s"

// Format time
formatEta(3665);  // → "1 시간"

// Expose API globally
publishLucidApi({ myFunction: () => {} });
```

### Running Tests

```bash
# Run test suite
npm test

# Test i18n module in browser
# Open test-i18n.html in browser
```

### Building for Production

**No build step required!** The application is zero-build and runs directly from static files.

## 🗺️ Roadmap

### Completed

- [x] Optimized i18n system with lazy loading (200+ keys)
- [x] Key namespace constants for i18n
- [x] Hierarchical fallback structure for translations
- [x] OPFS fetch interceptor for model caching
- [x] Client-side encryption for backups
- [x] Multi-session chat with independent histories
- [x] Real-time token speed statistics

### In Progress

- [x] Streaming responses with token-by-token output
- [ ] Markdown rendering with code syntax highlighting
- [ ] Message editing and regeneration

### Planned

- [ ] Multimodal input (image analysis with Vision models)
- [ ] Model comparison mode
- [ ] Automatic quantization recommendation
- [ ] RAG support for local documents
- [ ] Function calling interface
- [ ] Conversation branching (fork)
- [ ] Voice input/output via Web Speech API
- [ ] Web App Manifest for PWA installation
- [ ] Push notifications for long inference tasks

See [docs/roadmap.md](docs/roadmap.md) for the complete roadmap.

## 🤝 Contributing

Contributions are always welcome! If you find a bug or want to suggest a new feature, please register an Issue or send a Pull Request.

### How to Contribute

1. **Fork** this repository.
2. Create a feature branch from the `main` branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Follow **existing code styles**:
   - ES Modules
   - No Framework
   - Direct DOM Manipulation
4. **Add tests** in the `tests/` directory for new utility functions.
5. Test functionality in the browser:
   - Model loading
   - Chat workflow
   - Settings management
6. **Do not commit**:
   - `node_modules/`
   - Editor settings
   - Build artifacts
7. Commit changes and create a Pull Request.

### Issue Reporting

Please include the following information when registering a GitHub Issue:

- Browser name and version
- OS and version
- Steps to reproduce
- Expected vs Actual behavior
- Console error logs (if applicable)
- Screenshots (if applicable)

### Compatibility Reporting

Some models may not be compatible with WASM or WebGPU environments depending on quantization levels. Please register compatible models in GitHub Issues with the following information:

- Model Name
- Repository (HF, Github URL)
- Quantization Level
- Version or Hash
- Performance notes (tokens/sec, memory usage)

See [docs/compatibility.md](docs/compatibility.md) for known compatible models.

## 📊 Performance Benchmarks

| Model | Device | Tokens/sec | Memory | First Token |
|-------|--------|------------|--------|-------------|
| SmolLM2-135M | WebGPU | ~45 tok/s | 800 MB | ~2s |
| SmolLM2-135M | WASM | ~8 tok/s | 600 MB | ~5s |
| Qwen2.5-0.5B | WebGPU | ~25 tok/s | 1.2 GB | ~3s |
| Phi-3-mini | WebGPU | ~12 tok/s | 2.5 GB | ~5s |

*Performance varies by hardware. Tested on M2 MacBook Pro.*

## 🔒 Security

- **Client-Side Encryption** — AES-GCM-256 with PBKDF2 key derivation (250,000 iterations)
- **No Telemetry** — No analytics or tracking code
- **Local Data Storage** — All data stays in browser unless explicitly backed up
- **Secure Context Required** — HTTPS or localhost for OPFS/Service Worker

## 📚 Documentation

- [Roadmap](docs/roadmap.md) - Feature roadmap and planned improvements
- [Compatibility](docs/compatibility.md) - Model compatibility information
- [LICENSE](LICENSE) - MIT License

## 🌐 Internationalization (i18n)

This project provides multilingual support through `i18n.js` with 200+ translation keys. The language is automatically detected based on your browser's language settings, and you can manually change it in the Settings menu.

**Supported Languages:**
- 🇰🇷 한국어 (Korean)
- 🇺🇸 English
- 🇯🇵 日本語 (Japanese)
- 🇨🇳 简体中文 (Simplified Chinese)

### Adding a New Language

1. Open `i18n.js`.
2. Add language-specific translations in the appropriate section.
3. Add overrides for `ja` or `zh-CN` if they inherit from English.
4. Update `SUPPORTED_LANGUAGES` array.

```javascript
// Example: Adding German
const DE_SPECIFIC = {
    [I18N_KEYS.HEADER_SETTINGS]: "Einstellungen",
    [I18N_KEYS.CHAT_PLACEHOLDER]: "Nachricht eingeben...",
    // ...
};
```

## 🏆 Notable Technical Achievements

### 1. High-Performance Virtual DOM
The application uses a custom, lightweight Virtual DOM implementation (`vdom.js`) to handle complex UI updates (like model tables and chat lists) with minimal overhead while maintaining zero-dependency simplicity.

### 2. Zero-Build Architecture
The entire application runs directly from static files without any build process. All dependencies are loaded from CDN.

### 3. OPFS Fetch Interceptor
Custom fetch interceptor transparently serves cached model files from OPFS, making remote Hugging Face requests appear as local file reads.

### 4. Hierarchical i18n System
- 200+ translation keys with `I18N_KEYS` constants
- Hierarchical fallback: Current → English → Korean
- Lazy-loaded dictionaries with caching
- Automatic DOM translation via `data-i18n` attributes

### 5. Client-Side Encryption
Complete backup encryption using Web Crypto API:
- PBKDF2 key derivation (250,000 iterations)
- AES-GCM-256 encryption
- Gzip compression support

### 6. Streaming Token Generation
Real-time token streaming with:
- Beam search callback parsing
- Delta computation for incremental display
- Token speed statistics (avg/max/min)
- Throttled rendering (60 FPS max)

### 7. Download Manager
Robust download system with:
- Pause/resume support
- Exponential backoff retry (3 retries, 800ms base)
- Progress tracking (speed, ETA, bytes)
- Queue management for multi-file models

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) - Transformers.js and model hosting
- [Transformers.js](https://huggingface.co/docs/transformers.js) - In-browser ML inference
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - Font family

---

**Made with ❤️ for privacy-focused AI**

[⬆ Back to top](#lucidllm-chat)
