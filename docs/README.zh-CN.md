# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM** 是一款使用 [Transformers.js](https://huggingface.co/docs/transformers.js) 和 WebGPU 技术，完全在浏览器本地运行 AI 模型的聊天应用。采用零构建（Zero-build）架构，提供完整的隐私保护，在不向外部服务器发送任何数据的前提下实现强大的 AI 功能。

> **核心亮点：** 17,000+ 行源代码 • 511 个 i18n 键 × 4 种语言 • 推荐模型 • WebGPU/WASM 双引擎推理 • 60 FPS 流式输出 • OPFS 文件浏览器 • AES-256 加密 Google Drive 备份 • 零 npm 依赖

## ✨ 主要功能

### 🤖 AI 与模型

| 功能 | 说明 |
|------|------|
| **完全本地推理** | 所有 AI 推理在浏览器内运行，数据永不离开用户设备 |
| **推理设备切换** | 运行时自由切换 **WebGPU** 和 **WASM** 模式，优化兼容性和性能 |
| **OPFS 模型缓存** | 使用 Origin Private File System 持久化存储模型，无需重复下载 |
| **OPFS Fetch 拦截** | Worker 级 fetch 拦截，支持 **Range Request**，实现高效模型加载 |
| **外部数据支持** | 自动检测 ONNX 外部数据文件（`.onnx_data`、`.onnx.data`），支持多分片 |
| **HF Token 支持** | 输入 Hugging Face Token 来使用私有或受限模型 |
| **智能下载** | 支持暂停/恢复、指数退避重试、量化选择和自动配额回收 |
| **推荐模型** | 在模型选项卡中一键下载经过验证的推荐模型 |
| **模型审计与更新** | 验证模型完整性，检查 Hugging Face 上的最新版本 |
| **启动配置** | 模型首次加载时自动应用 `generation_config.json`（temperature、top_p、max_length、repetition_penalty） |
| **流水线缓存** | 最多缓存 **4 个活跃流水线**，安全切换并正确清理 GPU 资源 |

### 💬 聊天体验

| 功能 | 说明 |
|------|------|
| **多会话聊天** | 创建和管理最多 **10 个独立聊天会话** |
| **60 FPS 流式输出** | 帧率限制的流畅显示，带动画闪烁光标 (▍) |
| **智能Token计数** | 区分 CJK（中日韩）字符和 ASCII 字符，精确估算 Token 数量 |
| **LLM 参数控制** | 实时调整 Top-P、温度、Presence Penalty 滑块 |
| **Token 速度统计** | 推理过程中实时显示 TPS（每秒Token数）的平均/最大/最小值 |
| **内存用量显示** | 实时监控浏览器内存消耗 |
| **生成中断** | 包含 GPU 缓冲区清理的 graceful abort，随时中断 AI 响应 |
| **消息编辑与重新生成** | 编辑用户消息并重新生成 AI 回复 |
| **对话分支** | 在对话任意一点分叉，探索替代回复 |
| **对话导出** | 将聊天记录导出为 JSON 格式 |
| **系统提示词** | 设置最多 20 行的系统提示词来定义 AI 助手的角色 |
| **上下文控制** | 调整上下文窗口大小，从 4k 到 128k |

### 📂 OPFS 文件浏览器

提供强大的浏览器内模型存储管理工具：
- **目录树：** 可视化导航 OPFS 结构
- **文件操作：** 创建、重命名、移动、删除文件与文件夹
- **拖拽上传：** 直接拖拽模型文件进行上传
- **右键菜单：** 右键快速管理功能
- **用量统计：** 实时显示已用空间和可用容量

### 👤 个人资料系统

为每个用户提供个性化设置：
- **自定义昵称：** 自由设置个人昵称
- **头像上传：** 上传并保存自定义头像
- **备份密钥派生：** 昵称用于 Google Drive 备份的加密密钥派生

### 🔄 自动更新与 PWA

