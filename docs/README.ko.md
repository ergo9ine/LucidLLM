# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM**은 [Transformers.js](https://huggingface.co/docs/transformers.js)와 WebGPU 기술을 사용하여 AI 모델을 브라우저 내에서 완전히 로컬로 실행하는 채팅 애플리케이션입니다. 빌드 과정이 필요 없는(Zero-build) 아키텍처와 완벽한 개인정보 보호를 제공하며, 외부 서버로 데이터를 전송하지 않고도 강력한 AI 기능을 제공합니다.

> **주요 특징:** 17,000줄 이상의 소스 코드 • 511개 i18n 키 × 4개 국어 • 추천 모델 • WebGPU/WASM 이중 추론 • 60 FPS 실시간 스트리밍 • OPFS 파일 탐색기 • AES-256 암호화 구글 드라이브 백업 • npm 의존성 제로

## ✨ 핵심 기능

### 🤖 AI 및 모델

| 기능 | 설명 |
|------|------|
| **완전 로컬 추론** | 모든 AI 연산이 브라우저 내에서 실행되며, 데이터가 기기 밖으로 전송되지 않습니다 |
| **추론 디바이스 토글** | 런타임에서 **WebGPU**와 **WASM** 모드를 자유롭게 전환할 수 있습니다 |
| **OPFS 모델 캐싱** | Origin Private File System을 사용하여 모델을 영구적으로 저장하고 재다운로드를 방지합니다 |
| **OPFS Fetch 인터셉터** | Worker 수준의 fetch 가로채기와 **Range Request** 지원으로 효율적인 모델 로딩을 제공합니다 |
| **외부 데이터 지원** | ONNX 외부 데이터 파일(`.onnx_data`, `.onnx.data`)을 자동 감지하고 멀티 샤드도 지원합니다 |
| **HF 토큰 지원** | Hugging Face 토큰을 입력하여 비공개 또는 접근 제한된 모델을 사용할 수 있습니다 |
| **스마트 다운로드** | 이어받기, 지수 백오프 기반 재시도, 양자화 선택, 자동 용량 확보를 지원합니다 |
| **추천 모델** | 모델 탭에서 검증된 추천 모델을 원클릭으로 다운로드할 수 있습니다 |
| **모델 감사 및 업데이트** | 모델의 무결성을 검증하고 Hugging Face의 최신 버전 여부를 확인합니다 |
| **부트스트랩 설정** | 모델 최초 로드 시 `generation_config.json`(temperature, top_p, max_length, repetition_penalty)을 자동 적용합니다 |
| **파이프라인 캐시** | 최대 **4개의 활성 파이프라인**을 메모리에 캐시하여 GPU 정리 후 안전한 전환이 가능합니다 |

### 💬 채팅 경험

| 기능 | 설명 |
|------|------|
| **다중 세션 채팅** | 최대 **10개의 독립적인 채팅 세션**을 생성하여 관리할 수 있습니다 |
| **60 FPS 스트리밍** | 프레임 제한을 통한 부드러운 스트리밍과 애니메이션 블링킹 커서(▍)를 지원합니다 |
| **지능형 토큰 카운터** | CJK(한중일) 문자와 ASCII 문자를 구분하여 정교하게 토큰 수를 추정합니다 |
| **LLM 파라미터 제어** | Top-P, 온도, 존재 패널티(Presence Penalty) 슬라이더를 실시간으로 조절합니다 |
| **토큰 속도 통계** | 추론 중 초당 토큰 수(TPS)의 평균/최대/최소를 실시간으로 표시합니다 |
| **메모리 사용량 표시** | 브라우저의 실시간 메모리 소비량을 모니터링합니다 |
| **생성 중단** | GPU 버퍼 정리를 포함한 graceful abort로 언제든 AI 응답을 즉시 중단합니다 |
| **메시지 편집 및 재생성** | 사용자 메시지를 수정하고 AI 응답을 재생성할 수 있습니다 |
| **대화 분기** | 대화의 어느 지점에서든 분기하여 대안적인 응답을 탐색합니다 |
| **대화 내보내기** | 채팅 기록을 JSON 형식으로 내보낼 수 있습니다 |
| **시스템 프롬프트** | AI 비서의 성격을 정의하는 시스템 프롬프트를 최대 20줄까지 설정할 수 있습니다 |
| **컨텍스트 제어** | 4k부터 128k까지 컨텍스트 윈도우 크기를 조절할 수 있습니다 |

