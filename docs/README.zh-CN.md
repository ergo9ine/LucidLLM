# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM** 是一款基于 [Transformers.js](https://huggingface.co/docs/transformers.js) 和 WebGPU 技术的聊天应用程序，能够在浏览器内完全本地运行 AI 模型。它采用无需构建（Zero-build）的架构，提供全面的隐私保护，无需将数据发送到外部服务器即可提供强大的 AI 功能。

> **主要特点:** 18,200+ 行代码 • 支持 4 种语言 • WebGPU/WASM 推理加速 • 60 FPS 实时流式传输 • OPFS 文件浏览器 • AES-256 加密备份 • OPFS 模型缓存

## ✨ 核心功能

### 🤖 AI 与模型

| 功能 | 说明 |
|------|------|
| **完全本地推理** | 所有 AI 运算均在浏览器内执行，数据不会离开您的设备。 |
| **推理设备切换**| 运行时可在 **WebGPU** 和 **WASM** 模式间自由切换，平衡兼容性与性能。 |
| **OPFS 模型缓存** | 使用 Origin Private File System 永久存储模型，避免重复下载。 |
| **OPFS Fetch 拦截器**| 支持 **Range Requests**，实现高效的模型加载。 |
| **HF Token 支持** | 可输入 Hugging Face Token 以访问私有或受限模型。 |
| **智能下载** | 支持断点续传、指数退避重试和量化（Quantization）选择。 |
| **模型审计与更新** | 验证模型完整性并检查 Hugging Face 上的最新版本。 |
| **引导配置** | 首次加载模型时自动应用 `generation_config.json` 设置。 |
| **流水线缓存** | 内存支持同时缓存多达 **4 个活跃流水线**，实现瞬间切换。 |

### 💬 聊天体验

| 功能 | 说明 |
|------|------|
| **多会话聊天** | 支持创建多达 **10 个独立的聊天会话**，并分别管理导出。 |
| **60 FPS 流式传输** | 通过帧率限制实现平滑渲染，并配有动态闪烁光标 (▍)。 |
| **智能 Token 计数器** | 针对 CJK（中韩日）和 ASCII 字符进行智能 Token 估算。 |
| **LLM 参数控制** | 实时调节 Top-P、温度和存在惩罚 (Presence Penalty) 滑块。 |
| **Token 速度统计** | 实时显示每秒 Token 数 (TPS) 的平均/最大/最小统计。 |
| **内存使用量显示** | 实时监控浏览器的内存消耗情况。 |
| **中断生成** | 随时一键立即中断 AI 的响应生成。 |
| **系统提示词** | 支持多达 20 行的自定义系统提示词，定义 AI 角色。 |
| **上下文控制** | 可调节上下文窗口大小，从 4k 到 128k。 |

### 📂 OPFS 文件浏览器

提供全功能的文件浏览器来管理浏览器内的模型存储：
- **目录树**: 可视化浏览 Origin Private File System 结构。
- **文件操作**: 支持创建、重命名、移动和删除文件/文件夹。
- **拖拽上传**: 支持直接将模型文件拖入浏览器进行上传。
- **上下文菜单**: 右键点击即可执行管理操作。
- **空间统计**: 实时显示已用空间和可用空间容量。

### 👤 个人资料系统

提供个性化的用户身份管理功能：
- **自定义昵称**: 设置您自己的自定义用户昵称。
- **头像上传**: 支持上传并保存自定义的个人头像。
- **可自定义身份**: 安全地管理您的本地昵称和头像。

### 🔄 自动更新与 PWA

确保您始终使用最新的功能：
- **GitHub Release 同步**: 每 6 小时通过 GitHub API 自动检查更新。
- **更新通知**: 发布新版本时通过角标和变更日志弹窗提醒。
- **完整 PWA 支持**: 支持 Service Worker 缓存，并通过 `SKIP_WAITING` 流实现安装应用。

### 🔒 隐私与备份

| 功能 | 说明 |
|------|------|
| **Google Drive 备份** | 将设置和聊天记录加密备份到 Google Drive。 |
| **AES-GCM-256 加密** | 在客户端使用 PBKDF2 (250,000 次) 和 AES-GCM-256 进行强加密。 |
| **Gzip 压缩** | 利用 **CompressionStream API** 对备份数据进行高效压缩。 |
| **自动备份** | 数据变更后应用 25 秒防抖动自动执行备份。 |
| **恢复与撤销 (Undo)**| 支持从快照恢复，并在重置设置时提供 **5 秒撤销** 窗口。 |
| **无服务器通信** | 除明确的备份操作外，绝不将任何数据发送到外部服务器。 |

### 🌐 用户体验

| 功能 | 说明 |
|------|------|
| **Toast 通知系统** | 提供成功、信息、警告和错误的全局轻量通知。 |
| **状态指示灯** | 通过颜色代码直观显示模型加载和会话状态。 |
| **6 标签设置弹窗** | 提供分类明确的模型、LLM、个人资料、主题、语言和备份设置。 |
| **4 种主题** | 支持深色、浅色、OLED 纯黑和高对比度模式。 |
| **无障碍性** | 内置 **Focus Trap** 弹窗管理及完整的键盘快捷键支持。 |
| **快捷键支持** | Ctrl+N (新聊天), Ctrl+Enter (发送), Ctrl+L (聚焦), Ctrl+, (设置) 等。 |