安全使用最新功能：
- **GitHub Release 同步：** 每 6 小时通过 GitHub API 自动检查更新
- **更新通知：** 新版本发布时通过徽章和更新日志弹窗通知
- **完整 PWA 支持：** Service Worker 缓存（`cache-first` 应用资源、`network-then-cache` WASM 二进制文件）支持安装式应用
- **Skip Waiting：** 通过 `SKIP_WAITING` 消息协议实现无缝更新

### 🔒 隐私与备份

| 功能 | 说明 |
|------|------|
| **Google Drive 备份** | 安全地将设置和聊天记录备份到 Google Drive |
| **AES-GCM-256 加密** | 使用 PBKDF2（25 万次迭代）+ AES-GCM-256 客户端加密 |
| **Gzip 压缩** | 使用 **CompressionStream API** 高效压缩备份数据 |
| **自动备份** | 数据变更后 25 秒防抖，自动执行备份 |
| **恢复与撤销** | 快照恢复或设置重置时支持 **5 秒内撤销** 功能 |
| **无服务器通信** | 除显式备份外，数据不会发送到任何外部服务器 |

### 🌐 用户体验

| 功能 | 说明 |
|------|------|
| **Toast 通知系统** | 显示成功、信息、警告、错误的全局通知系统 |
| **状态指示灯** | 通过颜色直观展示模型加载和会话状态 |
| **6 标签设置弹窗** | 按模型、LLM、个人资料、主题、语言、备份分类的详细设置 |
| **4 种主题** | 支持暗色（默认）、亮色、OLED 黑色、高对比度模式 |
| **字体大小调整** | 通过 CSS 自定义属性调整字体缩放 |
| **无障碍访问** | 弹窗焦点管理的 **Focus Trap** 和全键盘操作支持 |
| **快捷键支持** | Ctrl+N（新建）、Ctrl+Enter（发送）、Ctrl+L（聚焦）、Ctrl+,（设置）、Ctrl+Shift+Backspace（中断） |

## ✅ 已验证模型

以下模型已确认在 LucidLLM 中正常运行：

