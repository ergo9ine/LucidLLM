# LucidLLM Chat

[한국어](docs/README.ko.md) | [English](README.md) | [日本語](docs/README.ja.md) | [简体中文](docs/README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM** is a browser-based local Large Language Model (LLM) chat application that runs AI models entirely within your browser using [Transformers.js](https://huggingface.co/docs/transformers.js) and WebGPU technology. With zero-build architecture and complete privacy, it delivers powerful AI capabilities without sending any data to external servers.

> **Key Highlights:** 17,000+ lines of source code • 511 i18n keys across 4 languages • Recommended Models • WebGPU/WASM dual inference • 60 FPS Token Streaming • OPFS File Explorer • AES-256 encrypted Google Drive backup • Zero npm dependencies

## ✨ Key Features

### 🤖 AI & Model

| Feature | Description |
|---------|-------------|
| **Fully Local Inference** | All AI inference runs in-browser using Transformers.js; no data leaves your device |
| **Inference Device Toggle** | Switch between **WebGPU** and **WASM** at runtime for compatibility and performance |
| **OPFS Model Caching** | Origin Private File System stores models persistently without re-downloading |
| **OPFS Fetch Interceptor** | Worker-level fetch interception with **Range Request** support for efficient model loading |
| **External Data Support** | Automatic detection and loading of ONNX external data files (`.onnx_data`, `.onnx.data`) with multi-shard support |
| **HF Token Support** | Access private/gated models with your Hugging Face token |
| **Model Download Manager** | Supports pause/resume, retry with exponential backoff, quantization selection, and auto-quota reclamation |
| **Recommended Models** | Pre-configured verified models with one-click download from the Model tab |
| **Model Audit & Update** | Verify model integrity and check for latest versions on Hugging Face |
| **Bootstrap Config** | Automatically applies `generation_config.json` (temperature, top_p, max_length, repetition_penalty) upon first model load |
| **Pipeline Cache** | Memory cache for up to **4 active pipelines** for instant switching with graceful GPU cleanup |

### 💬 Chat Experience

| Feature | Description |
|---------|-------------|
| **Multi-Session Chat** | Up to **10 independent chat sessions** with separate histories |
| **60 FPS Token Streaming** | Smooth, frame-limited streaming display with animated blinking cursor (▍) |
| **Smart Token Counter** | Intelligent token estimation accounting for CJK and ASCII characters |
| **LLM Parameters** | Real-time control over Top-P, Temperature, and Presence Penalty sliders |
| **Token Speed Statistics** | Shows Avg/Max/Min tokens per second during inference |
| **Memory Usage Display** | Real-time memory consumption monitoring |
| **Abort Generation** | Graceful abort with GPU buffer cleanup — stop AI response at any time |
| **Message Edit & Regenerate** | Edit any user message and regenerate the AI response |
| **Conversation Branching** | Fork conversations from any point to explore alternative responses |
| **Conversation Export** | Export chat history as JSON for archival |
| **System Prompt Editor** | Customizable assistant behavior (max 20 lines) |
| **Context Window Control** | Selectable context sizes: 4k, 8k, 16k, 32k, 128k |

### 📂 OPFS File Explorer

Manage your local model storage with a full-featured file explorer:
- **Directory Tree**: Visual navigation of the Origin Private File System
- **File Operations**: Create, rename, move, and delete files/folders
- **Drag & Drop**: Direct upload support for model files
- **Context Menu**: Right-click actions for quick management
- **Storage Stats**: Real-time display of used/available space

### 👤 Profile System

Personalize your experience with a custom identity:
- **Custom Nicknames**: Set your own local user identity
- **Avatar Support**: Upload and store your own profile images
- **Backup Key Derivation**: Your nickname becomes part of the encryption key for Google Drive backups

### 🔄 Auto Update & PWA

Stay up to date with the latest features:
- **GitHub Release Sync**: Automatically checks for updates via GitHub API every 6 hours
- **Update Notifications**: Visual badges and changelog modals for new releases
- **Full PWA Support**: Installable app with Service Worker caching (`cache-first` for app assets, `network-then-cache` for WASM binaries)
- **Skip Waiting**: Seamless update flow with `SKIP_WAITING` message protocol

### 🔒 Privacy & Backup

| Feature | Description |
|---------|-------------|
| **Google Drive Backup** | Encrypted backup of settings and chat history to Google Drive |
| **AES-GCM-256 Encryption** | Client-side encryption with PBKDF2 key derivation (250,000 iterations) |
| **Gzip Compression** | Uses **CompressionStream API** for efficient backup payloads |
| **Auto Backup** | Automatic backup on changes with debouncing (25s) |
| **Backup Restore & Undo** | Restore from snapshots with a **5-second undo** window for resets |
| **No Server Communication** | All data stays local unless explicitly backed up |

### 🌐 User Experience

| Feature | Description |
|---------|-------------|
| **Toast Notification** | Global notification system for success, info, warning, and error alerts |
| **State Lamp** | Color-coded status indicator for model loading and session states |
| **6-Tab Settings** | Categorized: Model, LLM, Profile, Appearance, Language, Backup |
| **4 Theme Options** | Dark (default), Light, OLED Black, and High-Contrast |
| **Font Size Control** | Adjustable font scale with CSS custom properties |
| **Accessibility** | Built-in **Focus Trap** for modal management and full keyboard support |
| **Keyboard Shortcuts** | Ctrl+N (new), Ctrl+Enter (send), Ctrl+L (focus), Ctrl+, (settings), Ctrl+Shift+Backspace (abort) |

## ✅ Verified Models

These models have been tested and verified to work correctly in LucidLLM:

| Model Name | Quantization | Status | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | Verified | Pass |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | Verified | Pass |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, UINT8, BNB4 | Verified | Pass |
| [willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX](https://huggingface.co/willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | Verified | Pass |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | Verified | Pass |

> **Sanity QA**: Each model must correctly answer "What is gravity?" and "What is the capital of France?" — see [compatibility.md](docs/compatibility.md) for details.

## 🏛️ Architecture

```
index.html → bootstrap.js (entry)
               ├─ i18n.js           Translations (511 keys × 4 languages, ~2,700 lines)
               ├─ shared-utils.js   Pure utilities & constants (50 exports, ~1,000 lines)
               └─ main.js           Core: UI, state, OPFS, inference orchestration (~12,600 lines)
                    ├─ drive-backup.js   AES-GCM encrypt/decrypt, gzip, Drive payload format (~300 lines)
                    └─ worker.js         Web Worker — Transformers.js pipeline, OPFS fetch interception (~540 lines)
```

- **No build step.** All source files are native ES Modules served directly
- **Single `state` object** (~170 fields) manages the entire application state
- **`els` object** caches 200+ DOM elements for zero-query rendering
- **`window.LucidApp`** exposes a public debug/API surface for console access
- **Web Worker** handles model loading and inference in a separate thread; communicates via `postMessage` protocol with typed message enums (`WORKER_MSG`)
- **`window.fetch` monkey-patch** in Worker intercepts Hugging Face URLs to serve from OPFS cache first

## 📋 Requirements

### Browser Requirements

| Requirement | Details |
|-------------|---------|
| **Recommended** | Chrome 113+ / Edge 113+ (WebGPU support) |
| **Fallback** | Any modern browser with WASM support |
| **Security** | HTTPS or localhost required for OPFS |
| **JavaScript** | ES2020+ with Module support |

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | Varies by model (100 MB – 5 GB per model) | SSD recommended |
| **GPU** | Integrated graphics | Dedicated GPU with WebGPU support |

## 🚀 Quickstart

### Hosted Demo

Try the GitHub Pages demo (no install required):

👉 **https://ergo9ine.github.io/LucidLLM/**

> **Tip:** Deploy to Cloudflare Pages for multi-threaded WASM inference via COOP/COEP headers.

### Local — static, zero-build

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npx serve -s . -l 3000    # serves at http://localhost:3000
```

Open the app in Chrome/Edge and go to **Settings → Model Management** to fetch and activate a model.

## 📖 User Guide

### 1. Model Loading

1. Open **Settings (Ctrl+,) → Model Management**.
2. Enter a Hugging Face model ID (e.g., `HuggingFaceTB/SmolLM2-135M-Instruct`) or select one from the **Recommended Models** list.
3. Click **Fetch** to retrieve model metadata, then select a quantization and click **Download**.
4. Downloads support pause/resume and auto-retry with exponential backoff.

### 2. Starting Chat

1. Once a model is downloaded, click **Activate** in the session table.
2. Wait for the state lamp to turn green (Loaded).
3. Type your message and press **Ctrl+Enter** or click **Send**.
4. Use the **+** button in the tab bar to create new chat sessions (up to 10).

### 3. LLM Configuration

Adjust generation parameters in **Settings → LLM**:

| Setting | Default | Description |
|---------|---------|-------------|
| **System Prompt** | "You are a helpful assistant." | Defines the AI's role and personality |
| **Max Tokens** | 512 | Maximum length of a single response |
| **Context Window** | 8k | How much conversation the model remembers |
| **Temperature** | 0.9 | Controls response creativity and randomness |
| **Top-P** | 0.95 | Nucleus sampling threshold |

### 4. Google Drive Backup

1. Go to **Settings → Backup & Restore**.
2. Click **Connect to Google Drive** and sign in.
3. Enable **Auto Backup** for automatic saves (25s debounce).
4. Data is encrypted client-side using your nickname as part of the key derivation.
5. Restore from any snapshot with a 5-second undo window.

## 🚢 Deployment

### GitHub Pages

Works out of the box. Note: GitHub Pages does not support custom response headers, so `SharedArrayBuffer` is unavailable and WASM inference is limited to single-threaded mode.

### Cloudflare Pages

For full multi-threaded WASM inference, deploy to Cloudflare Pages. The `_headers` file in the repo root configures the required headers:

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

These headers enable `SharedArrayBuffer`, which is required for multi-threaded ONNX Runtime WASM execution.

### Self-hosted

Any static file server with HTTPS support will work:

```bash
npx serve -s . -l 3000                      # Node.js
python -m http.server 8000                   # Python
```

For multi-threaded WASM, configure your server to send COOP/COEP headers on all responses.

## 🛠️ Development

### Setup

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm install    # Only needed for tests/dev tools
```

### Running

```bash
npx serve -s . -l 3000    # Zero-build — edit files and reload
```

### Testing

```bash
cd test && npm test        # Vitest unit tests
npx playwright test        # E2E tests (Chromium, downloads real models)
```

- E2E tests force WASM device (`lucid_inference_device = 'wasm'`) since headless Chromium lacks WebGPU.
- First E2E run may take 10+ minutes to download test models.

### Console API

Access the app state and API via `window.LucidApp` in the browser console for debugging and inspection.

### Key Sources

| File | Lines | Purpose |
|------|-------|---------|
| `script/bootstrap.js` | ~106 | Startup, early i18n, Service Worker registration |
| `script/main.js` | ~12,600 | Core logic, state machine, UI rendering, OPFS management |
| `script/i18n.js` | ~2,700 | 511 translation keys × 4 languages (ko/en/ja/zh-CN) |
| `script/shared-utils.js` | ~1,000 | 50 pure utility functions and constants |
| `script/worker.js` | ~540 | Web Worker for Transformers.js inference pipeline |
| `script/drive-backup.js` | ~300 | AES-GCM encryption, gzip compression, Drive API helpers |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | JavaScript (ES2020+ Modules) |
| **Architecture** | Zero-build, Vanilla JS, No Framework, No npm dependencies |
| **ML Framework** | Transformers.js v4.0.0-next.1 |
| **Model Format** | ONNX (with external data support) |
| **Inference Backend** | WebGPU / WASM (automatic fallback) |
| **Storage** | Origin Private File System (OPFS), localStorage |
| **Encryption** | Web Crypto API (PBKDF2 + AES-GCM-256) |
| **Compression** | CompressionStream API (Gzip) |
| **Styling** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **Icons** | Lucide Icons (CDN) |
| **Fonts** | Space Grotesk (Google Fonts) |
| **Auth** | Google Identity Services (OAuth 2.0) |
| **CDN** | jsDelivr, unpkg |
| **Testing** | Vitest (unit), Playwright (E2E) |

## 🔒 Security & Privacy

- All inference and chat data remain local by default — nothing is sent to any server.
- Google Drive backups are optional and encrypted client-side with AES-GCM-256 before upload.
- Model weights are stored in the secure **Origin Private File System (OPFS)**, sandboxed from other origins.
- No analytics, no telemetry, no tracking.

## 🏗️ Project Structure

```
LucidLLM/
├── index.html                  # Main HTML entry point (1,200+ lines)
├── sw.js                       # Service Worker (PWA cache, v1.2.0)
├── _headers                    # Cloudflare Pages COOP/COEP headers
├── script/
│   ├── bootstrap.js            # App initialization & early i18n
│   ├── main.js                 # Core logic, state, UI rendering
│   ├── i18n.js                 # i18n module (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # Shared utilities & global API
│   ├── worker.js               # Web Worker for inference
│   └── drive-backup.js         # Encrypted Google Drive backup
├── vendor/
│   └── transformers/           # Self-hosted Transformers.js + ONNX Runtime WASM
├── test/                       # Vitest unit tests
├── docs/                       # Documentation & localized READMEs
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md        # Verified model list & QA criteria
│   └── roadmap.md              # Feature roadmap
├── favicon.svg                 # App icon
└── package.json                # NPM config (zero dependencies)
```

## 🤝 Contributing

- For major changes, please open an Issue first to discuss.
- PR flow: fork → branch → PR (with description, screenshots, and tests).
- See [roadmap.md](docs/roadmap.md) for planned features accepting contributions.

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Oraios AI

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) — Transformers.js and model hosting
- [Transformers.js](https://huggingface.co/docs/transformers.js) — In-browser ML inference
- [ONNX Runtime Web](https://onnxruntime.ai/) — WebGPU/WASM model execution
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) — Beautiful open-source icons
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Font family

---

**Made with ❤️ for privacy-focused AI**

[⬆ Back to top](#lucidllm-chat)