## ✅ 已验证模型

这些模型已在 LucidLLM 中通过测试并验证可正常使用：

| 模型名称 | 量化 | 状态 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 已验证 | 通过 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 已验证 | 通过 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, BNB4 | 已验证 | 通过 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 已验证 | 通过 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 已验证 | 通过 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 已验证 | 通过 |

## 📋 系统要求

### 浏览器兼容性

| 要求 | 详细内容 |
|------|----------|
| **推荐浏览器** | Chrome 113+ / Edge 113+ (支持 WebGPU) |
| **最低配置** | 所有支持 WASM 的现代浏览器 |
| **安全上下文** | 使用 OPFS 必须处于 HTTPS 或 localhost 环境下 |
| **JavaScript** | 支持 ES2020+ 模块 |

### 硬件推荐配置

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| **内存 (RAM)** | 4GB | 8GB 以上 |
| **存储空间** | 每个模型 100MB ~ 2GB | 推荐 SSD |
| **显卡 (GPU)** | 集成显卡 | 支持 WebGPU 的独立显卡 |

## 🚀 快速开始

### 在线演示

通过 GitHub Pages 立即体验（无需安装）：

👉 **https://ergo9ine.github.io/LucidLLM/**

### 本地（零构建）

1. 克隆代码库并在本地运行服务器：

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm run serve    # 在 http://localhost:3000 运行
```

（可选：`python -m http.server 8000` 或 `npx serve .`）

在浏览器中打开后，前往 Settings → Model Management 下载并激活模型。

### 开发与测试

- 可选：`npm install`（仅在运行测试/开发工具时需要）
- 单元测试：`npm test` (Vitest)
- E2E 测试：`npx playwright test`

---

## 🛠️ 开发者指南

- **全局命名空间**: 在控制台通过 `window.LucidApp` 访问应用状态和 API。
- **监控 API**: 查看网络事件日志和聊天错误日志进行调试。
- **运行时**: 纯 ES 模块（无需打包工具）。
- **主要文件**:
  - `script/bootstrap.js` — 启动与初期 i18n
  - `script/main.js` — 核心逻辑、状态管理及 UI 渲染
  - `script/i18n.js` — 多语言处理模块 (ko/en/ja/zh-CN)
  - `script/shared-utils.js` — 通用工具与全局 API
  - `script/worker.js` — 推理 Web Worker 与流水线管理
  - `script/drive-backup.js` — 加密 Google Drive 备份
- **测试**: Vitest 单元测试 (`npm test`)、Playwright E2E 测试 (`npx playwright test`)

---

## 🔒 安全与隐私

- 默认情况下，所有推理和对话数据仅保存在本地.
- Google Drive 备份是可选的, 并在客户端加密.
- 所有模型权重均存储在经过安全加固的 **Origin Private File System (OPFS)** 中.

## 🏗️ 项目结构

```
LucidLLM/
├── index.html                  # 主 HTML 入口点
├── sw.js                       # Service Worker (PWA 缓存)
├── script/
│   ├── bootstrap.js            # 应用初始化与初期 i18n
│   ├── main.js                 # 核心逻辑、状态、UI 渲染
│   ├── i18n.js                 # 多语言模块 (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 通用工具与全局 API
│   ├── worker.js               # 专用推理 Web Worker
│   └── drive-backup.js         # 加密 Google Drive 备份
├── docs/                       # 文档与多语言 README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md
│   └── roadmap.md
├── favicon.svg                 # 应用图标
└── package.json                # NPM 配置
```

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| **语言** | JavaScript (ES2020+ Modules) |
| **架构** | Zero-build, Vanilla JS (无框架) |
| **ML 框架** | Transformers.js v4.0.0-next.1 |
| **模型格式** | ONNX |
| **推理后端** | WebGPU / WASM (自动切换) |
| **存储** | Origin Private File System (OPFS), localStorage |
| **压缩** | CompressionStream API (Gzip) |
| **样式** | Tailwind CSS v3 (CDN) + 自定义 CSS 变量 |
| **图标** | Lucide Icons (CDN) |
| **字体** | Space Grotesk (Google Fonts) |
| **认证** | Google Identity Services (OAuth 2.0) |
| **加密** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **CDN** | jsDelivr, unpkg |
| **测试** | Vitest (单元), Playwright (E2E) |

## 📄 许可证

本项目基于 **MIT 许可证** 分发。详细信息请参阅 [LICENSE](../LICENSE) 文件。

## 🙏 致谢

- [Hugging Face](https://huggingface.co/) - Transformers.js 与模型托管
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 浏览器内 ML 推理库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先 CSS 框架
- [Lucide Icons](https://lucide.dev/) - 精美的开源图标
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - 字体系列

---

**Made with ❤️ for privacy-focused AI**

[⬆ 回到顶部](#lucidllm-chat)
