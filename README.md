# LucidLLM Chat

[한국어](docs/README.ko.md) | [English](README.md) | [日本語](docs/README.ja.md) | [简体中文](docs/README.zh-CN.md)

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
├── index.html                  # Main HTML entry point
├── script/
│   ├── bootstrap.js            # App initialization
│   ├── main.js                 # Core application logic
│   ├── i18n.js                 # Internationalization module
│   ├── shared-utils.js         # Shared utilities & global API
│   ├── worker.js               # Web Worker for inference
│   └── drive-backup.js         # Google Drive backup with encryption
├── style.css                   # Custom styles and theme definitions
├── favicon.svg                 # App icon
└── package.json                # NPM package configuration
```

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
| **Backup Auth** | Google Identity Services (OAuth 2.0) |
| **Encryption** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **CDN** | jsDelivr, unpkg |

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
