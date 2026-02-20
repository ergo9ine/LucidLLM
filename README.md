# LucidLLM Chat

[한국어](docs/README.ko.md) | [English](README.md) | [日本語](docs/README.ja.md) | [简体中文](docs/README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0-yellow)
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
| **Abort Generation** | Stop AI response generation at any time with a single click |
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
| **4 Theme Options** | Dark, Light, OLED Black (pure black for OLED displays), High-Contrast |
| **Responsive Design** | Mobile-first with full smartphone/tablet/desktop support |
| **PWA Support** | Progressive Web App features (Planned) |
| **Sidebar Navigation** | Collapsible sidebar with chat and workspace panels |
| **Keyboard Shortcuts** | Ctrl+N (new chat), Ctrl+Enter (send), Ctrl+L (focus input), Ctrl+, (settings), Ctrl+Shift+Backspace (delete), Ctrl+Shift+E (export), Ctrl+B (sidebar), Ctrl+/ (help) |

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
| Qwen2.5-0.5B-Instruct | ~500M | Q4 | Balanced performance |
| Phi-4-mini-instruct | ~3.8B | Q4 | High-quality responses |

## 🚀 Quickstart

### Hosted demo

Try the GitHub Pages demo (no install required):

👉 **https://ergo9ine.github.io/LucidLLM/**

### Local — static, zero‑build

1. Clone the repo and serve the folder (HTTPS or localhost recommended for OPFS):

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm run serve    # serves site at http://localhost:3000
```

(Alternatives: `python -m http.server 8000` or `npx serve .`)

Open the app in Chrome/Edge and go to Settings → Model Management to fetch and activate a model.

### Development & tests

- Optional: `npm install` (only required for running tests/development tools)
- Run unit tests: `npm test` (Vitest)
- Run end-to-end tests: `npx playwright test`

---

## 📖 Usage Guide

### 1. Loading a Model

1. Click the **Settings (⚙️)** button in the header.
2. Navigate to the **Model Management** tab.
3. Enter a Hugging Face model ID (e.g., `onnx-community/SmolLM2-135M-Instruct`).
4. Click **Lookup** to fetch model information.
5. Select your preferred **Quantization** option.
6. Click **Download** to cache the model in OPFS (supports resume).
7. Once downloaded, click **Activate** to load the model.

### 2. Chatting

1. Type a message in the input box and press **Send** or `Ctrl+Enter`.
2. Click the **+** button in the tab bar to start a new chat session.
3. Click any tab to switch between multiple conversation sessions.
4. Click the **Stop** button (or press `Ctrl+Shift+Backspace`) to abort generation at any time.

### 3. LLM Settings

Navigate to **Settings > LLM Settings** to configure:

| Setting | Default | Description |
|---------|---------|-------------|
| **System Prompt** | "You are a helpful assistant." | Defines the AI's role and personality |
| **Max Output Tokens** | 512 | Maximum tokens per response |
| **Context Window** | 8k | How much conversation history the model retains |
| **Temperature** | 0.9 | Controls response creativity and randomness |

### 4. Google Drive Backup

1. Go to **Settings > Backup & Restore**.
2. Click **Connect Google Drive** to log in (Client ID is pre-configured).
3. Enable **Auto Backup** to save changes automatically (debounced 25s).
4. Click **Backup Now** for an immediate manual backup.
5. Select a restore point from the list and click **Restore** to revert.

---

## 🛠️ Developer guide

- Runtime: vanilla ES modules (no bundler required to run the app in the browser).
- Key sources:
  - `script/bootstrap.js` — startup & hydration
  - `script/main.js` — UI state, actions and rendering
  - `script/i18n.js` — internationalization module (Korean, English, Japanese, Simplified Chinese)
  - `script/worker.js` — inference worker & pipeline management
  - `script/shared-utils.js` — shared utilities & global API
  - `script/drive-backup.js` — encrypted Drive backup flow
- Tests: Vitest unit tests (`npm test`), Playwright e2e tests (`npx playwright test`).
- Debugging tips: open DevTools, inspect `state` in console, review `opfs` manifest and `transformers` pipeline cache.

---

## 🤝 Contributing

- Open an issue to discuss large changes before implementation.
- PR flow: fork → branch → PR with clear description and screenshots (if UI change).
- Include tests for new logic and keep changes backwards-compatible where possible.

---

## 🔒 Security & privacy

- Inference and chat data remain local by default.
- Backups to Google Drive are optional and encrypted client-side.
- Avoid uploading sensitive models or data to public locations.

## 🏗️ Project Structure

```
LucidLLM/
├── index.html                  # Main HTML entry point
├── script/
│   ├── bootstrap.js            # App initialization
│   ├── main.js                 # Core application logic
│   ├── i18n.js                 # Internationalization module
│   ├── shared-utils.js         # Shared utilities & global API
│   ├── worker.js               # Web Worker for inference
│   └── drive-backup.js         # Google Drive backup with encryption
├── docs/                       # Documentation & localized READMEs
├── favicon.svg                 # App icon
└── package.json                # NPM package configuration
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | JavaScript (ES2020+ Modules) |
| **Architecture** | Zero-build, Vanilla JS (No Framework) |
| **ML Framework** | Transformers.js v4.0.0 |
| **Inference Backend** | WebGPU / WASM (automatic fallback) |
| **Storage** | Origin Private File System (OPFS), localStorage |
| **Styling** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **Icons** | Lucide Icons (CDN) |
| **Fonts** | Space Grotesk (Google Fonts) |
| **Backup Auth** | Google Identity Services (OAuth 2.0) |
| **Encryption** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **CDN** | jsDelivr, unpkg |
| **Testing** | Vitest (unit), Playwright (e2e) |

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
