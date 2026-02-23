# LucidLLM Chat

[한국어](docs/README.ko.md) | [English](README.md) | [日本語](docs/README.ja.md) | [简体中文](docs/README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM** is a browser-based local Large Language Model (LLM) chat application that runs AI models entirely within your browser using [Transformers.js](https://huggingface.co/docs/transformers.js) and WebGPU technology. With zero-build architecture and complete privacy, it delivers powerful AI capabilities without sending any data to external servers.

> **Key Highlights:** 18,200+ lines of code • 4 languages • WebGPU/WASM inference • 60 FPS Token Streaming • OPFS File Explorer • AES-256 encrypted backups • OPFS model caching

## ✨ Key Features

### 🤖 AI & Model

| Feature | Description |
|---------|-------------|
| **Fully Local Inference** | All AI inference runs in-browser using Transformers.js; no data leaves your device |
| **Inference Device Toggle**| Switch between **WebGPU** and **WASM** at runtime for compatibility and performance |
| **OPFS Model Caching** | Origin Private File System stores models persistently without re-downloading |
| **OPFS Fetch Interceptor**| Supports **Range Requests** for efficient model loading |
| **HF Token Support** | Access private/gated models with your Hugging Face token |
| **Model Download Manager** | Supports pause/resume, retry with exponential backoff, quantization selection |
| **Model Audit & Update** | Verify model integrity and check for latest versions on HF |
| **Bootstrap Config** | Automatically applies `generation_config.json` upon first model load |
| **Pipeline Cache** | Memory cache for up to **4 active pipelines** for instant switching |

### 💬 Chat Experience

| Feature | Description |
|---------|-------------|
| **Multi-Session Chat** | Up to **10 independent chat sessions** with separate histories |
| **60 FPS Token Streaming** | Smooth, frame-limited streaming display with animated blinking cursor (▍) |
| **Smart Token Counter** | Intelligent token estimation accounting for CJK and ASCII characters |
| **LLM Parameters** | Real-time control over Top-P, Temperature, and Presence Penalty sliders |
| **Token Speed Statistics** | Shows Avg/Max/Min tokens per second |
| **Memory Usage Display** | Real-time memory consumption monitoring |
| **Abort Generation** | Stop AI response generation at any time with a single click |
| **System Prompt Editor** | Customizable assistant behavior (max 20 lines) |
| **Context Window Control** | Selectable context sizes: 4k, 8k, 16k, 32k, 128k |

### 📂 OPFS File Explorer

Manage your local model storage with a full-featured file explorer:
- **Directory Tree**: Visual navigation of the Origin Private File System.
- **File Operations**: Create, rename, move, and delete files/folders.
- **Drag & Drop**: Direct upload support for model files.
- **Context Menu**: Right-click actions for quick management.
- **Storage Stats**: Real-time display of used/available space.

### 👤 Profile System

Personalize your experience with a custom identity:
- **Custom Nicknames**: Set your own local user identity.
- **Avatar Support**: Upload and store your own profile images.
- **Customizable Identity**: Securely manage your local nickname and avatar.

### 🔄 Auto Update & PWA

Stay up to date with the latest features:
- **GitHub Release Sync**: Automatically checks for updates via GitHub API every 6 hours.
- **Update Notifications**: Visual badges and change-log modals for new releases.
- **Full PWA support**: Installable app with Service Worker caching and `SKIP_WAITING` update flow.

### 🔒 Privacy & Backup

| Feature | Description |
|---------|-------------|
| **Google Drive Backup** | Encrypted backup of settings and chat history to Google Drive |
| **AES-GCM-256 Encryption** | Client-side encryption with PBKDF2 key derivation (250,000 iterations) |
| **Gzip Compression** | Uses **CompressionStream API** for backup payloads |
| **Auto Backup** | Automatic backup on changes with debouncing (25s) |
| **Backup Restore & Undo**| Restore from snapshots with a **5-second undo** window for resets |
| **No Server Communication** | All data stays local unless explicitly backed up |

### 🌐 User Experience

| Feature | Description |
|---------|-------------|
| **Toast Notification** | Global system for success, info, warning, and error alerts |
| **State Lamp** | Color-coded status indicator for model loading and session states |
| **6-Tab Settings** | Categorized: Model, LLM, Profile, Appearance, Language, Backup |
| **4 Theme Options** | Dark, Light, OLED Black, and High-Contrast |
| **Accessibility** | Built-in **Focus Trap** for modal management and full keyboard support |
| **Keyboard Shortcuts** | Ctrl+N (new), Ctrl+Enter (send), Ctrl+L (focus), Ctrl+, (settings), etc. |

## ✅ Verified Models

These models have been tested and verified to work correctly in LucidLLM:

| Model Name | Quantization | Status | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | Verified | Pass |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | Verified | Pass |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, BNB4 | Verified | Pass |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | Verified | Pass |

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

## 🛠️ Developer guide

- **Global Namespace**: Access the app state and API via `window.LucidApp` in the console.
- **Monitoring API**: Review Network Event Logs and Chat Error Logs for debugging.
- **Runtime**: vanilla ES modules (no bundler required).
- **Key sources**:
  - `script/bootstrap.js` — startup & early i18n
  - `script/main.js` — Core logic, state, and UI rendering
  - `script/i18n.js` — i18n module (ko/en/ja/zh-CN)
  - `script/shared-utils.js` — Shared utilities & global API
  - `script/worker.js` — Web Worker for inference
  - `script/drive-backup.js` — Encrypted Google Drive backup
- **Tests**: Vitest unit tests (`npm test`), Playwright e2e tests (`npx playwright test`).

---

## 🔒 Security & privacy

- Inference and chat data remain local by default.
- Backups to Google Drive are optional and encrypted client-side.
- All model weights are stored in the secure **Origin Private File System (OPFS)**.

## 🏗️ Project Structure

```
LucidLLM/
├── index.html                  # Main HTML entry point
├── sw.js                       # Service Worker (PWA cache)
├── script/
│   ├── bootstrap.js            # App initialization & early i18n
│   ├── main.js                 # Core logic, state, UI rendering
│   ├── i18n.js                 # i18n module (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # Shared utilities & global API
│   ├── worker.js               # Web Worker for inference
│   └── drive-backup.js         # Encrypted Google Drive backup
├── docs/                       # Documentation & localized READMEs
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md
│   └── roadmap.md
├── favicon.svg                 # App icon
└── package.json                # NPM config
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | JavaScript (ES2020+ Modules) |
| **Architecture** | Zero-build, Vanilla JS (No Framework) |
| **ML Framework** | Transformers.js v4.0.0-next.1 |
| **Model Format** | ONNX |
| **Inference Backend** | WebGPU / WASM (automatic fallback) |
| **Storage** | Origin Private File System (OPFS), localStorage |
| **Compression** | CompressionStream API (Gzip) |
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
