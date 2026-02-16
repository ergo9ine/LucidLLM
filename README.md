# LucidLLM Chat

LucidLLM은 브라우저 기반의 로컬 LLM(Large Language Model) 채팅 애플리케이션입니다. 외부 서버로 데이터를 전송하지 않고, 사용자의 브라우저 내에서 [Transformers.js](https://huggingface.co/docs/transformers.js)와 WebGPU 기술을 활용하여 안전하고 빠르게 AI 모델을 실행합니다.

## 주요 기능

- **완전한 로컬 추론** — 모든 AI 추론이 브라우저 내에서 수행됩니다. 채팅 데이터가 외부 서버로 전송되지 않아 개인정보 보호에 탁월합니다.
- **고성능 WebGPU 가속** — WebGPU를 통한 GPU 가속 추론을 지원합니다. 미지원 기기에서는 WASM으로 자동 폴백됩니다.
- **OPFS 모델 관리** — Origin Private File System(OPFS)을 사용하여 대용량 모델을 브라우저에 캐싱하고, 매번 다운로드 없이 즉시 로드할 수 있습니다.
- **모델 탐색기** — Hugging Face 모델 조회, 양자화 레벨 선택, 다운로드 일시정지/재개를 지원하는 통합 모델 관리 UI를 제공합니다.
- **멀티 세션 채팅** — 독립적인 대화 기록을 가진 여러 채팅 탭을 동시에 운영할 수 있습니다.
- **Google Drive 백업** — 설정 및 채팅 기록을 암호화하여 Google Drive에 백업하고 복원할 수 있습니다.
- **오프라인 지원** — Service Worker 기반 PWA로, 한 번 로드한 후에는 오프라인에서도 사용 가능합니다.
- **다국어 UI** — 한국어, English, 日本語, 简体中文을 지원합니다.
- **테마 커스터마이징** — Dark, Light, OLED Black 테마를 제공합니다.

## 요구 사항

| 항목 | 최소 요구 사항 |
|------|---------------|
| 브라우저 | Chrome 113+ / Edge 113+ (WebGPU 지원) |
| 폴백 | WASM 지원 브라우저 (WebGPU 미지원 시) |
| 보안 컨텍스트 | HTTPS 또는 localhost (Service Worker, OPFS 필수) |

## 시작하기

### 호스팅 버전 사용

GitHub Pages 배포 버전에 직접 접속하면 별도 설치 없이 바로 사용할 수 있습니다.

### 로컬 실행

1. **저장소 클론**

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
```

2. **로컬 서버 실행**

OPFS 및 Service Worker 사용을 위해 보안 컨텍스트(HTTPS 또는 localhost)가 필요합니다.

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

3. **브라우저 접속**

`https://lucidllm.pages.dev` 으로 접속합니다. Chrome 또는 Edge를 권장합니다.

### 개발 의존성 설치 (선택)

```bash
npm install
```

런타임 의존성(Transformers.js, Tailwind CSS, Lucide Icons, Google Fonts)은 CDN에서 로드되므로 별도 빌드 과정이 필요하지 않습니다.

## 사용 방법

### 모델 로드

1. 헤더의 **설정** 버튼(톱니바퀴 아이콘)을 클릭합니다.
2. **모델 관리** 탭에서 Hugging Face 모델 ID를 입력합니다 (예: `onnx-community/SmolLM2-135M-Instruct`).
3. **조회**를 클릭하여 모델 정보를 가져온 후, 양자화 레벨을 선택합니다.
4. **다운로드**를 클릭하면 모델이 OPFS에 캐싱됩니다.
5. 다운로드 완료 후 **활성화**를 클릭하여 모델을 로드합니다.

### 채팅

- 하단 입력란에 메시지를 작성하고 **보내기** 버튼 또는 `Enter`를 누릅니다.
- 탭 바의 **+** 버튼으로 새 채팅 세션을 생성할 수 있습니다.
- 채팅 탭을 클릭하여 세션 간 전환이 가능합니다.

### LLM 설정

- **시스템 프롬프트** — LLM 설정 탭에서 어시스턴트의 기본 동작을 정의합니다.
- **최대 생성 토큰** — 1~32,768 범위에서 응답 길이를 조절합니다.
- **컨텍스트 윈도우** — 4k, 8k, 16k, 32k, 128k 중 선택합니다.
- **Hugging Face 토큰** — 게이트 모델 접근을 위한 액세스 토큰을 설정합니다 (선택).

### 추론 장치 선택

헤더 우측의 드롭다운에서 전환할 수 있습니다:
- **WebGPU** — GPU 가속 추론 (권장).
- **CPU (WASM)** — WebGPU 미지원 브라우저용 폴백.

### Google Drive 백업 (개발중)

1. **설정 > 백업 및 복원** 탭으로 이동합니다.
2. Google Drive에 연결하고, 자동 백업을 활성화하거나 수동 백업을 실행합니다.
3. 이전 백업 스냅샷에서 복원할 수 있습니다.

백업 시 패스프레이즈를 사용한 암호화 및 gzip 압축을 선택적으로 적용할 수 있습니다.

## 프로젝트 구조

```
LucidLLM/
├── index.html              # 메인 HTML 엔트리 포인트
├── bootstrap.js            # 앱 초기화 및 Service Worker 등록
├── main.js                 # 핵심 애플리케이션 로직
├── shared-utils.js         # 공용 유틸리티 함수
├── global-api.js           # 전역 API 노출 (LucidApp 네임스페이스)
├── transformers-bridge.js  # Hugging Face Transformers.js 인터페이스
├── worker.js               # 모델 추론용 Web Worker
├── drive-backup-utils.js   # Google Drive 백업 유틸리티
├── drive-backup-crypto.js  # 백업 암호화/복호화
├── sw.js                   # Service Worker (오프라인 캐싱)
├── style.css               # 커스텀 스타일 및 테마 정의
├── favicon.svg             # 앱 아이콘
```

## 기술 스택

| 분류 | 기술 |
|------|------|
| 언어 | JavaScript (ES Modules) |
| 프론트엔드 | 순수 HTML5 / CSS3 / JS (프레임워크 없음) |
| ML 프레임워크 | [Transformers.js](https://huggingface.co/docs/transformers.js) v3.8.1 |
| 스타일링 | Tailwind CSS (CDN) + 커스텀 CSS 변수 |
| 아이콘 | Lucide Icons (CDN) |
| 폰트 | Space Grotesk (Google Fonts) |
| 스토리지 | Origin Private File System (OPFS) |
| 오프라인 | Service Worker (PWA) |
| GPU 가속 | WebGPU / WASM |
| 백업 | Google Drive API + AES 암호화 (선택) |
| 인증 | Google Identity Services (OAuth 2.0) |

## 개발 가이드

### 코드 컨벤션

- **ES Modules** — 모든 애플리케이션 코드는 ES Module 구문을 사용합니다.
- **중앙 집중식 상태 관리** — `main.js`의 단일 `state` 객체에서 전역 상태를 관리합니다.
- **직접 DOM 조작** — 프레임워크나 가상 DOM 없이 네이티브 DOM API를 사용합니다.
- **국제화 (i18n)** — 중앙 집중식 메시지 룩업으로 4개 언어를 지원합니다.
- **접근성** — ARIA 속성, 키보드 내비게이션, 포커스 관리를 준수합니다.
- **반응형 디자인** — 미디어 쿼리와 Tailwind CSS를 활용한 모바일 우선 접근법입니다.

## 기여하기

기여는 언제나 환영합니다! 버그를 발견하거나 새로운 기능을 제안하고 싶다면 Issue를 등록하거나 Pull Request를 보내주세요.

1. 이 저장소를 **Fork** 합니다.
2. `main` 브랜치에서 기능 브랜치를 생성합니다 (`git checkout -b feature/your-feature`).
3. **기존 코드 스타일**을 따릅니다 — ES Modules, 프레임워크 없음, 직접 DOM 조작.
4. 새로운 유틸리티 함수에 대해 `test/` 디렉토리에 **테스트를 추가**합니다.
5. 모델 로딩, 채팅, 설정 워크플로우가 정상 동작하는지 브라우저에서 테스트 합니다.
6. `node_modules/`, 에디터 설정, 빌드 아티팩트는 **커밋하지 않습니다**.
7. 변경 사항을 커밋하고 Pull Request를 생성합니다.

### 이슈 보고

GitHub Issue에 다음 정보를 포함하여 등록해 주세요:
- 브라우저 이름 및 버전
- 문제 재현 단계
- 기대 동작 vs 실제 동작
- 콘솔 오류 로그 (해당하는 경우)

### 호환성 보고

양자화 레벨에 따라 WASM,WebGPU 환경과 호환되지 않을 수 있습니다. 호환 가능한 모델은 GitHub Issue에 다음 정보를 포함하여 등록해 주세요:
- 모델이름
- Repository (HF,Github등 주소)
- 양자화 레벨
- 버전이나 해시

