# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM**は、[Transformers.js](https://huggingface.co/docs/transformers.js)とWebGPU技術を使用して、AIモデルをブラウザ内で完全にローカルで実行するチャットアプリケーションです。ビルド不要（Zero-build）のアーキテクチャと完全なプライバシー保護を提供し、外部サーバーにデータを送信することなく強力なAI機能を実現します。

> **主な特徴:** 17,000行以上のソースコード • 511個のi18nキー × 4ヶ国語 • おすすめモデル • WebGPU/WASMデュアル推論 • 60 FPSトークンストリーミング • OPFSファイル探索器 • AES-256暗号化Googleドライブバックアップ • npm依存関係ゼロ

## ✨ 主な機能

### 🤖 AIとモデル

| 機能 | 説明 |
|------|------|
| **完全ローカル推論** | すべてのAI推論がブラウザ内で実行され、データがデバイスから出ることはありません |
| **推論デバイスの切り替え** | 実行時に**WebGPU**と**WASM**モードを自由に切り替え、互換性とパフォーマンスを最適化できます |
| **OPFSモデルキャッシュ** | Origin Private File Systemを使用してモデルを永続的に保存し、再ダウンロードを防ぎます |
| **OPFS Fetchインターセプター** | Worker レベルの fetch インターセプトと**Range Request**サポートで効率的なモデル読み込みを実現します |
| **外部データサポート** | ONNX外部データファイル（`.onnx_data`、`.onnx.data`）の自動検出とマルチシャード対応 |
| **HFトークン対応** | Hugging Faceトークンを入力して、プライベートまたはアクセス制限のあるモデルを使用できます |
| **スマートダウンロード** | 一時停止/再開、指数バックオフリトライ、量子化選択、自動クォータ回収をサポートします |
| **おすすめモデル** | モデルタブから検証済みのおすすめモデルをワンクリックでダウンロードできます |
| **モデル監査と更新** | モデルの整合性を検証し、Hugging Faceの最新バージョンがあるか確認します |
| **ブートストラップ設定** | モデルの初回読み込み時に`generation_config.json`（temperature、top_p、max_length、repetition_penalty）を自動適用します |
| **パイプラインキャッシュ** | 最大**4つのアクティブパイプライン**をメモリにキャッシュし、GPUの適切なクリーンアップ後に安全な切り替えが可能です |

### 💬 チャット体験

| 機能 | 説明 |
|------|------|
| **マルチセッションチャット** | 最大**10個の独立したチャットセッション**を作成して管理できます |
| **60 FPSストリーミング** | フレーム制限によるスムーズな表示と、アニメーション付きの点滅カーソル(▍)をサポートします |
| **知的なトークンカウンター** | CJK（韓中日）文字とASCII文字を区別し、精緻にトークン数を推定します |
| **LLMパラメータ制御** | Top-P、温度、存在ペナルティ（Presence Penalty）スライダーをリアルタイムで調整できます |
| **トークン速度統計** | 推論中のTPS（1秒あたりのトークン数）の平均/最大/最小をリアルタイムで表示します |
| **メモリ使用量表示** | ブラウザのリアルタイムなメモリ消費量を監視します |
| **生成中断** | GPUバッファのクリーンアップを含むgraceful abortで、いつでもAI応答を即座に中断できます |
| **メッセージ編集と再生成** | ユーザーメッセージを編集してAIの応答を再生成できます |
| **会話ブランチ** | 会話の任意の時点からフォークして代替応答を探索します |
| **会話エクスポート** | チャット履歴をJSON形式でエクスポートできます |
| **システムプロンプト** | AIアシスタントの役割を定義するシステムプロンプトを最大20行まで設定できます |
| **コンテキスト制御** | 4kから128kまでコンテキストウィンドウのサイズを調整できます |

### 📂 OPFS ファイル探索器

ブラウザ内のモデルストレージを管理するための強力な探索器を提供します：
- **ディレクトリツリー**: OPFS構造を視覚的にナビゲートします
- **ファイル操作**: ファイル/フォルダの作成、名前変更、移動、削除をサポートします
- **ドラッグ&ドロップ**: モデルファイルを直接ドラッグしてアップロードできます
- **コンテキストメニュー**: 右クリックからクイック管理機能を提供します
- **使用量統計**: 使用中のスペースと空き容量をリアルタイムで表示します

### 👤 プロフィールシステム

