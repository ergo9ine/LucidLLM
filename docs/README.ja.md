# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM**は、[Transformers.js](https://huggingface.co/docs/transformers.js)とWebGPU技術を使用して、AIモデルをブラウザ内で完全にローカルで実行するチャットアプリケーションです。ビルド不要（Zero-build）のアーキテクチャと完全なプライバシー保護を提供し、外部サーバーにデータを送信することなく強力なAI機能を実現します。

> **主な特徴:** 18,200行以上のコード • 4ヶ国語対応 • WebGPU/WASM推論アクセラレーション • 60 FPS リアルタイムストリーミング • OPFS ファイル探索器 • AES-256暗号化バックアップ • OPFSモデルキャッシュ

## ✨ 主な機能

### 🤖 AIとモデル

| 機能 | 説明 |
|------|------|
| **完全ローカル推론** | すべてのAI推論がブラウザ内で実行され、データがデバイスから出ることはありません。 |
| **推論デバイスの切り替え**| 実行時に **WebGPU** と **WASM** モードを自由に切り替え、互換性とパフォーマンスを最適化できます。 |
| **OPFSモデルキャッシュ** | Origin Private File Systemを使用してモデルを永続的に保存し、再ダウンロードを防ぎます。 |
| **OPFS Fetch インターセプター**| 効率的なモデル読み込みのために **Range Request** をサポートします。 |
| **HFトークン対応** | Hugging Faceトークンを入力して、プライベートまたはアクセス制限のあるモデルを使用できます。 |
| **スマートダウンロード** | ダウンロードの一時停止/再開、指数バックオフ（Exponential Backoff）リトライ、量子化選択をサポートします。 |
| **モデル監査と更新** | モデルの整合性を検証し、HFの最新バージョンがあるか確認します。 |
| **ブートストラップ設定** | モデルの初回読み込み時に自動的に `generation_config.json` を適用します。 |
| **パイプラインキャッシュ** | 最大 **4つのアクティブなパイプライン** をメモリにキャッシュし、瞬時にモデルを切り替えられます。 |

### 💬 チャット体験

| 機能 | 説明 |
|------|------|
| **マルチセッションチャット** | 最大 **10個の独立したチャットセッション** を作成して管理できます。 |
| **60 FPS ストリーミング** | フレーム制限によるスムーズな表示と、アニメーション付きの点滅カーソル(▍)をサポートします。 |
| **知的なトークンカウンター** | CJK(韓中日)文字とASCII文字を区別し、精緻にトークン数を推定します。 |
| **LLMパラメータ制御** | Top-P、温度、存在ペナルティ（Presence Penalty）スライダーをリアルタイムで調整できます。 |
| **トークン速度統計** | 1秒あたりのトークン数（TPS）の平均/最大/最小をリアルタイムで表示します。 |
| **メモリ使用量表示** | ブラウザのリアルタイムなメモリ消費量を監視します。 |
| **生成中断** | いつでもワンクリックでAIの応答生成を即座に中断できます。 |
| **システムプロンプト** | AIアシスタントの役割を定義するシステムプロンプトを最大20行まで設定できます。 |
| **コンテキスト制御** | 4kから128kまでコンテキストウィンドウのサイズを調整できます。 |

### 📂 OPFS ファイル探索器

ブラウザ内のモデル・ストレージを管理するための強力な探索器を提供します：
- **ディレクトリツリー**: OPFS構造を視覚的にナビゲートします。
- **ファイル操作**: ファイル/フォルダの作成、名前変更、移動、削除をサポートします。
- **ドラッグ&ドロップ**: モデルファイルを直接ドラッグしてアップロードできます。
- **コンテキストメニュー**: 右クリックからクイック管理機能を提供します。
- **使用量統計**: 使用中のスペースと空き容量をリアルタイムで表示します。

### 👤 プロフィールシステム

ユーザーごとのカスタマイズ設定のためのプロフィール機能を提供します：
- **カスタムニックネーム**: 自分だけのニックネームを自由に設定します。
- **アバター・アップロード**: 独自のプロフィール画像を直接アップロードして保存します。
- **カスタムアイデンティティ**: ローカルのニックネームとアバターを安全に管理します。

### 🔄 自動更新とPWA

常に最新機能を安全に使用できます：
- **GitHubリリース同期**: 6時間ごとにGitHub APIを通じてアップデートを自動確認します。
- **更新通知**: 新バージョンリリース時にバッジと変更履歴モーダルで通知します。
- **完全なPWA対応**: サービスワーカーによるキャッシュと `SKIP_WAITING` フローによるインストール型アプリをサポートします。

