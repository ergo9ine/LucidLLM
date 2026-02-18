# LucidLLM Chat

[한국어](../README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v4.0.0-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Planned-blue)

**LucidLLM**은 [Transformers.js](https://huggingface.co/docs/transformers.js)와 WebGPU 기술을 사용하여 AI 모델을 브라우저 내에서 완전히 로컬로 실행하는 채팅 애플리케이션입니다. 빌드 과정이 필요 없는(Zero-build) 아키텍처와 완벽한 개인정보 보호를 제공하며, 외부 서버로 데이터를 전송하지 않고도 강력한 AI 기능을 제공합니다.

> **주요 특징:** 18,200줄 이상의 코드 • 4개 국어 지원 • WebGPU/WASM 추론 가속 • 실시간 토큰 스트리밍 • 커스텀 Virtual DOM • AES-256 암호화 백업 • OPFS 모델 캐싱

## ✨ 핵심 기능

### 🤖 AI 및 모델

| 기능 | 설명 |
|------|------|
| **완전 로컬 추론** | 모든 AI 연산이 브라우저 내에서 실행되며, 데이터가 기기 밖으로 전송되지 않습니다. |
| **WebGPU 가속** | WebGPU를 통한 고속 추론을 지원하며, 미지원 브라우저에서는 자동으로 WASM으로 폴백됩니다. |
| **OPFS 모델 캐싱** | Origin Private File System을 사용하여 모델을 영구적으로 저장하고 재다운로드를 방지합니다. |
| **스마트 다운로드** | 이어받기, 지수 백오프(Exponential Backoff) 재시도, 양자화(Quantization) 선택을 지원합니다. |
| **다중 모델 지원** | 여러 ONNX 모델을 캐시하고 자유롭게 전환하여 사용할 수 있습니다. |
| **모델 카드 표시** | 모델의 메타데이터(업로더, 태스크, 라이선스, 좋아요 수 등)를 상세하게 표시합니다. |
| **Hugging Face 연동** | Hugging Face 허브에서 직접 모델을 검색하고 다운로드할 수 있습니다. |

### 💬 채팅 경험

| 기능 | 설명 |
|------|------|
| **다중 세션 채팅** | 여러 개의 독립적인 채팅 탭을 생성하여 대화 기록을 개별적으로 관리할 수 있습니다. |
| **실시간 스트리밍** | 토큰 생성 과정을 실시간으로 스트리밍하여 표시합니다. |
| **성능 모니터링** | 초당 토큰 수(TPS) 통계(평균/최대/최소)와 메모리 사용량을 실시간으로 보여줍니다. |
| **시스템 프롬프트** | AI 비서의 역할과 행동을 정의하는 시스템 프롬프트를 커스터마이징할 수 있습니다. |
| **컨텍스트 제어** | 4k부터 128k까지 컨텍스트 윈도우 크기를 조절할 수 있습니다. |
| **채팅 내보내기** | 대화 내용을 JSON 파일로 백업하고 내보낼 수 있습니다. |

### 🔒 개인정보 보호 및 백업

| 기능 | 설명 |
|------|------|
| **구글 드라이브 백업** | 설정과 채팅 기록을 구글 드라이브에 안전하게 백업합니다. |
| **강력한 암호화** | PBKDF2 키 유도(250,000회 반복)와 AES-GCM-256 알고리즘으로 클라이언트 측에서 암호화합니다. |
| **자동 백업** | 데이터 변경 시 자동으로 백업을 수행합니다(디바운싱 적용). |
| **버전 관리** | 여러 백업 버전을 유지하고 원하는 시점으로 복원할 수 있습니다. |
| **서버 통신 없음** | 명시적인 백업 외에는 어떠한 데이터도 외부 서버로 전송되지 않습니다. |

### 🌐 사용자 경험

| 기능 | 설명 |
|------|------|
| **4개 국어 지원** | 한국어, 영어, 일본어, 중국어(간체)를 지원하며 브라우저 언어를 자동 감지합니다. |
| **테마 옵션** | 다크 모드, 라이트 모드, OLED 블랙 모드를 지원합니다. |
| **반응형 디자인** | 모바일, 태블릿, 데스크탑 등 모든 기기에 최적화된 UI를 제공합니다. |
| **단축키 지원** | 새 채팅(Ctrl+Shift+N), 내보내기(Ctrl+Shift+E), 사이드바 토글(Ctrl+B) 등 생산성을 높이는 단축키를 제공합니다. |

## 📋 시스템 요구사항

### 브라우저 호환성

| 요구사항 | 상세 내용 |
|------|----------|
| **권장 브라우저** | Chrome 113+ / Edge 113+ (WebGPU 지원) |
| **최소 사양** | WASM을 지원하는 모든 최신 브라우저 |
| **보안 컨텍스트** | OPFS 사용을 위해 HTTPS 또는 localhost 환경 필수 |

### 하드웨어 권장사양

| 항목 | 최소 사양 | 권장 사양 |
|------|----------|----------|
| **RAM** | 4GB | 8GB 이상 |
| **GPU** | 내장 그래픽 | WebGPU 지원 외장 그래픽 |
| **저장공간** | 모델당 100MB ~ 2GB | SSD 권장 |

## 🚀 시작하기

### 라이브 데모

GitHub Pages에서 제공하는 데모를 즉시 사용해보세요 (설치 불필요):

👉 **https://ergo9ine.github.io/LucidLLM/**

### 로컬 (제로-빌드)

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
npm run serve    # http://localhost:3000 에서 실행
```

(대안: `python -m http.server 8000` 또는 `npx serve .`)

브라우저에서 열고 Settings → Model Management에서 모델을 다운로드·활성화합니다.

---

## 📖 사용 가이드 (요약)

- 설정 → 모델 관리에서 모델 추가 → 다운로드 → 활성화 → 채팅 시작
- 시스템 프롬프트와 컨텍스트 윈도우는 설정에서 제어합니다.

---

## 🛠️ 개발자 가이드

- 런타임: 바닐라 ES 모듈(별도 번들 불필요)
- 주요 파일:
  - `script/bootstrap.js` — 초기화
  - `script/main.js` — UI 상태/핸들러
  - `script/worker.js` — 추론 워커
  - `script/drive-backup.js` — 암호화 백업
- 테스트: `npm test` (Vitest)

---

## 🤝 기여 안내

- 큰 변경 사항은 이슈로 미리 논의해주세요.
- PR: 포크 → 브랜치 → PR(설명/테스트 포함)

---

## 🔒 보안 및 프라이버시

- 기본적으로 모든 데이터와 추론은 로컬에만 저장됩니다.
- Google Drive 백업은 선택적이며 클라이언트 측 암호화됩니다.
- 민감한 모델/데이터는 공개 업로드를 피하세요.

### 1. 모델 불러오기

1. 헤더의 **설정(⚙️)** 버튼을 클릭합니다.
2. **모델 관리** 탭으로 이동합니다.
3. Hugging Face 모델 ID를 입력합니다 (예: `onnx-community/SmolLM2-135M-Instruct`).
4. **조회** 버튼을 눌러 모델 정보를 가져옵니다.
5. 원하는 **양자화(Quantization)** 옵션을 선택합니다.
6. **다운로드**를 클릭하여 모델을 OPFS에 캐시합니다. (이어받기 지원)
7. 다운로드가 완료되면 **활성화** 버튼을 눌러 모델을 로드합니다.

### 2. 채팅하기

1. 하단 입력창에 메시지를 입력하고 **전송** 버튼을 누르거나 `Enter`를 칩니다.
2. 탭 바의 **+** 버튼으로 새로운 채팅 세션을 만들 수 있습니다.
3. 탭을 클릭하여 여러 대화 세션을 자유롭게 전환할 수 있습니다.

### 3. LLM 설정

**설정 > LLM 설정**에서 다음 항목을 조정할 수 있습니다:

| 설정 | 기본값 | 설명 |
|------|--------|------|
| **시스템 프롬프트** | "You are a helpful assistant." | AI의 역할과 성격을 정의합니다. |
| **최대 출력 토큰** | 512 | 한 번의 응답으로 생성할 수 있는 최대 길이를 제한합니다. |
| **컨텍스트 윈도우** | 8k | 모델이 기억할 수 있는 대화의 길이를 설정합니다. |
| **온도 (Temperature)** | 0.9 | 응답의 창의성과 무작위성을 조절합니다. |

### 4. Google Drive 백업

1. **설정 > 백업 및 복원**으로 이동합니다.
2. **Google Drive 연결** 버튼을 클릭하여 로그인합니다. (클라이언트 ID 자동 설정됨)
3. **자동 백업**을 활성화하면 변경 사항이 생길 때마다 자동으로 저장됩니다.
4. **지금 백업** 버튼으로 수동 백업도 가능합니다.
5. 복원 목록에서 원하는 시점을 선택하고 **복원** 버튼을 누르면 이전 상태로 되돌릴 수 있습니다.

## 🏗️ 프로젝트 구조

```
LucidLLM/
├── index.html                  # 메인 HTML 엔트리 포인트
├── script/
│   ├── bootstrap.js            # 애플리케이션 초기화
│   ├── main.js                 # 핵심 로직 및 상태 관리
│   ├── i18n.js                 # 다국어 처리 모듈
│   ├── shared-utils.js         # 공용 유틸리티
│   ├── worker.js               # 추론용 웹 워커
│   └── drive-backup.js         # Google Drive 백업 로직
├── style.css                   # 스타일 및 테마 정의
├── favicon.svg                 # 앱 아이콘
└── package.json                # NPM 설정
```

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | JavaScript (ES2020+ Modules) |
| **아키텍처** | Zero-build, Vanilla JS (No Framework) |
| **ML 프레임워크** | Transformers.js v4.0.0 |
| **추론 백엔드** | WebGPU / WASM (자동 전환) |
| **스토리지** | Origin Private File System (OPFS), localStorage |
| **스타일링** | Tailwind CSS v3 (CDN) + Custom CSS Variables |
| **아이콘** | Lucide Icons (CDN) |
| **인증** | Google Identity Services (OAuth 2.0) |
| **암호화** | Web Crypto API (PBKDF2, AES-GCM-256) |

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