ユーザーごとのカスタマイズ設定のためのプロフィール機能を提供します：
- **カスタムニックネーム**: 自分だけのニックネームを自由に設定します
- **アバターアップロード**: 独自のプロフィール画像を直接アップロードして保存します
- **バックアップキー派生**: ニックネームがGoogleドライブバックアップの暗号化キー派生に使用されます

### 🔄 自動更新とPWA

常に最新機能を安全に使用できます：
- **GitHubリリース同期**: 6時間ごとにGitHub APIを通じてアップデートを自動確認します
- **更新通知**: 新バージョンリリース時にバッジと変更履歴モーダルで通知します
- **完全なPWA対応**: サービスワーカーキャッシュ（`cache-first`アプリアセット、`network-then-cache`WASMバイナリ）によるインストール型アプリをサポートします
- **Skip Waiting**: `SKIP_WAITING`メッセージプロトコルによるシームレスな更新フロー

### 🔒 プライバシーとバックアップ

| 機能 | 説明 |
|------|------|
| **Googleドライブバックアップ** | 設定とチャット履歴をGoogleドライブに安全にバックアップします |
| **AES-GCM-256暗号化** | PBKDF2（25万回）とAES-GCM-256を使用し、クライアント側で暗号化します |
| **Gzip圧縮** | **CompressionStream API**を使用してバックアップデータを効率的に圧縮します |
| **自動バックアップ** | データ変更時に25秒のデバウンス後、自動的にバックアップを実行します |
| **復元と取り消し(Undo)** | スナップショット復元や設定初期化時に**5秒以内の復元(Undo)**機能をサポートします |
| **サーバー通信なし** | 明示的なバックアップ以外、データが外部サーバーに送信されることはありません |

### 🌐 ユーザー体験

| 機能 | 説明 |
|------|------|
| **トースト通知システム** | 成功、情報、警告、エラーを知らせるグローバルな通知システムです |
| **状態ランプ** | モデルの読み込みとセッション状態を色で直感的に表示します |
| **6タブ設定モーダル** | モデル、LLM、プロフィール、テーマ、言語、バックアップに分類された詳細設定を提供します |
| **4つのテーマ** | ダーク（デフォルト）、ライト、OLEDブラック、ハイコントラストモードをサポートしています |
| **フォントサイズ調整** | CSSカスタムプロパティによるフォントスケールの調整機能 |
| **アクセシビリティ** | モーダルフォーカス管理のための**Focus Trap**とフルキーボード操作をサポートします |
| **ショートカット対応** | Ctrl+N（新規）、Ctrl+Enter（送信）、Ctrl+L（フォーカス）、Ctrl+,（設定）、Ctrl+Shift+Backspace（中断） |

## ✅ 検証済みのモデル

LucidLLMで正常に動作することが確認されたモデルの一覧です：

