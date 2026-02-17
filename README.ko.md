# LucidLLM Chat

[English](README.md) | [한국어](README.ko.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

![License](https://img.shields.io/github/license/ergo9ine/LucidLLM)
![Transformers.js](https://img.shields.io/badge/Transformers.js-v3.8.1-yellow)
![WebGPU](https://img.shields.io/badge/WebGPU-Supported-green)
![PWA](https://img.shields.io/badge/PWA-Enabled-blue)

**LucidLLM** 은 브라우저에서 완전히 실행되는 로컬 대규모 언어 모델 (LLM) 채팅 애플리케이션입니다. [Transformers.js](https://huggingface.co/docs/transformers.js) 와 WebGPU 기술을 사용하여 모든 데이터를 외부 서버로 전송하지 않고 브라우저 내에서 AI 모델을 안전하게 실행합니다.

> **주요 특징:** 17,600+ 라인 코드 • 4 개 언어 지원 • WebGPU/WASM 추론 • AES-256 암호화 백업 • OPFS 모델 캐싱 • 멀티세션 채팅

## ✨ 주요 기능

### 🤖 AI 및 모델

| 기능 | 설명 |
|------|------|
| **완전 로컬 추론** | 모든 AI 추론은 브라우저 내에서 실행되며, 데이터는 기기를 벗어나지 않습니다 |
| **WebGPU 가속** | GPU 가속 추론 지원, 미지원 기기는 WASM 으로 자동 폴백 |
| **OPFS 모델 캐싱** | Origin Private File System 으로 모델 영구 저장, 재다운로드 불필요 |
| **모델 다운로드 관리자** | 일시정지/재개, 지수 백오프 재시도, 양자화 레벨 선택 지원 |
| **다중 모델 지원** | 캐시된 여러 ONNX 모델 간 로드 및 전환 |
| **모델 카드 표시** | 모델 메타데이터 표시 (업로더, 태스크, 다운로드, 라이선스, 좋아요, 태그, 설명) |
| **Hugging Face 통합** | Hugging Face 모델 허브에서 직접 모델 조회 및 다운로드 |

### 💬 채팅 경험

| 기능 | 설명 |
|------|------|
| **멀티세션 채팅** | 독립된 대화 기록을 가진 여러 채팅 탭 지원 |
| **실시간 토큰 스트리밍** | 실시간 토큰 생성 및 스트리밍 표시 |
| **토큰 속도 통계** | 평균/최대/최소 토큰/초 표시 |
| **메모리 사용량 표시** | 실시간 메모리 소비 모니터링 |
| **시스템 프롬프트 에디터** | 어시스턴트 동작 커스터마이징 (최대 20 줄) |
| **컨텍스트 윈도우 제어** | 4k, 8k, 16k, 32k, 128k 컨텍스트 크기 선택 |
| **채팅 내보내기** | 대화를 JSON 파일로 내보내기 |
| **자동 스크롤** | 자동 하단 스크롤 및 수동 오버라이드 버튼 |

### 🔒 프라이버시 및 백업

| 기능 | 설명 |
|------|------|
| **Google Drive 백업** | 설정 및 채팅 기록을 Google Drive 에 암호화 백업 |
| **AES-GCM-256 암호화** | PBKDF2 키 유도 (250,000 라운드) 를 통한 클라이언트 사이드 암호화 |
| **Gzip 압축** | 백업 페이로드 선택적 압축 |
| **자동 백업** | 변경 사항 발생 시 자동 백업 (25 초 디바운싱) |
| **백업 복원** | 이전 백업 스냅샷에서 덮어쓰기 옵션으로 복원 |
| **백업 버전 관리** | Drive 에 여러 백업 버전 유지 |
| **서버 통신 없음** | 명시적 백업 시 모든 데이터는 로컬에 저장 |

### 🌐 사용자 경험

| 기능 | 설명 |
|------|------|
| **4 개 언어 지원** | 한국어, 영어, 일본어, 중국어 간체, 자동 언어 감지 |
| **3 가지 테마** | 다크, 라이트, OLED 블랙 (OLED 디스플레이용 순정 블랙) |
| **반응형 디자인** | 모바일 우선, 스마트폰/태블릿 완전 지원 |
| **PWA 지원** | 서비스워커 기반 오프라인 기능 |
| **사이드바 네비게이션** | 채팅 및 워크스페이스 패널과 함께 접이식 사이드바 |
| **키보드 단축키** | Ctrl+Shift+N (새 채팅), Ctrl+Shift+E (내보내기), Ctrl+B (사이드바 전환) |

## 📋 요구사항

### 브라우저 요구사항

| 요구사항 | 세부사항 |
|----------|----------|
| **최소 브라우저** | Chrome 113+ / Edge 113+ (WebGPU 지원) |
| **폴백 지원** | WASM 지원 브라우저 |
| **보안 컨텍스트** | HTTPS 또는 localhost 필요 (OPFS, 서비스워커) |
| **JavaScript** | ES2020+ 모듈 지원 |

### 하드웨어 요구사항

| 구성요소 | 최소 | 권장 |
|----------|------|------|
| **RAM** | 4GB | 8GB+ |
| **저장공간** | 모델당 100MB - 2GB | SSD 권장 |
| **GPU** | 통합 그래픽 | WebGPU 지원 전용 GPU |

### 권장 모델

| 모델 | 크기 | 양자화 | 용도 |
|------|------|--------|------|
| SmolLM2-135M-Instruct | ~135M | FP32, BNB4 | 테스트/개발 |
| Qwen2.5-0.5B-Instruct | ~500M | Q4_K_M | 균형 잡힌 성능 |
| Phi-3-mini-4k-instruct | ~3.8B | Q4_K_M | 고품질 응답 |

## 🚀 시작하기

### 호스팅 버전

설치 없이 GitHub Pages 배포를 직접 사용:

👉 **[라이브 데모](https://ergo9ine.github.io/LucidLLM/)**

### 로컬 실행

1. **리포지토리 클론**

```bash
git clone https://github.com/ergo9ine/LucidLLM.git
cd LucidLLM
```

2. **로컬 서버 실행**

OPFS 및 서비스워커 사용에는 보안 컨텍스트 (HTTPS 또는 localhost) 가 필요합니다.

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# 또는 포함된 npm 스크립트 사용
npm run serve
```

3. **브라우저로 접속**

`http://localhost:8000`(또는 사용한 포트) 에 접속합니다. Chrome 또는 Edge 를 권장합니다.

### 개발 의존성 (선택사항)

```bash
npm install
```

런타임 의존성 (Transformers.js, Tailwind CSS, Lucide Icons, Google Fonts) 은 CDN 에서 로드되므로 별도의 빌드 프로세스가 필요하지 않습니다.

## 📖 사용 가이드

### 1. 모델 로드하기

1. 헤더의 **설정** 버튼 (⚙️) 을 클릭합니다.
2. **모델 관리** 탭으로 이동합니다.
3. Hugging Face 모델 ID 를 입력합니다 (예: `onnx-community/SmolLM2-135M-Instruct`).
4. **조회**를 클릭하여 모델 정보를 가져옵니다.
5. 드롭다운에서 양자화 레벨을 선택합니다.
6. **다운로드**를 클릭하여 모델을 OPFS 에 캐시합니다 (일시정지/재개 지원).
7. 다운로드 완료 후 **활성화**를 클릭하여 모델을 로드합니다.

### 2. 채팅 시작하기

1. 하단 입력 필드에 메시지를 입력합니다.
2. **보내기**를 클릭하거나 `Enter` 키를 눌러 제출합니다.
3. 탭 바의 **+** 버튼을 사용하여 새 채팅 세션을 생성합니다.
4. 채팅 탭을 클릭하여 세션을 전환합니다.

### 3. LLM 설정 구성

**설정 > LLM 설정**으로 이동:

| 설정 | 기본값 | 범위 | 설명 |
|------|--------|------|------|
| **시스템 프롬프트** | "You are a helpful assistant." | 최대 20 줄 | 어시스턴트 동작 정의 |
| **최대 출력 토큰** | 512 | 1 - 32,768 | 응답 길이 제어 |
| **컨텍스트 윈도우** | 8k | 4k/8k/16k/32k/128k | 컨텍스트 크기 선택 |
| **Temperature** | 0.9 | 0.1 - 2.0 | 응답 무작위성 |
| **Top P** | 0.9 | 0.1 - 1.0 | 뉴클리어스 샘플링 |
| **Presence Penalty** | 0 | -2.0 - 2.0 | 반복 제어 |

### 4. 추론 장치 선택

헤더 오른쪽의 드롭다운으로 전환:

- **⚡ WebGPU** — GPU 가속 추론 (성능 권장).
- **🧩 CPU (WASM)** — WebGPU 지원 불가 브라우저를 위한 폴백.

### 5. Google Drive 백업

1. **설정 > 백업 및 복원**으로 이동합니다.
2. Google OAuth Client ID 를 입력합니다 (선택사항: Client Secret).
3. **Google Drive 연결**을 클릭하고 인증합니다.
4. **변경 시 자동 백업**을 활성화하여 자동 백업.
5. **지금 백업**을 사용하여 수동 백업.
6. **복원** 버튼을 사용하여 이전 백업 스냅샷에서 복원합니다.

## 🏗️ 프로젝트 구조

```
LucidLLM/
├── index.html                  # 메인 HTML 진입점 (728 라인)
├── bootstrap.js                # 앱 초기화 (62 라인)
├── main.js                     # 코어 애플리케이션 로직 (~12,600 라인)
├── i18n.js                     # 국제화 모듈 (~2,050 라인, 4 개 언어)
├── shared-utils.js             # 공유 유틸리티 및 글로벌 API (~450 라인)
├── transformers-bridge.js      # Transformers.js 인터페이스 레이어 (13 라인)
├── worker.js                   # 추론용 Web Worker (~200 라인)
├── drive-backup.js             # 암호화 포함 Google Drive 백업 (~250 라인)
├── style.css                   # 커스텀 스타일 및 테마 정의 (~1,140 라인)
├── favicon.svg                 # 앱 아이콘
├── package.json                # NPM 패키지 설정
├── docs/
│   ├── roadmap.md              # 기능 로드맵
│   └── compatibility.md        # 모델 호환성 정보
└── tests/                      # 테스트 스위트 (Vitest)
```

**총계: ~17,600+ 라인 코드**

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **언어** | JavaScript (ES2020+ Modules) |
| **아키텍처** | 제로빌드, Vanilla JS (프레임워크 없음) |
| **ML 프레임워크** | Transformers.js v3.8.1 |
| **추론 백엔드** | WebGPU / WASM (자동 폴백) |
| **저장소** | Origin Private File System (OPFS), localStorage |
| **스타일링** | Tailwind CSS v3 (CDN) + 커스텀 CSS 변수 |
| **아이콘** | Lucide Icons (CDN) |
| **폰트** | Space Grotesk (Google Fonts) |
| **오프라인** | 서비스 워커 (네트워크 전용 전략) |
| **백업 인증** | Google Identity Services (OAuth 2.0) |
| **암호화** | Web Crypto API (PBKDF2, AES-GCM-256) |
| **압축** | CompressionStream API (Gzip) |
| **CDN** | jsDelivr, unpkg |

## 🔧 설정

### 저장된 설정 (localStorage)

| 카테고리 | 설정 |
|----------|------|
| **LLM** | 시스템 프롬프트, 최대 토큰, 컨텍스트 윈도우, HF 토큰, temperature, top_p, presence_penalty |
| **프로필** | 닉네임, 아바타, 언어, 테마 |
| **추론** | 선호 장치 (webgpu/wasm) |
| **백업** | Client ID, 자동 백업, 백업 제한, 마지막 동기화 |

### 주요 저장 위치

| 저장소 | 용도 |
|--------|------|
| `lucid_user_profile_v1` | 사용자 프로필 (닉네임, 아바타, 언어, 테마) |
| `lucid_system_prompt` | 시스템 프롬프트 설정 |
| `lucid_max_output_tokens` | 최대 출력 토큰 설정 |
| `lucid_context_window` | 컨텍스트 윈도우 크기 |
| `lucid_inference_device` | 추론 장치 선호도 |
| `lucid_google_drive_*` | Google Drive 백업 설정 |

## 🧪 개발 가이드

### 코드 규칙

- **ES Modules** — 모든 애플리케이션 코드는 ES Module 구문을 사용합니다.
- **중앙 집중식 상태 관리** — 글로벌 상태는 `main.js` 의 단일 `state` 객체에서 관리됩니다.
- **직접 DOM 조작** — 프레임워크나 가상 DOM 없이 네이티브 DOM API 를 사용합니다.
- **국제화 (i18n)** — 200+ 번역 키와 계층적 폴백을 제공합니다.
- **접근성** — ARIA 속성, 키보드 네비게이션, 포커스 관리를 준수합니다.
- **반응형 디자인** — 미디어 쿼리와 Tailwind CSS 를 활용한 모바일 우선 접근.

### 주요 모듈

#### `i18n.js` - 국제화

```javascript
import { t, I18N_KEYS, setCurrentLanguage } from './i18n.js';

// 언어 설정
setCurrentLanguage('ko');

// 변수 포함 번역
t(I18N_KEYS.STATUS_MODEL_LOADING, { model: 'SmolLM2' });
// → "SmolLM2 로딩 중..."

// DOM 에 적용
applyI18nToDOM(document);
```

**지원 언어:** 한국어, 영어, 일본어, 중국어 간체

#### `shared-utils.js` - 유틸리티

```javascript
import {
    formatBytes,
    formatSpeed,
    formatEta,
    getErrorMessage,
    publishLucidApi
} from './shared-utils.js';

// 파일 크기 포맷
formatBytes(1024 * 1024 * 500);  // → "500 MB"

// 속도 포맷
formatSpeed(1024 * 512);  // → "512 KB/s"

// 시간 포맷
formatEta(3665);  // → "1 시간"

// 글로벌 API 노출
publishLucidApi({ myFunction: () => {} });
```

### 테스트 실행

```bash
# 테스트 스위트 실행
npm test
```

### 프로덕션 빌드

**빌드 단계 불필요!** 이 애플리케이션은 제로빌드이며 정적 파일에서 직접 실행됩니다.

## 🗺️ 로드맵

### 완료됨

- [x] 지연 로딩付き 최적화 i18n 시스템 (200+ 키)
- [x] i18n 용 키 네임스페이스 상수
- [x] 번역을 위한 계층적 폴백 구조
- [x] 모델 캐싱용 OPFS fetch 인터셉터
- [x] 백업용 클라이언트 사이드 암호화
- [x] 독립된 기록을 가진 멀티세션 채팅
- [x] 실시간 토큰 속도 통계

### 진행 중

- [ ] 토큰별 출력을 통한 스트리밍 응답
- [ ] 코드 구문 강조付き Markdown 렌더링
- [ ] 메시지 편집 및 재생성

### 계획됨

- [ ] 멀티모달 입력 (Vision 모델을 통한 이미지 분석)
- [ ] 모델 비교 모드
- [ ] 자동 양자화 권장
- [ ] 로컬 문서용 RAG 지원
- [ ] 함수 호출 인터페이스
- [ ] 대화 분기 (fork)
- [ ] Web Speech API 를 통한 음성 입출력
- [ ] PWA 설치를 위한 Web App Manifest
- [ ] 장시간 추론 태스크에 대한 푸시 알림

전체 로드맵은 [docs/roadmap.md](docs/roadmap.md) 를 참조하세요.

## 🤝 기여

기여는 항상 환영합니다! 버그를 찾거나 새 기능을 제안하고 싶다면 Issue 를 등록하거나 Pull Request 를 보내주세요.

### 기여 방법

1. 이 리포지토리를 **포크**합니다.
2. `main` 브랜치에서 기능 브랜치를 생성합니다:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **기존 코드 스타일**을 따릅니다:
   - ES Modules
   - 프레임워크 없음
   - 직접 DOM 조작
4. 새 유틸리티 함수에 대해 `tests/` 디렉토리에 **테스트를 추가**합니다.
5. 브라우저에서 기능을 테스트합니다:
   - 모델 로딩
   - 채팅 워크플로우
   - 설정 관리
6. **커밋하지 않기**:
   - `node_modules/`
   - 편집기 설정
   - 빌드 산출물
7. 변경 사항을 커밋하고 Pull Request 를 생성합니다.

### Issue 보고

GitHub Issue 를 등록할 때 다음 정보를 포함해주세요:

- 브라우저 이름 및 버전
- OS 및 버전
- 재현 단계
- 예상 동작 vs 실제 동작
- 콘솔 오류 로그 (해당되는 경우)
- 스크린샷 (해당되는 경우)

### 호환성 보고

양자화 레벨에 따라 일부 모델은 WASM 또는 WebGPU 환경과 호환되지 않을 수 있습니다. 다음 정보와 함께 호환되는 모델을 GitHub Issues 에 등록해주세요:

- 모델 이름
- 리포지토리 (HF, Github URL)
- 양자화 레벨
- 버전 또는 해시
- 성능 메모 (tokens/sec, 메모리 사용량)

알려진 호환 모델은 [docs/compatibility.md](docs/compatibility.md) 를 참조하세요.

## 📊 성능 벤치마크

| 모델 | 장치 | Tokens/sec | 메모리 | 첫 토큰 |
|------|------|------------|--------|---------|
| SmolLM2-135M | WebGPU | ~45 tok/s | 800 MB | ~2 초 |
| SmolLM2-135M | WASM | ~8 tok/s | 600 MB | ~5 초 |
| Qwen2.5-0.5B | WebGPU | ~25 tok/s | 1.2 GB | ~3 초 |
| Phi-3-mini | WebGPU | ~12 tok/s | 2.5 GB | ~5 초 |

*성능은 하드웨어에 따라 다릅니다. M2 MacBook Pro 에서 테스트.*

## 🔒 보안

- **클라이언트 사이드 암호화** — PBKDF2 키 유도 (250,000 라운드) 를 통한 AES-GCM-256
- **텔레메트리 없음** — 분석 또는 추적 코드 없음
- **로컬 데이터 저장** — 명시적 백업 시 모든 데이터는 브라우저에 저장
- **보안 컨텍스트 필요** — OPFS/서비스워커를 위한 HTTPS 또는 localhost

## 📚 문서

- [로드맵](docs/roadmap.md) - 기능 로드맵 및 계획된 개선
- [호환성](docs/compatibility.md) - 모델 호환성 정보
- [LICENSE](LICENSE) - ISC 라이선스

## 🌐 국제화 (i18n)

이 프로젝트는 200+ 번역 키를 가진 `i18n.js` 를 통해 다국어 지원을 제공합니다. 언어는 브라우저의 언어 설정에 따라 자동으로 감지되며, 설정 메뉴에서 수동으로 변경할 수 있습니다.

**지원 언어:**
- 🇰🇷 한국어
- 🇺🇸 English
- 🇯🇵 日本語
- 🇨🇳 简体中文

### 새 언어 추가하기

1. `i18n.js` 를 엽니다.
2. 적절한 섹션에 언어별 번역을 추가합니다.
3. `ja` 또는 `zh-CN` 이 영어에서 상속하는 경우 오버라이드를 추가합니다.
4. `SUPPORTED_LANGUAGES` 배열을 업데이트합니다.

```javascript
// 예: 독일어 추가
const DE_SPECIFIC = {
    [I18N_KEYS.HEADER_SETTINGS]: "Einstellungen",
    [I18N_KEYS.CHAT_PLACEHOLDER]: "Nachricht eingeben...",
    // ...
};
```

## 🏆 주목할 기술적 성과

### 1. 제로빌드 아키텍처
전체 애플리케이션은 빌드 프로세스 없이 정적 파일에서 직접 실행됩니다. 모든 의존성은 CDN 에서 로드됩니다.

### 2. OPFS Fetch 인터셉터
커스텀 fetch 인터셉터가 OPFS 의 캐시된 모델 파일을 투명하게 제공하여 원격 Hugging Face 요청이 로컬 파일 읽기처럼 보이게 합니다.

### 3. 계층적 i18n 시스템
- `I18N_KEYS` 상수를 가진 200+ 번역 키
- 계층적 폴백: 현재 → 영어 → 한국어
- 캐싱付き 지연 로딩 사전
- `data-i18n` 속성을 통한 자동 DOM 번역

### 4. 클라이언트 사이드 암호화
Web Crypto API 를 사용한 완전한 백업 암호화:
- PBKDF2 키 유도 (250,000 라운드)
- AES-GCM-256 암호화
- Gzip 압축 지원

### 5. 스트리밍 토큰 생성
실시간 토큰 스트리밍:
- 빔 서치 콜백 파싱
- 증분 표시를 위한 델타 계산
- 토큰 속도 통계 (평균/최대/최소)
- 스로틀링된 렌더링 (최대 60 FPS)

### 6. 다운로드 관리자
견고한 다운로드 시스템:
- 일시정지/재개 지원
- 지수 백오프 재시도 (3 회 재시도, 800ms 기본)
- 진행률 추적 (속도, 예상 시간, 바이트)
- 멀티파일 모델용 큐 관리

## 📄 라이선스

이 프로젝트는 **ISC 라이선스**에 따라 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Hugging Face](https://huggingface.co/) - Transformers.js 및 모델 호스팅
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 브라우저 내 ML 추론
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Lucide Icons](https://lucide.dev/) - 아름다운 아이콘
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - 폰트 패밀리

---

**프라이버시 중심 AI 를 위해 ❤️ 로 제작**

[⬆ TOP](#lucidllm-chat)