### 🔒 プライバシーとバックアップ

| 機能 | 説明 |
|------|------|
| **Googleドライブバックアップ** | 設定とチャット履歴をGoogleドライブに安全にバックアップします。 |
| **AES-GCM-256 暗号化** | PBKDF2（25万回）と AES-GCM-256 を使用し、クライアント側で暗号化します。 |
| **Gzip圧縮** | **CompressionStream API** を使用してバックアップデータを効率的に圧縮します。 |
| **自動バックアップ** | データ変更時に25秒のデバウンス後、自動的にバックアップを実行します。 |
| **復元と取り消し(Undo)**| スナップショット復元や設定初期化時に **5秒以内の復元(Undo)** 機能をサポートします。 |
| **サーバー通信なし** | 明示的なバックアップ以外、データが外部サーバーに送信されることはありません。 |

### 🌐 ユーザー体験

| 機能 | 説明 |
|------|------|
| **トースト通知システム** | 成功、情報、警告、エラーを知らせるグローバルな通知システムです。 |
| **状態ランプ** | モデルの読み込みとセッション状態を色で直感的に表示します。 |
| **6タブ設定モーダル** | モデル、LLM、プロフィール、テーマ、言語、バックアップに分類された詳細設定を提供します。 |
| **4つのテーマ** | ダーク、ライト、OLEDブラック、ハイコントラストモードをサポートしています。 |
| **アクセシビリティ** | モーダルフォーカス管理のための **Focus Trap** とフルキーボード操作をサポートします。 |
| **ショートカット対応** | Ctrl+N（新規）、Ctrl+Enter（送信）、Ctrl+L（フォーカス）、Ctrl+,（設定）など |

## ✅ 検証済みのモデル

LucidLLMで正常に動作することが確認されたモデルの一覧です：

| モデル名 | 量子化 | 状態 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 検証済み | 合格 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 検証済み | 合格 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, BNB4 | 検証済み | 合格 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 検証済み | 合格 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 検証済み | 合格 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 検証済み | 合格 |

## 📋 システム要件

### ブラウザ互換性

| 要件 | 詳細 |
|------|------|
| **推奨ブラウザ** | Chrome 113+ / Edge 113+ (WebGPU対応) |
| **最小要件** | WASMをサポートするすべての最新ブラウザ |
| **セキュリティコンテキスト** | OPFS使用のため、HTTPSまたはlocalhost環境が必須 |
| **JavaScript** | ES2020+モジュールのサポート |

### ハードウェア推奨スペック

| 項目 | 最小スペック | 推奨スペック |
|------|--------------|--------------|
| **RAM** | 4GB | 8GB以上 |
| **ストレージ** | モデルあたり100MB〜2GB | SSD推奨 |
| **GPU** | 内蔵グラフィックス | WebGPU対応の外付けグラフィックス |

## 🚀 クイックスタート

### ライブデモ

GitHub Pagesのホスト版をすぐに試せます（インストール不要）：

👉 **https://ergo9ine.github.io/LucidLLM/**

### ローカル（ゼロビルド）