### 📂 OPFS 파일 탐색기

브라우저 내 모델 저장소를 관리하기 위한 강력한 탐색기를 제공합니다:
- **디렉터리 트리**: OPFS 구조를 시각적으로 탐색합니다
- **파일 작업**: 파일/폴더 생성, 이름 변경, 이동, 삭제를 지원합니다
- **드래그 앤 드롭**: 모델 파일을 직접 드래그하여 업로드할 수 있습니다
- **컨텍스트 메뉴**: 우클릭을 통해 빠른 관리 기능을 제공합니다
- **사용량 통계**: 실제 사용 중인 공간과 여유 공간을 실시간으로 표시합니다

### 👤 프로필 시스템

사용자별 맞춤 설정을 위한 프로필 기능을 제공합니다:
- **커스텀 닉네임**: 사용자만의 닉네임을 자유롭게 설정합니다
- **아바타 업로드**: 사용자만의 프로필 이미지를 직접 업로드하고 저장합니다
- **백업 키 파생**: 닉네임이 구글 드라이브 백업의 암호화 키 파생에 활용됩니다

### 🔄 자동 업데이트 및 PWA

항상 최신 기능을 안전하게 사용할 수 있습니다:
- **GitHub 릴리즈 동기화**: 6시간마다 GitHub API를 통해 업데이트를 자동 확인합니다
- **업데이트 알림**: 새 버전 출시 시 배지와 변경 사항 모달을 통해 알립니다
- **완전한 PWA 지원**: 서비스 워커 캐싱(`cache-first` 앱 자산, `network-then-cache` WASM 바이너리)을 통한 설치형 앱을 지원합니다
- **Skip Waiting**: `SKIP_WAITING` 메시지 프로토콜을 통한 원활한 업데이트 플로우

### 🔒 개인정보 보호 및 백업

| 기능 | 설명 |
|------|------|
| **구글 드라이브 백업** | 설정과 채팅 기록을 구글 드라이브에 안전하게 백업합니다 |
| **AES-GCM-256 암호화** | PBKDF2(250,000회)와 AES-GCM-256을 통해 클라이언트 측에서 암호화합니다 |
| **Gzip 압축** | **CompressionStream API**를 사용하여 백업 데이터를 효율적으로 압축합니다 |
| **자동 백업** | 데이터 변경 시 25초 디바운싱 후 자동으로 백업을 수행합니다 |
| **백업 복원 및 언두** | 스냅샷 복원과 설정 초기화 시 **5초 이내 복구(Undo)** 기능을 지원합니다 |
| **서버 통신 없음** | 명시적인 백업 외에는 어떠한 데이터도 외부 서버로 전송되지 않습니다 |

### 🌐 사용자 경험

| 기능 | 설명 |
|------|------|
| **토스트 알림 시스템** | 성공, 정보, 경고, 오류 상황을 알리는 글로벌 알림 시스템입니다 |
| **상태 램프** | 모델 로딩 및 세션 상태를 색상으로 직관적으로 표시합니다 |
| **6개 탭 설정 모달** | 모델, LLM, 프로필, 테마, 언어, 백업으로 분류된 상세 설정을 제공합니다 |
| **4가지 테마** | 다크(기본), 라이트, OLED 블랙, 하이 콘트라스트 모드를 지원합니다 |
| **폰트 크기 조절** | CSS 커스텀 프로퍼티를 통한 폰트 스케일 조절 기능 |
| **접근성** | 모달 포커스 관리를 위한 **Focus Trap** 과 전체 키보드 단축키를 지원합니다 |
| **단축키 지원** | Ctrl+N (새 채팅), Ctrl+Enter (전송), Ctrl+L (포커스), Ctrl+, (설정), Ctrl+Shift+Backspace (중단) |