| 模型名称 | 量化方式 | 状态 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 已验证 | 通过 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 已验证 | 通过 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, UINT8, BNB4 | 已验证 | 通过 |
| [willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX](https://huggingface.co/willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX) | Q4 | 已验证 | 通过 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 已验证 | 通过 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 已验证 | 通过 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 已验证 | 通过 |

> **Sanity QA**：要求正确回答 "What is gravity?" 和 "What is the capital of France?" 两个问题 — 详见 [compatibility.md](compatibility.md)。

## 🏛️ 架构

```
index.html → bootstrap.js (入口)
               ├─ i18n.js           翻译 (511键 × 4种语言, ~2,700行)
               ├─ shared-utils.js   纯工具函数 & 常量 (50个导出, ~1,000行)
               └─ main.js           核心: UI, 状态, OPFS, 推理编排 (~12,600行)
                    ├─ drive-backup.js   AES-GCM 加解密, gzip, Drive 载荷格式 (~300行)
                    └─ worker.js         Web Worker — Transformers.js 流水线, OPFS fetch 拦截 (~540行)
```

- **零构建。** 所有源文件作为原生 ES 模块直接提供
- **单一 `state` 对象**（约 170 个字段）管理全部应用状态
- **`els` 对象**缓存 200+ DOM 元素，实现无查询渲染
- **`window.LucidApp`** 提供控制台访问的公共调试/API 接口
- **Web Worker** 在独立线程处理模型加载和推理，通过类型化消息枚举（`WORKER_MSG`）的 `postMessage` 协议通信
- **Worker 内 `window.fetch` 猴子补丁**拦截 Hugging Face URL，优先从 OPFS 缓存提供服务

## 📋 系统要求

### 浏览器兼容性

| 要求 | 详情 |
|------|------|
| **推荐浏览器** | Chrome 113+ / Edge 113+ (支持 WebGPU) |
| **最低要求** | 所有支持 WASM 的现代浏览器 |
| **安全上下文** | 使用 OPFS 需要 HTTPS 或 localhost |
| **JavaScript** | ES2020+ 模块支持 |

### 硬件推荐配置

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| **内存** | 4 GB | 8 GB 以上 |
| **存储** | 每个模型 100 MB - 5 GB | 推荐 SSD |
| **GPU** | 集成显卡 | 支持 WebGPU 的独立显卡 |

## 🚀 快速开始

### 在线体验

直接使用 GitHub Pages 托管版本（无需安装）：

👉 **https://ergo9ine.github.io/LucidLLM/**

> **提示：** 部署到 Cloudflare Pages 可启用 COOP/COEP 头，支持多线程 WASM 推理。

### 本地运行（零构建）

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npx serve -s . -l 3000    # 在 http://localhost:3000 启动
```

打开浏览器，**设置 → 模型管理**中下载并激活模型即可开始使用。

## 📖 使用指南

### 1. 加载模型

1. 进入**设置 (Ctrl+,) → 模型管理**。
2. 输入 Hugging Face 模型 ID（例如：`HuggingFaceTB/SmolLM2-135M-Instruct`）。
3. 点击**搜索**获取模型信息，选择量化方式后点击**下载**。
4. 下载支持暂停/恢复，并自动进行指数退避重试。

### 2. 开始聊天

1. 模型下载完成后，点击**激活**按钮加载模型。
2. 等待状态指示灯变为绿色（已加载）。
3. 输入消息，按 **Ctrl+Enter** 或点击**发送**按钮。
4. 点击标签栏的 **+** 按钮创建新聊天会话（最多 10 个）。

### 3. LLM 设置

在**设置 → LLM**中调整以下参数：

| 设置 | 默认值 | 说明 |
|------|--------|------|
| **系统提示词** | "You are a helpful assistant." | 定义 AI 的角色和性格 |
| **最大输出Token** | 512 | 限制单次回复的最大长度 |
| **上下文窗口** | 8k | 设置模型能记住的对话长度 |
| **温度** | 0.9 | 调整回复的创造性和随机性 |
| **Top-P** | 0.95 | 核采样（Nucleus Sampling）阈值 |

### 4. Google Drive 备份

1. 进入**设置 → 备份与恢复**。
2. 点击**连接 Google Drive**按钮登录。
3. 启用**自动备份**，每次变更后将自动保存（25 秒防抖）。
4. 所有数据在客户端基于昵称进行加密。
5. 从快照恢复时可在 5 秒内撤销。

## 🚢 部署

### GitHub Pages

无需额外配置即可运行。注意：GitHub Pages 不支持自定义响应头，因此 `SharedArrayBuffer` 不可用，WASM 推理将限制为单线程。

### Cloudflare Pages

如需多线程 WASM 推理，请部署到 Cloudflare Pages。仓库根目录的 `_headers` 文件配置了所需头部：

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

这些头部启用多线程 ONNX Runtime WASM 执行所需的 `SharedArrayBuffer`。

### 自托管

可使用任何支持 HTTPS 的静态文件服务器：

```bash
npx serve -s . -l 3000                      # Node.js
python -m http.server 8000                   # Python
```

如需多线程 WASM，请配置服务器在所有响应中发送 COOP/COEP 头部。

## 🛠️ 开发

### 环境搭建

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm install    # 仅在运行测试/开发工具时需要
```

### 运行

```bash
npx serve -s . -l 3000    # 零构建 — 编辑文件后刷新即可
```

### 测试

```bash
cd test && npm test        # Vitest 单元测试
npx playwright test        # E2E 测试（Chromium，需下载真实模型）
```

- E2E 测试强制使用 WASM 设备（`lucid_inference_device = 'wasm'`），因为无头 Chromium 不支持 WebGPU。
- 首次 E2E 运行可能需要 10 分钟以上来下载测试模型。

### 控制台 API

在浏览器控制台通过 `window.LucidApp` 访问应用状态和 API 进行调试。

### 主要源文件

| 文件 | 行数 | 职责 |
|------|------|------|
| `script/bootstrap.js` | ~106 | 启动流程、初始 i18n、Service Worker 注册 |
| `script/main.js` | ~12,600 | 核心逻辑、状态机、UI 渲染、OPFS 管理 |
| `script/i18n.js` | ~2,700 | 511 个翻译键 × 4 种语言 (ko/en/ja/zh-CN) |
| `script/shared-utils.js` | ~1,000 | 50 个纯工具函数和常量 |
| `script/worker.js` | ~540 | Transformers.js 推理流水线 Web Worker |
| `script/drive-backup.js` | ~300 | AES-GCM 加密、gzip 压缩、Drive API 辅助 |

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| **语言** | JavaScript (ES2020+ Modules) |
| **架构** | 零构建、原生 JS、无框架、零 npm 依赖 |
| **ML框架** | Transformers.js v4.0.0-next.1 |
| **模型格式** | ONNX（含外部数据支持） |
| **推理后端** | WebGPU / WASM（自动切换） |
| **存储** | Origin Private File System (OPFS)、localStorage |
| **加密** | Web Crypto API (PBKDF2 + AES-GCM-256) |
| **压缩** | CompressionStream API (Gzip) |
| **样式** | Tailwind CSS v3 (CDN) + CSS 自定义属性 |
| **图标** | Lucide Icons (CDN) |
| **字体** | Space Grotesk (Google Fonts) |
| **认证** | Google Identity Services (OAuth 2.0) |
| **CDN** | jsDelivr、unpkg |
| **测试** | Vitest（单元测试）、Playwright（E2E） |

## 🔒 安全与隐私

- 所有推理和聊天数据默认保留在本地 — 不会发送到任何服务器。
- Google Drive 备份是可选的，上传前在客户端使用 AES-GCM-256 加密。
- 所有模型权重存储在安全的 **Origin Private File System (OPFS)** 中，与其他源隔离。
- 无分析、无遥测、无追踪。

## 🏗️ 项目结构

```
LucidLLM/
├── index.html                  # 主 HTML 入口 (1,200+ 行)
├── sw.js                       # Service Worker (PWA 缓存, v1.2.0)
├── _headers                    # Cloudflare Pages COOP/COEP 头部
├── script/
│   ├── bootstrap.js            # 应用初始化和初始 i18n
│   ├── main.js                 # 核心逻辑、状态、UI 渲染
│   ├── i18n.js                 # 多语言模块 (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 公共工具函数和全局 API
│   ├── worker.js               # 推理用 Web Worker
│   └── drive-backup.js         # 加密的 Google Drive 备份
├── vendor/
│   └── transformers/           # 自托管 Transformers.js + ONNX Runtime WASM
├── test/                       # Vitest 单元测试
├── docs/                       # 文档和多语言 README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md        # 已验证模型列表和 QA 标准
│   └── roadmap.md              # 功能路线图
├── favicon.svg                 # 应用图标
└── package.json                # NPM 配置（零依赖）
```

## 🤝 参与贡献

- 重大变更请先提交 Issue 讨论。
- PR 流程：fork → branch → PR（附带说明、截图和测试）。
- 欢迎贡献的计划功能请参见 [roadmap.md](roadmap.md)。

## 📄 许可证

本项目基于 **MIT 许可证** 分发。详见 [LICENSE](../LICENSE) 文件。

Copyright (c) 2025 Oraios AI

## 🙏 致谢

- [Hugging Face](https://huggingface.co/) — Transformers.js 及模型托管
- [Transformers.js](https://huggingface.co/docs/transformers.js) — 浏览器端 ML 推理库
- [ONNX Runtime Web](https://onnxruntime.ai/) — WebGPU/WASM 模型执行
- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的 CSS 框架
- [Lucide Icons](https://lucide.dev/) — 精美开源图标
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — 字体

---

**Made with ❤️ for privacy-focused AI**

[⬆ 返回顶部](#lucidllm-chat)