1. リポジトリをクローンし、そのフォルダをサーバーとして実行します：

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm run serve    # http://localhost:3000 で起動
```
(代替: `python -m http.server 8000` または `npx serve .`)

ブラウザで開き、Settings → Model Management からモデルをダウンロードして有効化してください。

### 開発とテスト

- オプション: `npm install`（テスト/開発ツールの実行時のみ必要）
- ユニットテスト: `npm test`（Vitest）
- E2Eテスト: `npx playwright test`

---

## 📖 使用ガイド

### 1. モデルの読み込み

1. ヘッダーの **設定(⚙️)** ボタンをクリックします。
2. **モデル管理** タブに移動します。
3. Hugging FaceモデルIDを入力します（例：`onnx-community/SmolLM2-135M-Instruct`）。
4. **検索** ボタンを押してモデル情報を取得します。
5. 希望する **量子化(Quantization)** オプションを選択します。
6. **ダウンロード** をクリックしてモデルをOPFSにキャッシュします。（レジューム対応）
7. ダウンロードが完了したら **有効化** ボタンを押してモデルをロードします。

### 2. チャットを開始する

1. 下部の入力欄にメッセージを入力し、**送信** ボタンを押すか `Ctrl+Enter` キーを押します。
2. タブバーの **+** ボタンで新しいチャットセッションを作成できます。
3. タブをクリックして複数の会話セッションを自由に切り替えることができます。
4. **中断** ボタン（または `Ctrl+Shift+Backspace`）でいつでも生成を中断できます。

### 3. LLM設定

**設定 > LLM設定** で以下の項目を調整できます：

| 設定 | デフォルト値 | 説明 |
|------|--------------|------|
| **システムプロンプト** | "You are a helpful assistant." | AIの役割と性格を定義します。 |
| **最大出力トークン** | 512 | 1回の応答で生成する最大長を制限します。 |
| **コンテキストウィンドウ** | 8k | モデルが記憶できる会話の長さを設定します。 |
| **温度 (Temperature)** | 0.9 | 応答の創造性とランダム性を調整します。 |

### 4. Googleドライブバックアップ

1. **設定 > バックアップと復元** に移動します。
2. **Googleドライブに接続** ボタンをクリックしてログインします。（クライアントIDは自動設定されます）
3. **自動バックアップ** を有効にすると、変更があるたびに自動的に保存されます（25秒デバウンス）。
4. **今すぐバックアップ** ボタンで手動バックアップも可能です。
5. 復元リストから希望する時点を選択し、**復元** ボタンを押すと以前の状態に戻せます。

---

## 🛠️ 開発ガイド

- **グローバルネームスペース**: コンソールから `window.LucidApp` を通じてアプリの状態とAPIにアクセス可能です。
- **モニタリングAPI**: デバッグのためにネットワークイベントログとチャットエラーログを確認できます。
- **ランタイム**: バニラ ES モジュール（バンドラ不要）
- **主要ファイル**:
  - `script/bootstrap.js` — 起動処理と初期 i18n
  - `script/main.js` — コアロジック、状態管理、UI レンダリング
  - `script/i18n.js` — 多言語処理モジュール (ko/en/ja/zh-CN)
  - `script/shared-utils.js` — 共通ユーティリティとグローバルAPI
  - `script/worker.js` — 推論ワーカーとパイプライン管理
  - `script/drive-backup.js` — 暗号化されたGoogleドライブバックアップ
- **テスト**: Vitest ユニットテスト (`npm test`)、Playwright E2Eテスト (`npx playwright test`)

---

## 🤝 貢献について

- 大きな変更は事前に Issue で相談してください。
- PR フロー: fork → branch → PR（説明・スクリーンショット・テストを添えて）

---

## 🔒 セキュリティとプライバシー

- 推論とチャットデータはデフォルトでローカルに留まります。
- Googleドライブへのバックアップは任意で、クライアント側で暗号化されます。
- すべてのモデルの重みは、セキュリティが強化された **Origin Private File System (OPFS)** に保存されます。

## 🏗️ プロジェクト構造

```
LucidLLM/
├── index.html                  # メインHTMLエントリーポイント
├── sw.js                       # サービスワーカー (PWAキャッシュ)
├── script/
│   ├── bootstrap.js            # アプリ初期化と初期 i18n
│   ├── main.js                 # コアロジック、状態、UIレンダリング
│   ├── i18n.js                 # 多言語モジュール (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 共通ユーティリティとグローバルAPI
│   ├── worker.js               # 推論用Web Worker
│   └── drive-backup.js         # 暗号化されたGoogleドライブバックアップ
├── docs/                       # ドキュメントと多言語README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md
│   └── roadmap.md
├── favicon.svg                 # アプリアイコン
└── package.json                # NPM設定
```

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|----------|------|
| **言語** | JavaScript (ES2020+ Modules) |
| **アーキテクチャ** | Zero-build, Vanilla JS (No Framework) |
| **MLフレームワーク** | Transformers.js v4.0.0-next.1 |
| **モデル形式** | ONNX |
| **推論バックエンド** | WebGPU / WASM (自動切り替え) |
| **ストレージ** | Origin Private File System (OPFS), localStorage |
| **圧縮** | CompressionStream API (Gzip) |
| **スタイリング** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **アイコン** | Lucide Icons (CDN) |
| **フォント** | Space Grotesk (Google Fonts) |
| **認証** | Google Identity Services (OAuth 2.0) |
| **暗号化** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **テスト** | Vitest（ユニット）、Playwright（E2E） |

## 📄 ライセンス

このプロジェクトは **MITライセンス** の下で配布されています。詳細は [LICENSE](../LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Hugging Face](https://huggingface.co/) - Transformers.jsおよびモデルホスティング
- [Transformers.js](https://huggingface.co/docs/transformers.js) - ブラウザ内ML推論ライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Lucide Icons](https://lucide.dev/) - 美しいオープンソースアイコン
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - フォントファミリー

---

**Made with ❤️ for privacy-focused AI**

[⬆トップに戻る](#lucidllm-chat)
