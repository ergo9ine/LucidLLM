# LucidLLM Chat

LucidLLM is a browser-based local Large Language Model (LLM) chat application. It runs AI models safely and quickly within the user's browser using [Transformers.js](https://huggingface.co/docs/transformers.js) and WebGPU technology, without sending data to external servers.

## Key Features

- **Fully Local Inference** — All AI inference is performed within the browser. Chat data is not sent to external servers, providing excellent privacy.
- **High-Performance WebGPU Acceleration** — Supports GPU-accelerated inference via WebGPU. Automatically falls back to WASM on unsupported devices.
- **OPFS Model Management** — Uses the Origin Private File System (OPFS) to cache large models in the browser, allowing immediate loading without re-downloading.
- **Model Explorer** — Provides an integrated model management UI supporting Hugging Face model lookup, quantization level selection, and download pause/resume.
- **Multi-Session Chat** — Supports multiple chat tabs with independent conversation histories.
- **Google Drive Backup** — Encrypts settings and chat history for backup and restore to Google Drive.
- **Offline Support** — Service Worker-based PWA, usable offline once loaded.
- **Multilingual UI** — Supports Korean, English, Japanese, and Simplified Chinese.
- **Theme Customization** — Offers Dark, Light, and OLED Black themes.

## Requirements

| Item | Minimum Requirements |
|------|----------------------|
| Browser | Chrome 113+ / Edge 113+ (WebGPU support) |
| Fallback | Browsers supporting WASM (when WebGPU is unavailable) |
| Security Context | HTTPS or localhost (Service Worker, OPFS required) |

## Getting Started

### Hosted Version

Access the GitHub Pages deployment directly to use without installation.

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
```

3. **Access via Browser**

Access `http://localhost:8000` (or the port you used). Chrome or Edge is recommended.

### Install Development Dependencies (Optional)

```bash
npm install
```

Runtime dependencies (Transformers.js, Tailwind CSS, Lucide Icons, Google Fonts) are loaded from CDN, so no separate build process is required.

## Usage

### Model Loading

1. Click the **Settings** button (gear icon) in the header.
2. In the **Model Management** tab, enter a Hugging Face Model ID (e.g., `onnx-community/SmolLM2-135M-Instruct`).
3. Click **Lookup** to retrieve model information, then select a quantization level.
4. Click **Download** to cache the model in OPFS.
5. After download, click **Activate** to load the model.

### Chat

- Type a message in the bottom input field and click **Send** or press `Enter`.
- Create a new chat session using the **+** button in the tab bar.
- Switch between sessions by clicking the chat tabs.

### LLM Settings

- **System Prompt** — Define the assistant's default behavior in the LLM Settings tab.
- **Max Output Tokens** — Adjust response length in the range of 1~32,768.
- **Context Window** — Select from 4k, 8k, 16k, 32k, or 128k.
- **Hugging Face Token** — Set an access token for gated models (optional).

### Inference Device Selection

Switch via the dropdown on the right side of the header:
- **WebGPU** — GPU-accelerated inference (Recommended).
- **CPU (WASM)** — Fallback for browsers without WebGPU support.

### Google Drive Backup (In Development)

1. Go to **Settings > Backup & Restore** tab.
2. Connect to Google Drive, enable auto-backup, or perform a manual backup.
3. Restore from previous backup snapshots.

Backup optionally supports encryption using a passphrase and gzip compression.

## Project Structure

```
LucidLLM/
├── index.html              # Main HTML entry point
├── bootstrap.js            # App initialization and Service Worker registration
├── main.js                 # Core application logic
├── shared-utils.js         # Shared utility functions
├── global-api.js           # Global API exposure (LucidApp namespace)
├── transformers-bridge.js  # Hugging Face Transformers.js interface
├── worker.js               # Web Worker for model inference
├── drive-backup-utils.js   # Google Drive backup utilities
├── drive-backup-crypto.js  # Backup encryption/decryption
├── sw.js                   # Service Worker (offline caching)
├── style.css               # Custom styles and theme definitions
├── favicon.svg             # App icon
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | JavaScript (ES Modules) |
| Frontend | Pure HTML5 / CSS3 / JS (No Framework) |
| ML Framework | [Transformers.js](https://huggingface.co/docs/transformers.js) v3.8.1 |
| Styling | Tailwind CSS (CDN) + Custom CSS Variables |
| Icons | Lucide Icons (CDN) |
| Fonts | Space Grotesk (Google Fonts) |
| Storage | Origin Private File System (OPFS) |
| Offline | Service Worker (PWA) |
| GPU Acceleration | WebGPU / WASM |
| Backup | Google Drive API + AES Encryption (Optional) |
| Auth | Google Identity Services (OAuth 2.0) |

## Development Guide

### Code Conventions

- **ES Modules** — All application code uses ES Module syntax.
- **Centralized State Management** — Global state is managed in a single `state` object in `main.js`.
- **Direct DOM Manipulation** — Native DOM APIs are used without frameworks or virtual DOM.
- **Internationalization (i18n)** — Supports 4 languages via centralized message lookup.
- **Accessibility** — Adheres to ARIA attributes, keyboard navigation, and focus management.
- **Responsive Design** — Mobile-first approach utilizing media queries and Tailwind CSS.

## Contributing

Contributions are always welcome! If you find a bug or want to suggest a new feature, please register an Issue or send a Pull Request.

1. **Fork** this repository.
2. Create a feature branch from the `main` branch (`git checkout -b feature/your-feature`).
3. Follow **existing code styles** — ES Modules, No Framework, Direct DOM Manipulation.
4. **Add tests** in the `test/` directory for new utility functions.
5. Test functionality (model loading, chat, settings workflow) in the browser.
6. **Do not commit** `node_modules/`, editor settings, or build artifacts.
7. Commit changes and create a Pull Request.

### Issue Reporting

Please include the following information when registering a GitHub Issue:
- Browser name and version
- Steps to reproduce
- Expected vs Actual behavior
- Console error logs (if applicable)

### Compatibility Reporting

Some models may not be compatible with WASM or WebGPU environments depending on quantization levels. Please register compatible models in GitHub Issues with the following information:
- Model Name
- Repository (HF, Github URL)
- Quantization Level
- Version or Hash
