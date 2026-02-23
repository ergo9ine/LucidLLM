# LucidLLM Chat

[한국어](README.ko.md) | [English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0--next.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

**LucidLLM**은 [Transformers.js](https://huggingface.co/docs/transformers.js)와 WebGPU 기술을 사용하여 AI 모델을 브라우저 내에서 완전히 로컬로 실행하는 채팅 애플리케이션입니다. 빌드 과정이 필요 없는(Zero-build) 아키텍처와 완벽한 개인정보 보호를 제공하며, 외부 서버로 데이터를 전송하지 않고도 강력한 AI 기능을 제공합니다.

> **주요 특징:** 18,200줄 이상의 코드 • 4개 국어 지원 • WebGPU/WASM 추론 가속 • 60 FPS 실시간 스트리밍 • OPFS 파일 탐색기 • AES-256 암호화 백업 • OPFS 모델 캐싱

## ✨ 핵심 기능

### 🤖 AI 및 모델

| 기능 | 설명 |
|------|------|
| **완전 로컬 추론** | 모든 AI 연산이 브라우저 내에서 실행되며, 데이터가 기기 밖으로 전송되지 않습니다. |
| **추론 디바이스 토글**| 런타임에서 **WebGPU**와 **WASM** 모드를 자유롭게 전환할 수 있습니다. |
| **OPFS 모델 캐싱** | Origin Private File System을 사용하여 모델을 영구적으로 저장하고 재다운로드를 방지합니다. |
| **OPFS Fetch 인터셉터**| 효율적인 모델 로딩을 위해 **Range Request**를 지원합니다. |
| **HF 토큰 지원** | Hugging Face 토큰을 입력하여 비공개 또는 접근 제한된 모델을 사용할 수 있습니다. |
| **스마트 다운로드** | 이어받기, 지수 백오프 기반 재시도, 양자화 선택을 지원합니다. |
| **모델 감사 및 업데이트** | 모델의 무결성을 검증하고 HF의 최신 버전 여부를 확인합니다. |
| **부트스트랩 설정** | 모델 최초 로드 시 자동으로 `generation_config.json`을 적용합니다. |
| **파이프라인 캐시** | 최대 **4개의 활성 파이프라인**을 메모리에 캐시하여 즉각적인 모델 전환이 가능합니다. |

### 💬 채팅 경험

| 기능 | 설명 |
|------|------|
| **다중 세션 채팅** | 최대 **10개의 독립적인 채팅 세션**을 생성하여 관리할 수 있습니다. |
| **60 FPS 스트리밍** | 프레임 제한을 통한 부드러운 스트리밍과 애니메이션 블링킹 커서(▍)를 지원합니다. |
| **지능형 토큰 카운터** | CJK(한중일) 문자와 ASCII 문자를 구분하여 정교하게 토큰 수를 추정합니다. |
| **LLM 파라미터 제어** | Top-P, 온도, 존재 패널티(Presence Penalty) 슬라이더를 실시간으로 조절합니다. |
| **토큰 속도 통계** | 초당 토큰 수(TPS)의 평균/최대/최소를 실시간으로 표시합니다. |
| **메모리 사용량 표시** | 브라우저의 실시간 메모리 소비량을 모니터링합니다. |
| **생성 중단** | 언제든지 한 클릭으로 AI 응답 생성을 즉시 중단할 수 있습니다. |
| **시스템 프롬프트** | AI 비서의 성격을 정의하는 시스템 프롬프트를 최대 20줄까지 설정할 수 있습니다. |
| **컨텍스트 제어** | 4k부터 128k까지 컨텍스트 윈도우 크기를 조절할 수 있습니다. |

### 📂 OPFS 파일 탐색기

브라우저 내 모델 저장소를 관리하기 위한 강력한 탐색기를 제공합니다:
- **디렉터리 트리**: OPFS 구조를 시각적으로 탐색합니다.
- **파일 작업**: 파일/폴더 생성, 이름 변경, 이동, 삭제를 지원합니다.
- **드래그 앤 드롭**: 모델 파일을 직접 드래그하여 업로드할 수 있습니다.
- **컨텍스트 메뉴**: 우클릭을 통해 빠른 관리 기능을 제공합니다.
- **사용량 통계**: 실제 사용 중인 공간과 여유 공간을 실시간으로 표시합니다.

### 👤 프로필 시스템

사용자별 맞춤 설정을 위한 프로필 기능을 제공합니다:
- **커스텀 닉네임**: 사용자만의 닉네임을 자유롭게 설정합니다.
- **아바타 업로드**: 사용자만의 프로필 이미지를 직접 업로드하고 저장합니다.
- **커스텀 정체성**: 로컬 닉네임과 아바타를 안전하게 관리합니다.

### 🔄 자동 업데이트 및 PWA

항상 최신 기능을 안전하게 사용할 수 있습니다:
- **GitHub 릴리즈 동기화**: 6시간마다 GitHub API를 통해 업데이트를 자동 확인합니다.
- **업데이트 알림**: 새 버전 출시 시 배지와 변경 사항 모달을 통해 알립니다.
- **완전한 PWA 지원**: 서비스 워커 캐싱과 `SKIP_WAITING` 플로우를 통한 설치형 앱을 지원합니다.

### 🔒 개인정보 보호 및 백업

| 기능 | 설명 |
|------|------|
| **구글 드라이브 백업** | 설정과 채팅 기록을 구글 드라이브에 안전하게 백업합니다. |
| **AES-GCM-256 암호화** | PBKDF2(250,000회)와 AES-GCM-256을 통해 클라이언트 측에서 암호화합니다. |
| **Gzip 압축** | **CompressionStream API**를 사용하여 백업 데이터를 효율적으로 압축합니다. |
| **자동 백업** | 데이터 변경 시 25초 디바운싱 후 자동으로 백업을 수행합니다. |
| **백업 복원 및 언두**| 스냅샷 복원과 설정 초기화 시 **5초 이내 복구(Undo)** 기능을 지원합니다. |
| **서버 통신 없음** | 명시적인 백업 외에는 어떠한 데이터도 외부 서버로 전송되지 않습니다. |

### 🌐 사용자 경험

| 기능 | 설명 |
|------|------|
| **토스트 알림 시스템** | 성공, 정보, 경고, 오류 상황을 알리는 글로벌 알림 시스템입니다. |
| **상태 램프** | 모델 로딩 및 세션 상태를 색상으로 직관적으로 표시합니다. |
| **6개 탭 설정 모달** | 모델, LLM, 프로필, 테마, 언어, 백업으로 분류된 상세 설정을 제공합니다. |
| **4가지 테마** | 다크, 라이트, OLED 블랙, 하이 콘트라스트 모드를 지원합니다. |
| **접근성** | 모달 포커스 관리를 위한 **Focus Trap** 과 전체 키보드 단축키를 지원합니다. |
| **단축키 지원** | Ctrl+N (새 채팅), Ctrl+Enter (전송), Ctrl+L (포커스), Ctrl+, (설정) 등 |

## ✅ 검증 완료된 모델

LucidLLM에서 정상 작동이 확인된 모델 목록입니다:

| 모델 이름 | 양자화 | 상태 | Sanity QA |
| :--- | :--- | :--- | :--- |
| [HuggingFaceTB/SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | FP32, BNB4, Q4 | 검증됨 | 통과 |
| [vicgalle/gpt2-alpaca-gpt4](https://huggingface.co/vicgalle/gpt2-alpaca-gpt4) | Unknown | 검증됨 | 통과 |
| [onnx-community/Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct) | Q4, INT8, BNB4 | 검증됨 | 통과 |
| [onnx-community/Phi-4-mini-instruct-ONNX](https://huggingface.co/onnx-community/Phi-4-mini-instruct-ONNX) | Q4 | 검증됨 | 통과 |
| [onnx-community/Apertus-8B-Instruct-2509-ONNX](https://huggingface.co/onnx-community/Apertus-8B-Instruct-2509-ONNX) | Q4 | 검증됨 | 통과 |
| [onnx-community/Qwen3-4B-Thinking-2507-ONNX](https://huggingface.co/onnx-community/Qwen3-4B-Thinking-2507-ONNX) | Q4 | 검증됨 | 통과 |

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
| **RAM** | 4GB | 8GB 이상 |
| **저장공간** | 모델당 100MB ~ 2GB | SSD 권장 |
| **GPU** | 내장 그래픽 | WebGPU 지원 외장 그래픽 |

## 🚀 시작하기

### 라이브 데모

GitHub Pages에서 제공하는 데모를 즉시 사용해보세요 (설치 불필요):

👉 **https://ergo9ine.github.io/LucidLLM/**

### 로컬 (제로-빌드)

1. 저장소를 클론하고 해당 폴더를 서버로 실행합니다:

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm run serve    # http://localhost:3000 에서 실행
```

(대안: `python -m http.server 8000` 또는 `npx serve .`)

브라우저에서 열고 Settings → Model Management에서 모델을 다운로드·활성화합니다.

### 개발 및 테스트

- 선택사항: `npm install` (테스트/개발 도구 실행 시에만 필요)
- 단위 테스트: `npm test` (Vitest)
- E2E 테스트: `npx playwright test`

---

## 🛠️ 개발자 가이드

- **글로벌 네임스페이스**: 콘솔에서 `window.LucidApp` 을 통해 앱 상태와 API에 접근 가능합니다.
- **모니터링 API**: 디버깅을 위해 네트워크 이벤트 로그와 채팅 에러 로그를 확인할 수 있습니다.
- **런타임**: 바닐라 ES 모듈(별도 번들 불필요)
- **주요 파일**:
  - `script/bootstrap.js` — 초기화 및 초기 i18n
  - `script/main.js` — 핵심 로직, 상태 관리 및 UI 렌더링
  - `script/i18n.js` — 다국어 처리 모듈 (ko/en/ja/zh-CN)
  - `script/shared-utils.js` — 공용 유틸리티 및 글로벌 API
  - `script/worker.js` — 추론 워커 및 파이프라인 관리
  - `script/drive-backup.js` — 암호화된 구글 드라이브 백업
- **테스트**: Vitest 단위 테스트 (`npm test`), Playwright E2E 테스트 (`npx playwright test`)

---

## 🔒 보안 및 프라이버시

- 기본적으로 모든 데이터와 추론은 로컬에만 유지됩니다.
- 구글 드라이브 백업은 선택 사항이며 클라이언트 측에서 암호화됩니다.
- 모든 모델 가중치는 보안이 강화된 **Origin Private File System (OPFS)** 에 저장됩니다.

## 🏗️ 프로젝트 구조

```
LucidLLM/
├── index.html                  # 메인 HTML 엔트리 포인트
├── sw.js                       # 서비스 워커 (PWA 캐시)
├── script/
│   ├── bootstrap.js            # 앱 초기화 및 초기 i18n
│   ├── main.js                 # 핵심 로직, 상태, UI 렌더링
│   ├── i18n.js                 # 다국어 모듈 (ko/en/ja/zh-CN)
│   ├── shared-utils.js         # 공용 유틸리티 및 글로벌 API
│   ├── worker.js               # 추론 전용 웹 워커
│   └── drive-backup.js         # 암호화된 구글 드라이브 백업
├── docs/                       # 문서 및 다국어 README
│   ├── README.ko.md
│   ├── README.ja.md
│   ├── README.zh-CN.md
│   ├── compatibility.md
│   └── roadmap.md
├── favicon.svg                 # 앱 아이콘
└── package.json                # NPM 설정
```

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | JavaScript (ES2020+ Modules) |
| **아키텍처** | Zero-build, Vanilla JS (No Framework) |
| **ML 프레임워크** | Transformers.js v4.0.0-next.1 |
| **모델 포맷** | ONNX |
| **추론 백엔드** | WebGPU / WASM (자동 전환) |
| **스토리지** | Origin Private File System (OPFS), localStorage |
| **압축** | CompressionStream API (Gzip) |
| **스타일링** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **아이콘** | Lucide Icons (CDN) |
| **폰트** | Space Grotesk (Google Fonts) |
| **인증** | Google Identity Services (OAuth 2.0) |
| **암호화** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **CDN** | jsDelivr, unpkg |
| **테스트** | Vitest (단위), Playwright (E2E) |

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

## 🙏 감사의 글

- [Hugging Face](https://huggingface.co/) - Transformers.js 및 모델 호스팅
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 브라우저 내 ML 추론 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 퍼스트 CSS 프레임워크
- [Lucide Icons](https://lucide.dev/) - 아름다운 오픈소스 아이콘
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - 폰트 패밀리

---

**Made with ❤️ for privacy-focused AI**

[⬆ 맨 위로](#lucidllm-chat)