| モデル名 | 量子化 | 状態 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 検証済み | 合格 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 検証済み | 合格 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, UINT8, BNB4 | 検証済み | 合格 |
| [willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX](https://huggingface.co/willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX) | Q4 | 検証済み | 合格 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 検証済み | 合格 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 検証済み | 合格 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 検証済み | 合格 |

> **Sanity QA**: 「What is gravity?」と「What is the capital of France?」の2問に正確に回答する必要があります — 詳細は [compatibility.md](compatibility.md) を参照。

## 🏛️ アーキテクチャ

```
index.html → bootstrap.js (エントリ)
               ├─ i18n.js           翻訳 (511キー × 4言語, ~2,700行)
               ├─ shared-utils.js   純粋ユーティリティ & 定数 (50エクスポート, ~1,000行)
               └─ main.js           コア: UI, 状態, OPFS, 推論オーケストレーション (~12,600行)
                    ├─ drive-backup.js   AES-GCM暗復号化, gzip, Driveペイロード形式 (~300行)
                    └─ worker.js         Web Worker — Transformers.jsパイプライン, OPFS fetchインターセプト (~540行)
```

- **ビルド不要。** すべてのソースファイルがネイティブESモジュールとして直接サーブされます
- **単一 `state` オブジェクト**（~170フィールド）がアプリケーション全体の状態を管理します
- **`els` オブジェクト**が200以上のDOM要素をキャッシュし、クエリなしのレンダリングを実現します
- **`window.LucidApp`**がコンソールアクセス用の公開デバッグ/APIインターフェースを提供します
- **Web Worker**が別スレッドでモデルの読み込みと推論を処理し、型付きメッセージ列挙型（`WORKER_MSG`）を通じた`postMessage`プロトコルで通信します
- **Worker内の`window.fetch`モンキーパッチ**がHugging Face URLをインターセプトし、OPFSキャッシュから優先サーブします

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
| **RAM** | 4 GB | 8 GB以上 |
| **ストレージ** | モデルあたり100 MB〜5 GB | SSD推奨 |
| **GPU** | 内蔵グラフィックス | WebGPU対応の外付けグラフィックス |

## 🚀 クイックスタート

### ライブデモ

GitHub Pagesのホスト版をすぐに試せます（インストール不要）：

👉 **https://ergo9ine.github.io/LucidLLM/**

> **ヒント:** Cloudflare Pagesにデプロイすると、COOP/COEPヘッダーによりマルチスレッドWASM推論が利用可能になります。

### ローカル（ゼロビルド）

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npx serve -s . -l 3000    # http://localhost:3000 で起動
```

ブラウザで開き、**設定 → モデル管理**からモデルをダウンロードして有効化してください。

## 📖 使用ガイド

### 1. モデルの読み込み

1. **設定 (Ctrl+,) → モデル管理**に移動します。
2. Hugging FaceモデルIDを入力します（例：`HuggingFaceTB/SmolLM2-135M-Instruct`）。
3. **検索**ボタンを押してモデル情報を取得し、量子化を選択して**ダウンロード**をクリックします。
4. ダウンロードは一時停止/再開と指数バックオフの自動リトライをサポートします。

### 2. チャットを開始する

1. モデルのダウンロードが完了したら**有効化**ボタンを押してモデルをロードします。
2. 状態ランプが緑色（Loaded）に変わるまで待ちます。
3. メッセージを入力し、**Ctrl+Enter**または**送信**ボタンを押します。
4. タブバーの**+**ボタンで新しいチャットセッションを作成できます（最大10個）。

### 3. LLM設定

**設定 → LLM**で以下の項目を調整できます：

| 設定 | デフォルト値 | 説明 |
|------|--------------|------|
| **システムプロンプト** | "You are a helpful assistant." | AIの役割と性格を定義します |
| **最大出力トークン** | 512 | 1回の応答で生成する最大長を制限します |
| **コンテキストウィンドウ** | 8k | モデルが記憶できる会話の長さを設定します |
| **温度** | 0.9 | 応答の創造性とランダム性を調整します |
| **Top-P** | 0.95 | 核サンプリング（Nucleus Sampling）の閾値 |

### 4. Googleドライブバックアップ

1. **設定 → バックアップと復元**に移動します。
2. **Googleドライブに接続**ボタンをクリックしてログインします。
3. **自動バックアップ**を有効にすると、変更があるたびに自動的に保存されます（25秒デバウンス）。
4. すべてのデータはクライアント側でニックネームに基づいて暗号化されます。
5. スナップショットからの復元時に5秒以内の取り消し(Undo)が可能です。

## 🚢 デプロイ

### GitHub Pages

追加設定なしですぐに動作します。注意：GitHub Pagesはカスタム応答ヘッダーをサポートしないため、`SharedArrayBuffer`は使用できず、WASM推論はシングルスレッドに制限されます。

### Cloudflare Pages

マルチスレッドWASM推論には、Cloudflare Pagesにデプロイしてください。リポジトリルートの`_headers`ファイルが必要なヘッダーを構成します：

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

これらのヘッダーは、マルチスレッドONNX Runtime WASM実行に必要な`SharedArrayBuffer`を有効にします。

### セルフホスト

HTTPS対応の任意の静的ファイルサーバーが使用可能です：

```bash
npx serve -s . -l 3000                      # Node.js
python -m http.server 8000                   # Python
```

マルチスレッドWASMには、サーバーがすべての応答にCOOP/COEPヘッダーを送信するよう設定してください。

## 🛠️ 開発

### セットアップ

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm install    # テスト/開発ツールの実行時のみ必要
```

### 実行

```bash
npx serve -s . -l 3000    # ゼロビルド — ファイルを編集してリロード
```

### テスト

```bash
cd test && npm test        # Vitest ユニットテスト
npx playwright test        # E2Eテスト（Chromium、実モデルダウンロード）
```

- E2Eテストはヘッドレス ChromiumがWebGPUをサポートしないため、WASMデバイス（`lucid_inference_device = 'wasm'`）を強制します。
- 最初のE2E実行ではテストモデルのダウンロードに10分以上かかる場合があります。

### コンソールAPI

ブラウザのコンソールから`window.LucidApp`を通じて、アプリの状態とAPIにアクセスしてデバッグできます。

### 主要ソースファイル

| ファイル | 行数 | 役割 |
|----------|------|------|
| `script/bootstrap.js` | ~106 | 起動処理、初期i18n、Service Worker登録 |
| `script/main.js` | ~12,600 | コアロジック、状態マシン、UIレンダリング、OPFS管理 |
| `script/i18n.js` | ~2,700 | 511翻訳キー × 4言語 (ko/en/ja/zh-CN) |
| `script/shared-utils.js` | ~1,000 | 50個の純粋ユーティリティ関数と定数 |
| `script/worker.js` | ~540 | Transformers.js推論パイプラインWeb Worker |
| `script/drive-backup.js` | ~300 | AES-GCM暗号化、gzip圧縮、Drive APIヘルパー |

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|----------|------|
| **言語** | JavaScript (ES2020+ Modules) |
| **アーキテクチャ** | Zero-build, Vanilla JS, No Framework, npm依存関係ゼロ |
| **MLフレームワーク** | Transformers.js v4.0.0-next.1 |
| **モデル形式** | ONNX（外部データサポート含む） |
| **推論バックエンド** | WebGPU / WASM (自動切り替え) |
| **ストレージ** | Origin Private File System (OPFS), localStorage |
| **暗号化** | Web Crypto API (PBKDF2 + AES-GCM-256) |
| **圧縮** | CompressionStream API (Gzip) |
| **スタイリング** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **アイコン** | Lucide Icons (CDN) |
| **フォント** | Space Grotesk (Google Fonts) |
| **認証** | Google Identity Services (OAuth 2.0) |
| **CDN** | jsDelivr, unpkg |
| **テスト** | Vitest（ユニット）、Playwright（E2E） |

## 🔒 セキュリティとプライバシー

- すべての推論とチャットデータはデフォルトでローカルに留まります — どのサーバーにも送信されません。
- Googleドライブへのバックアップは任意で、アップロード前にクライアント側でAES-GCM-256で暗号化されます。
- すべてのモデルの重みは、他のオリジンからサンドボックス化された安全な**Origin Private File System (OPFS)**に保存されます。
- 分析、テレメトリ、トラッキング機能一切なし。

## 🏗️ プロジェクト構造

```
LucidLLM/
├── index.html                  # メインHTMLエントリーポイント (1,200行以上)
├── sw.js                       # サービスワーカー (PWAキャッシュ, v1.2.0)
├── _headers                    # Cloudflare Pages COOP/COEP ヘッダー
├── script/
│   ├── bootstrap.js            # アプリ初期化と初期i18n
│   ├── main.js                 # コアロジック、状態、UIレンダリング
│   ├── i18n.js                 # 多言語モジュール (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 共通ユーティリティとグローバルAPI
│   ├── worker.js               # 推論用Web Worker
│   └── drive-backup.js         # 暗号化されたGoogleドライブバックアップ
├── vendor/
│   └── transformers/           # セルフホスト版Transformers.js + ONNX Runtime WASM
├── test/                       # Vitestユニットテスト
├── docs/                       # ドキュメントと多言語README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md        # 検証済みモデル一覧とQA基準
│   └── roadmap.md              # 機能ロードマップ
├── favicon.svg                 # アプリアイコン
└── package.json                # NPM設定（依存関係ゼロ）
```

## 🤝 貢献について

- 大きな変更は事前にIssueで相談してください。
- PRフロー: fork → branch → PR（説明・スクリーンショット・テストを添えて）
- 貢献を歓迎する計画機能については [roadmap.md](roadmap.md) を参照してください。

## 📄 ライセンス

このプロジェクトは**MITライセンス**の下で配布されています。詳細は [LICENSE](../LICENSE) ファイルを参照してください。

Copyright (c) 2025 Oraios AI

## 🙏 謝辞

- [Hugging Face](https://huggingface.co/) — Transformers.jsおよびモデルホスティング
- [Transformers.js](https://huggingface.co/docs/transformers.js) — ブラウザ内ML推論ライブラリ
- [ONNX Runtime Web](https://onnxruntime.ai/) — WebGPU/WASMモデル実行
- [Tailwind CSS](https://tailwindcss.com/) — ユーティリティファーストCSSフレームワーク
- [Lucide Icons](https://lucide.dev/) — 美しいオープンソースアイコン
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — フォントファミリー

---

**Made with ❤️ for privacy-focused AI**

[⬆ トップに戻る](#lucidllm-chat)
