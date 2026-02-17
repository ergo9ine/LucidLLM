# LucidLLM Chat

[English](README.md) | [한국어](README.ko.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v3.8.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Planned-blue)

**LucidLLM** 是一个完全在浏览器内运行的本地大型语言模型（LLM）聊天应用程序。它使用 [Transformers.js](https://huggingface.co/docs/transformers.js) 和 WebGPU 技术，无需将任何数据发送到外部服务器，即可在浏览器内安全地运行 AI 模型。

> **主要特点：** 18,200+ 行代码 • 4 种语言 • WebGPU/WASM 推理 • 令牌流式传输 • 自定义虚拟 DOM • AES-256 加密备份 • OPFS 模型缓存

## ✨ 主要功能

### 🤖 AI 与模型

| 功能 | 说明 |
|------|------|
| **完全本地推理** | 所有 AI 推理均在浏览器内运行，数据不会离开设备 |
| **WebGPU 加速** | 支持 GPU 加速推理，不支持的设备自动回退到 WASM |
| **OPFS 模型缓存** | 使用 Origin Private File System 永久存储模型，无需重新下载 |
| **模型下载管理器** | 支持暂停/恢复、指数退避重试、量子化级别选择 |
| **多模型支持** | 在多个缓存的 ONNX 模型之间加载和切换 |
| **模型卡片显示** | 显示模型元数据（上传者、任务、下载量、许可证、点赞、标签、描述） |
| **Hugging Face 集成** | 直接从 Hugging Face 模型中心查询和下载模型 |

### 💬 聊天体验

| 功能 | 说明 |
|------|------|
| **多会话聊天** | 支持多个独立的聊天标签页，各自拥有独立的对话历史 |
| **实时令牌流式传输** | 实时令牌生成和流式显示 |
| **令牌速度统计** | 显示平均/最大/最小 令牌/秒 |
| **内存使用量显示** | 实时内存消耗监控 |
| **系统提示编辑器** | 自定义助手行为（最多 20 行） |
| **上下文窗口控制** | 可选择 4k、8k、16k、32k、128k 上下文大小 |
| **聊天导出** | 将会话导出为 JSON 文件 |
| **自动滚动** | 自动滚动到底部，带手动覆盖按钮 |

### 🔒 隐私与备份

| 功能 | 说明 |
|------|------|
| **Google Drive 备份** | 将设置和聊天记录加密备份到 Google Drive |
| **AES-GCM-256 加密** | 使用 PBKDF2 密钥派生（250,000 轮迭代）进行客户端加密 |
| **Gzip 压缩** | 备份负载的可选压缩 |
| **自动备份** | 更改时自动备份（25 秒防抖） |
| **备份还原** | 从以前的备份快照还原，带覆盖选项 |
| **备份版本管理** | 在 Drive 上维护多个备份版本 |
| **无服务器通信** | 除非明确备份，否则所有数据均保留在本地 |

### 🌐 用户体验

| 功能 | 说明 |
|------|------|
| **4 种语言支持** | 韩语、英语、日语、简体中文，自动语言检测 |
| **3 种主题选项** | 深色、浅色、OLED 黑色（适用于 OLED 显示屏的纯黑） |
| **响应式设计** | 移动优先，完全支持智能手机/平板电脑 |
| **PWA 支持** | 渐进式 Web 应用功能（计划中） |
| **侧边栏导航** | 带聊天和工作区面板的可折叠侧边栏 |
| **键盘快捷键** | Ctrl+Shift+N（新建聊天）、Ctrl+Shift+E（导出）、Ctrl+B（切换侧边栏） |

## 📋 系统要求

### 浏览器要求

| 要求 | 详情 |
|------|------|
| **最低浏览器** | Chrome 113+ / Edge 113+（支持 WebGPU） |
| **回退支持** | 任何支持 WASM 的浏览器 |
| **安全上下文** | 需要 HTTPS 或 localhost（OPFS） |
| **JavaScript** | ES2020+ 模块支持 |

### 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **内存** | 4GB | 8GB+ |
| **存储** | 每个模型 100MB - 2GB | 建议使用 SSD |
| **GPU** | 集成显卡 | 支持 WebGPU 的独立 GPU |

### 推荐模型

| 模型 | 大小 | 量化 | 用途 |
|------|------|------|------|
| SmolLM2-135M-Instruct | ~135M | FP32, BNB4 | 测试/开发 |
| Qwen2.5-0.5B-Instruct | ~500M | Q4_K_M | 平衡性能 |
| Phi-3-mini-4k-instruct | ~3.8B | Q4_K_M | 高质量响应 |

## 🚀 快速开始

### 在线版本

无需安装，直接使用 GitHub Pages 部署：

👉 **[在线演示](https://ergo9ine.github.io/LucidLLM/)**

### 本地运行

1. **克隆仓库**

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
```

2. **运行本地服务器**

使用 OPFS 和 Service Worker 需要安全上下文（HTTPS 或 localhost）。

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# 或使用包含的 npm 脚本
npm run serve
```

3. **通过浏览器访问**

访问 `http://localhost:8000`（或您使用的端口）。推荐使用 Chrome 或 Edge。

### 开发依赖（可选）

```bash
npm install
```

运行时依赖（Transformers.js、Tailwind CSS、Lucide Icons、Google Fonts）从 CDN 加载，因此不需要单独的构建过程。

## 📖 使用指南

### 1. 加载模型

1. 点击标题栏中的**设置**按钮（⚙️）。
2. 导航到**模型管理**标签页。
3. 输入 Hugging Face 模型 ID（例如：`onnx-community/SmolLM2-135M-Instruct`）。
4. 点击**查询**获取模型信息。
5. 从下拉菜单中选择量化级别。
6. 点击**下载**将模型缓存到 OPFS（支持暂停/恢复）。
7. 下载完成后，点击**激活**加载模型。

### 2. 开始聊天

1. 在底部输入框中输入消息。
2. 点击**发送**或按 `Enter` 键提交。
3. 使用标签栏中的 **+** 按钮创建新的聊天会话。
4. 点击聊天标签页切换会话。

### 3. 配置 LLM 设置

导航到**设置 > LLM 设置**：

| 设置 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| **系统提示** | "You are a helpful assistant." | 最多 20 行 | 定义助手行为 |
| **最大输出令牌** | 512 | 1 - 32,768 | 控制响应长度 |
| **上下文窗口** | 8k | 4k/8k/16k/32k/128k | 选择上下文大小 |
| **Temperature** | 0.9 | 0.1 - 2.0 | 响应随机性 |
| **Top P** | 0.9 | 0.1 - 1.0 | 核采样 |
| **Presence Penalty** | 0 | -2.0 - 2.0 | 重复控制 |

### 4. 推理设备选择

通过标题栏右侧的下拉菜单切换：

- **⚡ WebGPU** — GPU 加速推理（推荐，性能更佳）。
- **🧩 CPU (WASM)** — 不支持 WebGPU 的浏览器的回退选项。

### 5. Google Drive 备份

1. 前往**设置 > 备份与还原**。
2. 输入 Google OAuth 客户端 ID（可选：客户端密钥）。
3. 点击**连接 Google Drive**并进行身份验证。
4. 启用**更改时自动备份**进行自动备份。
5. 使用**立即备份**进行手动备份。
6. 使用**还原**按钮从以前的备份快照还原。

## 🏗️ 项目结构

```
LucidLLM/
├── index.html                  # 主 HTML 入口 (728 行)
├── bootstrap.js                # 应用初始化 (62 行)
├── main.js                     # 核心应用逻辑 (~12,600 行)
├── i18n.js                     # 国际化模块 (~2,050 行，4 种语言)
├── shared-utils.js             # 共享工具和全局 API (~450 行)
├── transformers-bridge.js      # Transformers.js 接口层 (13 行)
├── worker.js                   # 推理用 Web Worker (~200 行)
├── drive-backup.js             # 带加密的 Google Drive 备份 (~250 行)
├── style.css                   # 自定义样式和主题定义 (~1,140 行)
├── favicon.svg                 # 应用图标
├── package.json                # NPM 包配置
├── docs/
│   ├── roadmap.md              # 功能路线图
│   └── compatibility.md        # 模型兼容性信息
└── tests/                      # 测试套件 (Vitest)
```

**总计：~18,200+ 行代码**

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **语言** | JavaScript (ES2020+ Modules) |
| **架构** | 零构建，Vanilla JS（无框架） |
| **ML 框架** | Transformers.js v3.8.1 |
| **推理后端** | WebGPU / WASM（自动回退） |
| **存储** | Origin Private File System (OPFS)、localStorage |
| **样式** | Tailwind CSS v3 (CDN) + 自定义 CSS 变量 |
| **图标** | Lucide Icons (CDN) |
| **字体** | Space Grotesk (Google Fonts) |
| **离线** | 计划中（Service Worker） |
| **备份认证** | Google Identity Services (OAuth 2.0) |
| **加密** | Web Crypto API (PBKDF2、AES-GCM-256) |
| **压缩** | CompressionStream API (Gzip) |
| **CDN** | jsDelivr、unpkg |

## 🔧 配置

### 存储的设置 (localStorage)

| 类别 | 设置 |
|------|------|
| **LLM** | 系统提示、最大令牌数、上下文窗口、HF 令牌、temperature、top_p、presence_penalty |
| **个人资料** | 昵称、头像、语言、主题 |
| **推理** | 首选设备 (webgpu/wasm) |
| **备份** | 客户端 ID、自动备份、备份限制、最后同步时间 |

### 主要存储位置

| 存储键 | 用途 |
|--------|------|
| `lucid_user_profile_v1` | 用户资料（昵称、头像、语言、主题） |
| `lucid_system_prompt` | 系统提示配置 |
| `lucid_max_output_tokens` | 最大输出令牌数设置 |
| `lucid_context_window` | 上下文窗口大小 |
| `lucid_inference_device` | 推理设备偏好 |
| `lucid_google_drive_*` | Google Drive 备份设置 |

## 🧪 开发指南

### 代码规范

- **ES Modules** — 所有应用代码使用 ES Module 语法。
- **集中状态管理** — 全局状态在 `main.js` 的单一 `state` 对象中管理。
- **原生架构** — Vanilla JS 核心，配备用于高性能动态 UI 渲染的自定义虚拟 DOM (vdom.js)。
- **国际化 (i18n)** — 200+ 翻译键，带层次回退。
- **可访问性** — 遵循 ARIA 属性、键盘导航、焦点管理。
- **响应式设计** — 使用媒体查询和 Tailwind CSS 的移动优先方法。

### 主要模块

#### `i18n.js` - 国际化

```javascript
import { t, I18N_KEYS, setCurrentLanguage } from './i18n.js';

// 设置语言
setCurrentLanguage('zh-CN');

// 带变量的翻译
t(I18N_KEYS.STATUS_MODEL_LOADING, { model: 'SmolLM2' });
// → "正在加载 SmolLM2..."

// 应用到 DOM
applyI18nToDOM(document);
```

**支持语言：** 韩语、英语、日语、简体中文

#### `shared-utils.js` - 工具函数

```javascript
import {
    formatBytes,
    formatSpeed,
    formatEta,
    getErrorMessage,
    publishLucidApi
} from './shared-utils.js';

// 格式化文件大小
formatBytes(1024 * 1024 * 500);  // → "500 MB"

// 格式化速度
formatSpeed(1024 * 512);  // → "512 KB/s"

// 格式化时间
formatEta(3665);  // → "1 小时"

// 公开全局 API
publishLucidApi({ myFunction: () => {} });
```

### 运行测试

```bash
# 运行测试套件
npm test
```

### 生产构建

**无需构建步骤！** 该应用是零构建的，直接从静态文件运行。

## 🗺️ 路线图

### 已完成

- [x] 带延迟加载的优化 i18n 系统（200+ 键）
- [x] i18n 键名空间常量
- [x] 翻译的层次回退结构
- [x] 用于模型缓存的 OPFS fetch 拦截器
- [x] 备份的客户端加密
- [x] 具有独立历史的多会话聊天
- [x] 实时令牌速度统计

### 进行中

- [x] 逐令牌输出的流式响应
- [ ] 带代码语法高亮的 Markdown 渲染
- [ ] 消息编辑和重新生成

### 计划中

- [ ] 多模态输入（使用 Vision 模型进行图像分析）
- [ ] 模型比较模式
- [ ] 自动量化推荐
- [ ] 本地文档的 RAG 支持
- [ ] 函数调用接口
- [ ] 对话分支 (fork)
- [ ] 通过 Web Speech API 进行语音输入/输出
- [ ] 用于 PWA 安装的 Web App Manifest
- [ ] 长时间推理任务的推送通知

查看 [docs/roadmap.md](docs/roadmap.md) 了解完整路线图。

## 🤝 贡献

欢迎贡献！如果您发现错误或想建议新功能，请注册 Issue 或发送 Pull Request。

### 如何贡献

1. **Fork** 本仓库。
2. 从 `main` 分支创建功能分支：
   ```bash
   git checkout -b feature/your-feature
   ```
3. 遵循**现有代码风格**：
   - ES Modules
   - 无框架
   - 直接 DOM 操作
4. 在 `tests/` 目录中为新工具函数**添加测试**。
5. 在浏览器中测试功能：
   - 模型加载
   - 聊天工作流程
   - 设置管理
6. **不要提交**：
   - `node_modules/`
   - 编辑器设置
   - 构建产物
7. 提交更改并创建 Pull Request。

### Issue 报告

注册 GitHub Issue 时，请包含以下信息：

- 浏览器名称和版本
- 操作系统和版本
- 重现步骤
- 预期行为 vs 实际行为
- 控制台错误日志（如适用）
- 截图（如适用）

### 兼容性报告

根据量化级别，某些模型可能与 WASM 或 WebGPU 环境不兼容。请在 GitHub Issues 中注册兼容模型，并提供以下信息：

- 模型名称
- 仓库（HF、Github URL）
- 量化级别
- 版本或哈希
- 性能说明（tokens/sec、内存使用量）

查看 [docs/compatibility.md](docs/compatibility.md) 了解已知的兼容模型。

## 📊 性能基准

| 模型 | 设备 | Tokens/sec | 内存 | 首令牌 |
|------|------|------------|------|--------|
| SmolLM2-135M | WebGPU | ~45 tok/s | 800 MB | ~2 秒 |
| SmolLM2-135M | WASM | ~8 tok/s | 600 MB | ~5 秒 |
| Qwen2.5-0.5B | WebGPU | ~25 tok/s | 1.2 GB | ~3 秒 |
| Phi-3-mini | WebGPU | ~12 tok/s | 2.5 GB | ~5 秒 |

*性能因硬件而异。在 M2 MacBook Pro 上测试。*

## 🔒 安全性

- **客户端加密** — 使用 PBKDF2 密钥派生（250,000 轮迭代）的 AES-GCM-256
- **无遥测** — 无分析或跟踪代码
- **本地数据存储** — 除非明确备份，否则所有数据均保留在浏览器中
- **需要安全上下文** — OPFS/Service Worker 需要 HTTPS 或 localhost

## 📚 文档

- [路线图](docs/roadmap.md) - 功能路线图和计划的改进
- [兼容性](docs/compatibility.md) - 模型兼容性信息
- [LICENSE](LICENSE) - MIT 许可证

## 🌐 国际化 (i18n)

本项目通过 `i18n.js` 提供多语言支持，包含 200+ 翻译键。语言根据浏览器的语言设置自动检测，您也可以在设置菜单中手动更改。

**支持语言：**
- 🇰🇷 한국어 (韩语)
- 🇺🇸 English (英语)
- 🇯🇵 日本語 (日语)
- 🇨🇳 简体中文

### 添加新语言

1. 打开 `i18n.js`。
2. 在相应部分添加特定语言的翻译。
3. 如果 `ja` 或 `zh-CN` 从英语继承，则添加覆盖。
4. 更新 `SUPPORTED_LANGUAGES` 数组。

```javascript
// 示例：添加德语
const DE_SPECIFIC = {
    [I18N_KEYS.HEADER_SETTINGS]: "Einstellungen",
    [I18N_KEYS.CHAT_PLACEHOLDER]: "Nachricht eingeben...",
    // ...
};
```

## 🏆 值得注意的技术成就

### 1. 高性能虚拟 DOM (Virtual DOM)
为了高效处理复杂的 UI 更新（如模型表格、聊天列表等），应用使用了轻量级的自定义虚拟 DOM (`vdom.js`)。这在无需外部依赖的情况下实现了高性能渲染。

### 2. 零构建架构
整个应用无需任何构建过程即可直接从静态文件运行。所有依赖项均从 CDN 加载。

### 3. OPFS Fetch 拦截器
自定义 fetch 拦截器透明地从 OPFS 提供缓存的模型文件，使远程 Hugging Face 请求看起来像本地 file 读取。

### 4. 层次化 i18n 系统
- 200+ 翻译键，带 `I18N_KEYS` 常量
- 层次回退：当前语言 → 英语 → 韩语
- 带缓存的延迟加载字典
- 通过 `data-i18n` 属性自动翻译 DOM

### 5. 客户端加密
使用 Web Crypto API 进行完整的备份加密：
- PBKDF2 密钥派生（250,000 轮迭代）
- AES-GCM-256 加密
- 支持 Gzip 压缩

### 6. 流式令牌生成
实时令牌流式传输：
- 束搜索回调解析
- 用于增量显示的增量计算
- 令牌速度统计（平均/最大/最小）
- 节流渲染（最高 60 FPS）

### 7. 下载管理器
强大的下载系统：
- 支持暂停/恢复
- 指数退避重试（3 次重试，800ms 基础）
- 进度跟踪（速度、预计时间、字节数）
- 多文件模型的队列管理

## 📄 许可证

本项目根据 **MIT 许可证** 授权 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Hugging Face](https://huggingface.co/) - Transformers.js 和模型托管
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 浏览器内 ML 推理
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先 CSS 框架
- [Lucide Icons](https://lucide.dev/) - 精美图标
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - 字体系列

---

**为注重隐私的 AI 而用 ❤️ 打造**

[⬆ 返回顶部](#lucidllm-chat)