## ✅ 검증 완료된 모델

LucidLLM에서 정상 작동이 확인된 모델 목록입니다:

| 모델 이름 | 양자화 | 상태 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 검증됨 | 통과 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 검증됨 | 통과 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, UINT8, BNB4 | 검증됨 | 통과 |
| [willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX](https://huggingface.co/willopcbeta/GPT-5-Distill-Qwen3-4B-Instruct-Heretic-ONNX) | Q4 | 검증됨 | 통과 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 검증됨 | 통과 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 검증됨 | 통과 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 검증됨 | 통과 |

> **Sanity QA**: "What is gravity?"와 "What is the capital of France?" 두 질문에 정확히 답해야 통과 — 상세 기준은 [compatibility.md](compatibility.md) 참조.

## 🏛️ 아키텍처

```
index.html → bootstrap.js (엔트리)
               ├─ i18n.js           번역 (511개 키 × 4개 언어, ~2,700줄)
               ├─ shared-utils.js   순수 유틸리티 & 상수 (50개 export, ~1,000줄)
               └─ main.js           코어: UI, 상태, OPFS, 추론 오케스트레이션 (~12,600줄)
                    ├─ drive-backup.js   AES-GCM 암복호화, gzip, Drive 페이로드 포맷 (~300줄)
                    └─ worker.js         웹 워커 — Transformers.js 파이프라인, OPFS fetch 가로채기 (~540줄)
```

- **빌드 단계 없음.** 모든 소스 파일이 네이티브 ES 모듈로 직접 서빙됩니다
- **단일 `state` 객체** (~170개 필드)가 전체 애플리케이션 상태를 관리합니다
- **`els` 객체**가 200개 이상의 DOM 요소를 캐싱하여 쿼리 없는 렌더링을 구현합니다
- **`window.LucidApp`**이 콘솔 접근을 위한 공개 디버그/API 인터페이스를 제공합니다
- **웹 워커**가 별도 스레드에서 모델 로딩과 추론을 처리하며, 타입화된 메시지 열거형(`WORKER_MSG`)을 통한 `postMessage` 프로토콜로 통신합니다
- **Worker 내 `window.fetch` 몽키패치**가 Hugging Face URL을 가로채 OPFS 캐시에서 먼저 서빙합니다

## 📋 시스템 요구사항

### 브라우저 호환성

| 요구사항 | 상세 내용 |
|------|----------|
| **권장 브라우저** | Chrome 113+ / Edge 113+ (WebGPU 지원) |
| **최소 사양** | WASM을 지원하는 모든 최신 브라우저 |
| **보안 컨텍스트** | OPFS 사용을 위해 HTTPS 또는 localhost 환경 필수 |
| **JavaScript** | ES2020+ 모듈 지원 |

### 하드웨어 권장사양

| 항목 | 최소 사양 | 권장 사양 |
|------|----------|----------|
| **RAM** | 4 GB | 8 GB 이상 |
| **저장공간** | 모델당 100 MB ~ 5 GB | SSD 권장 |
| **GPU** | 내장 그래픽 | WebGPU 지원 외장 그래픽 |

## 🚀 시작하기

### 라이브 데모

GitHub Pages에서 제공하는 데모를 즉시 사용해보세요 (설치 불필요):

👉 **https://ergo9ine.github.io/LucidLLM/**

> **팁:** Cloudflare Pages에 배포하면 COOP/COEP 헤더를 통해 멀티스레드 WASM 추론이 가능합니다.

### 로컬 — 제로 빌드

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npx serve -s . -l 3000    # http://localhost:3000 에서 실행
```

브라우저에서 열고 **설정 → 모델 관리**에서 모델을 다운로드·활성화합니다.

## 📖 사용 가이드

### 1. 모델 로딩

1. **설정 (Ctrl+,) → 모델 관리** 탭으로 이동합니다.
2. Hugging Face 모델 ID(예: `HuggingFaceTB/SmolLM2-135M-Instruct`)를 직접 입력하거나, **추천 모델** 목록에서 하나를 선택합니다.
3. **Fetch** 버튼으로 모델 메타데이터를 가져온 후, 양자화를 선택하고 **다운로드**를 클릭합니다.
4. 다운로드는 이어받기와 지수 백오프 자동 재시도를 지원합니다.

### 2. 채팅 시작

1. 모델이 다운로드되면 세션 테이블의 **활성화** 버튼을 클릭합니다.
2. 상태 램프가 초록색(Loaded)으로 변할 때까지 기다립니다.
3. 메시지를 입력하고 **Ctrl+Enter** 또는 **전송** 버튼을 누릅니다.
4. 탭 바의 **+** 버튼으로 새 채팅 세션을 생성합니다 (최대 10개).

### 3. LLM 설정

**설정 → LLM** 탭에서 생성 파라미터를 조절합니다:

| 설정 | 기본값 | 설명 |
|------|--------|------|
| **시스템 프롬프트** | "You are a helpful assistant." | AI의 역할과 성격을 정의합니다 |
| **최대 토큰** | 512 | 한 번의 응답에서 생성할 최대 길이를 제한합니다 |
| **컨텍스트 윈도우** | 8k | 모델이 기억하는 대화 길이를 설정합니다 |
| **온도** | 0.9 | 응답의 창의성과 무작위성을 조절합니다 |
| **Top-P** | 0.95 | 핵 샘플링(Nucleus Sampling) 임계값 |

### 4. 구글 드라이브 백업

1. **설정 → 백업 및 복원**으로 이동합니다.
2. **구글 드라이브 연결** 버튼을 클릭하여 로그인합니다.
3. **자동 백업**을 활성화하면 변경 시마다 자동으로 저장됩니다 (25초 디바운스).
4. 모든 데이터는 클라이언트 측에서 닉네임 기반으로 암호화됩니다.
5. 스냅샷에서 복원 시 5초 이내 되돌리기(Undo) 가능합니다.

## 🚢 배포

### GitHub Pages

별도 설정 없이 바로 동작합니다. 단, GitHub Pages는 커스텀 응답 헤더를 지원하지 않으므로 `SharedArrayBuffer`를 사용할 수 없고 WASM 추론은 싱글스레드로 제한됩니다.

### Cloudflare Pages

멀티스레드 WASM 추론을 위해 Cloudflare Pages에 배포하세요. 저장소 루트의 `_headers` 파일이 필요한 헤더를 구성합니다:

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

이 헤더는 멀티스레드 ONNX Runtime WASM 실행에 필요한 `SharedArrayBuffer`를 활성화합니다.

### 자체 호스팅

HTTPS를 지원하는 어떤 정적 파일 서버든 사용 가능합니다:

```bash
npx serve -s . -l 3000                      # Node.js
python -m http.server 8000                   # Python
```

멀티스레드 WASM을 위해서는 서버가 모든 응답에 COOP/COEP 헤더를 전송하도록 설정하세요.

## 🛠️ 개발

### 설정

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm install    # 테스트/개발 도구 실행 시에만 필요
```

### 실행

```bash
npx serve -s . -l 3000    # 제로 빌드 — 파일 수정 후 새로고침
```

### 테스트

```bash
cd test && npm test        # Vitest 단위 테스트
npx playwright test        # E2E 테스트 (Chromium, 실제 모델 다운로드)
```

- E2E 테스트는 헤드리스 Chromium이 WebGPU를 지원하지 않으므로 WASM 디바이스(`lucid_inference_device = 'wasm'`)를 강제합니다.
- 최초 E2E 실행 시 테스트 모델 다운로드로 10분 이상 소요될 수 있습니다.

### 콘솔 API

브라우저 콘솔에서 `window.LucidApp`을 통해 앱 상태와 API에 접근하여 디버깅할 수 있습니다.

### 주요 소스 파일

| 파일 | 줄 수 | 역할 |
|------|-------|------|
| `script/bootstrap.js` | ~106 | 초기화, 초기 i18n, 서비스 워커 등록 |
| `script/main.js` | ~12,600 | 핵심 로직, 상태 머신, UI 렌더링, OPFS 관리 |
| `script/i18n.js` | ~2,700 | 511개 번역 키 × 4개 언어 (ko/en/ja/zh-CN) |
| `script/shared-utils.js` | ~1,000 | 50개 순수 유틸리티 함수 및 상수 |
| `script/worker.js` | ~540 | Transformers.js 추론 파이프라인 웹 워커 |
| `script/drive-backup.js` | ~300 | AES-GCM 암호화, gzip 압축, Drive API 헬퍼 |

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | JavaScript (ES2020+ Modules) |
| **아키텍처** | Zero-build, Vanilla JS, No Framework, npm 의존성 제로 |
| **ML 프레임워크** | Transformers.js v4.0.0-next.1 |
| **모델 포맷** | ONNX (외부 데이터 지원) |
| **추론 백엔드** | WebGPU / WASM (자동 전환) |
| **스토리지** | Origin Private File System (OPFS), localStorage |
| **암호화** | Web Crypto API (PBKDF2 + AES-GCM-256) |
| **압축** | CompressionStream API (Gzip) |
| **스타일링** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **아이콘** | Lucide Icons (CDN) |
| **폰트** | Space Grotesk (Google Fonts) |
| **인증** | Google Identity Services (OAuth 2.0) |
| **CDN** | jsDelivr, unpkg |
| **테스트** | Vitest (단위), Playwright (E2E) |

## 🔒 보안 및 프라이버시

- 기본적으로 모든 추론과 채팅 데이터는 로컬에만 유지됩니다 — 어떤 서버에도 전송되지 않습니다.
- 구글 드라이브 백업은 선택 사항이며, 업로드 전 클라이언트 측에서 AES-GCM-256으로 암호화됩니다.
- 모든 모델 가중치는 다른 오리진과 격리된 안전한 **Origin Private File System (OPFS)** 에 저장됩니다.
- 분석, 텔레메트리, 추적 기능 일절 없음.

## 🏗️ 프로젝트 구조

```
LucidLLM/
├── index.html                  # 메인 HTML 엔트리 포인트 (1,200줄 이상)
├── sw.js                       # 서비스 워커 (PWA 캐시, v1.2.0)
├── _headers                    # Cloudflare Pages COOP/COEP 헤더
├── script/
│   ├── bootstrap.js            # 앱 초기화 및 초기 i18n
│   ├── main.js                 # 핵심 로직, 상태, UI 렌더링
│   ├── i18n.js                 # 다국어 모듈 (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 공용 유틸리티 및 글로벌 API
│   ├── worker.js               # 추론 전용 웹 워커
│   └── drive-backup.js         # 암호화된 구글 드라이브 백업
├── vendor/
│   └── transformers/           # 자체 호스팅 Transformers.js + ONNX Runtime WASM
├── test/                       # Vitest 단위 테스트
├── docs/                       # 문서 및 다국어 README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md        # 검증 모델 목록 및 QA 기준
│   └── roadmap.md              # 기능 로드맵
├── favicon.svg                 # 앱 아이콘
└── package.json                # NPM 설정 (의존성 제로)
```

## 🤝 기여하기

- 큰 변경 사항은 사전에 Issue를 통해 상의해 주세요.
- PR 플로우: fork → branch → PR (설명, 스크린샷, 테스트 포함)
- 기여를 환영하는 계획된 기능은 [roadmap.md](roadmap.md)를 참조하세요.

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

Copyright (c) 2025 Oraios AI

## 🙏 감사의 글

- [Hugging Face](https://huggingface.co/) — Transformers.js 및 모델 호스팅
- [Transformers.js](https://huggingface.co/docs/transformers.js) — 브라우저 내 ML 추론 라이브러리
- [ONNX Runtime Web](https://onnxruntime.ai/) — WebGPU/WASM 모델 실행
- [Tailwind CSS](https://tailwindcss.com/) — 유틸리티 퍼스트 CSS 프레임워크
- [Lucide Icons](https://lucide.dev/) — 아름다운 오픈소스 아이콘
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — 폰트 패밀리

---

**Made with ❤️ for privacy-focused AI**

[⬆ 맨 위로](#lucidllm-chat)
