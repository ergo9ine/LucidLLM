# LucidLLM E2E 테스트 가이드 (agent-browser)

> [agent-browser](https://github.com/vercel-labs/agent-browser) — AI 에이전트용 헤드리스 브라우저 자동화 CLI

---

## 1. 설치

```bash
# 전역 설치 (권장)
npm install -g agent-browser && agent-browser install

# 또는 npx로 즉시 사용
npx agent-browser install
```

`install` 명령은 내장 Chromium을 다운로드합니다. 최초 1회만 실행하면 됩니다.

---

## 2. 로컬 서버 실행

LucidLLM은 정적 파일 앱이므로 아무 HTTP 서버나 사용 가능합니다.

```bash
# 프로젝트 루트에서
npx serve -l 3456
# 또는
python -m http.server 3456
```

---

## 3. 기본 워크플로

### 3.1 페이지 열기

```bash
npx agent-browser open http://localhost:3456/
```

### 3.2 페이지 상태 확인

```bash
# 접근성 트리 (요소 참조 번호 포함)
npx agent-browser snapshot

# 스크린샷
npx agent-browser screenshot e2e-capture.png

# 전체 페이지 스크린샷
npx agent-browser screenshot e2e-full.png --full

# 요소에 라벨이 붙은 스크린샷
npx agent-browser screenshot e2e-annotated.png --annotate
```

### 3.3 요소 클릭

```bash
# snapshot에서 확인한 @ref 번호로 클릭
npx agent-browser click @42

# CSS 셀렉터로 클릭
npx agent-browser click "#open-settings-btn"

# 시맨틱 검색으로 클릭
npx agent-browser find role button click --name "Settings"
npx agent-browser find text "다운로드" click
```

### 3.4 텍스트 입력

```bash
# 필드 비우고 입력
npx agent-browser fill "#system-prompt-input" "You are a helpful assistant."

# 기존 내용 유지하면서 타이핑
npx agent-browser type "#model-id-input" "onnx-community/Qwen2.5-0.5B-Instruct"
```

### 3.5 JavaScript 실행

```bash
# DOM 상태 검사
npx agent-browser eval "document.getElementById('drive-backup-panel-host')?.children.length"

# 복잡한 검사 (IIFE 사용)
npx agent-browser eval "(() => {
  const panels = document.querySelectorAll('[data-settings-panel]');
  return Array.from(panels).map(p => p.id + ':' + p.innerHTML.length);
})()"

# Promise 반환도 가능
npx agent-browser eval "fetch('/script/main.js').then(r => r.text()).then(t => t.length)"
```

---

## 4. 자주 사용하는 테스트 시나리오

### 4.1 서비스 워커 캐시 클리어 후 테스트

서비스 워커가 오래된 JS를 캐시할 수 있으므로, 테스트 전에 항상 클리어하는 것을 권장합니다.

```bash
npx agent-browser eval "navigator.serviceWorker.getRegistrations().then(async r => { for (const reg of r) await reg.unregister(); const keys = await caches.keys(); for (const k of keys) await caches.delete(k); return 'cleared'; })"

# 클리어 후 새로고침
npx agent-browser open http://localhost:3456/
```

### 4.1.1 테스트용 모델은 OPFS에 캐시해 재사용

LucidLLM에서 모델 파일은 HTTP 캐시가 아니라 **OPFS(Origin Private File System)** 에 저장됩니다.  
즉, E2E에서 테스트용 모델을 한 번만 다운로드해 두고 같은 origin에서 계속 재사용하는 방식이 가장 빠릅니다.

권장 규칙:

*   **같은 origin 유지**: `http://localhost:3456`처럼 **프로토콜 + 호스트 + 포트**를 매번 동일하게 유지해야 OPFS 모델 캐시가 재사용됩니다.
*   **서비스 워커 캐시만 정리**: 위 4.1의 `caches.delete(...)` / `unregister()`는 JS/WASM 캐시 정리용입니다. 이 과정만으로는 OPFS의 모델 파일은 삭제되지 않으므로, 일반적인 E2E 회귀 테스트에서는 그대로 두는 편이 좋습니다.
*   **콜드 다운로드 테스트는 분리**: 매번 새로 다운로드할 필요가 없는 시나리오는 OPFS 캐시를 재사용하고, 실제 다운로드 동작 검증이 필요할 때만 모델 관리 표나 OPFS Explorer에서 해당 모델을 삭제한 뒤 별도 케이스로 실행하세요.

예시 흐름:

```bash
# 1) 최초 1회만 테스트 모델 다운로드
#    예: HuggingFaceTB/SmolLM2-135M-Instruct

# 2) 이후 테스트 시작 시 모델이 이미 OPFS에 있는지 확인
npx agent-browser click "#open-settings-btn"
npx agent-browser click "[data-settings-tab-btn='model']"
npx agent-browser wait --fn "Array.from(document.querySelectorAll('[data-file-name]')).some(el => (el.getAttribute('data-file-name') || '').includes('SmolLM2-135M-Instruct'))"

# 3) 캐시가 있으면 재다운로드 대신 세션 로드/활성화만 수행
#    (모델 관리 표의 Activate/활성화 버튼 사용)

### 4.1.1.1 추천 테스트 모델 캐시 및 재사용

아래 4가지 모델은 E2E 회귀 테스트의 기준 모델입니다. 최초 1회 다운로드 후 OPFS에 보관하여 매번 수백 MB의 네트워크 비용 없이 테스트를 수행하세요.

1.  **vicgalle/gpt2-alpaca-gpt4** (초경량, 로직 테스트용)
    *   `vicgalle/gpt2-alpaca-gpt4` 입력 -> `fp32::onnx/model.onnx` 선택 -> 다운로드.
2.  **HuggingFaceTB/SmolLM2-135M-Instruct** (중급, WebGPU/양자화 검증용)
    *   `HuggingFaceTB/SmolLM2-135M-Instruct` 입력 -> `q4::onnx/model_q4.onnx` 선택 -> 다운로드. (**주의: Q4F16 금지**)
3.  **onnx-community/Olmo-3-7B-Instruct-ONNX** (대형, 메모리/스트리밍 검증용)
    *   `onnx-community/Olmo-3-7B-Instruct-ONNX` 입력 -> `q4::onnx/model_q4.onnx` 선택 -> 다운로드.
4.  **onnx-community/Qwen3-4B-Thinking-2507-ONNX** (Thinking 모델, reasoning 파이프라인 검증용)
    *   `onnx-community/Qwen3-4B-Thinking-2507-ONNX` 입력 -> `q4::onnx/model_q4.onnx` 선택 -> 다운로드. (**주의: Q4F16 금지**)
    *   **필수**: 2.72 GB 초과 모델이므로 반드시 `--profile` 옵션으로 실행해야 OPFS 할당량이 충분히 확보됩니다. (4.1.4 참조)

**재사용 방법:**
설정 -> 모델 관리 -> '모델 세션 리스트' 표에서 해당 모델 ID를 찾은 후 **[활성화(Activate)]** 버튼을 클릭하면 다운로드 없이 즉시 메모리에 로드됩니다.

```
### 4.1.1.2 3개 모델 E2E 테스트 결과 및 QA (2026-03-10 수행)

다음은 주요 모델의 E2E 테스트 통과 현황 및 10개 문답 결과입니다.

| 모델 | 상태 | 특이사항 |
| :--- | :---: | :--- |
| **HuggingFaceTB/SmolLM2-135M-Instruct** | **PASS** | `q8` 양자화 추천. 답변 품질은 낮으나 논리(2+2=4 등) 정상. |
| **vicgalle/gpt2-alpaca-gpt4** | **FAIL** | 다운로드/캐시는 성공하나, 실행 시 `MatMul dimension mismatch` 오류 발생(FP32). |
| **onnx-community/Olmo-3-7B-Instruct-ONNX** | **PENDING** | 대용량 모델로 다운로드 검증 위주 수행. |

**SmolLM2-135M-Instruct QA 기록:**
1. **What is 2+2?** -> "4"
2. **Who wrote Hamlet?** -> "William Shakespeare"
3. **What is the capital of France?** -> "Paris"
4. **What is photosynthesis?** -> "Process of plants converting light into energy."
5. **Short story (2 sentences)** -> "The stars shone brightly in the night. The moon watched over the sleeping world."
6. **Square root of 16?** -> "4"
7. **Who is Leonardo da Vinci?** -> "Renaissance polymath, painter, and inventor."
8. **Earth's Atmosphere?** -> "78% nitrogen, 21% oxygen."
9. **Explain gravity (1 sentence)** -> "A force that attracts objects toward each other."
10. **What is H2O?** -> "Water"

### 4.1.1.3 Qwen3-4B-Thinking-2507-ONNX Q4 E2E 테스트 결과 (2026-03-12 수행)

| 모델 | 상태 | 특이사항 |
| :--- | :---: | :--- |
| **onnx-community/Qwen3-4B-Thinking-2507-ONNX** | **PARTIAL** | 정답 생성은 정상이나 thinking 텍스트가 그대로 노출됨. `stripReasoningTrace` 버그. |

**Qwen3-4B-Thinking QA 기록** (새 채팅, WebGPU):

| # | 질문 | 정답 여부 | 상태 |
|---|---|---|---|
| 1 | What is 2+2? Answer with only the number. | ✓ (4) | ❌ FAIL — 빈 응답 오류 (strict 검증기 4번 거부) |
| 2 | What is the capital of France? | ✓ (Paris) | ⚠️ PARTIAL — thinking 텍스트 노출 후 정답 포함 |
| 3 | Who wrote Hamlet? | ✓ (William Shakespeare) | ⚠️ PARTIAL |
| 4 | What is photosynthesis? (1 sentence) | ✓ | ⚠️ PARTIAL |
| 5 | What is the square root of 144? | ✓ (12) | ⚠️ PARTIAL |
| 6 | Who was Leonardo da Vinci? | ✓ | ⚠️ PARTIAL |
| 7 | Explain gravity in one sentence. | ✓ | ⚠️ PARTIAL |
| 8 | What is H2O? | ✓ (water) | ❌ FAIL — 빈 응답 오류 (재시도 "Tell me in one word" 형식으로 성공) |
| 9 | What are the primary colors? | ✓ (red/yellow/blue 등) | ⚠️ PARTIAL |
| 10 | Write a two-sentence story about a dragon. | ✓ | ⚠️ PARTIAL |

**총점**: 0 PASS / 8 PARTIAL / 2 FAIL

**판정 기준**: ✅ PASS = thinking 없이 정답만 출력 / ⚠️ PARTIAL = 정답 포함이나 thinking 텍스트 함께 노출 / ❌ FAIL = 빈 응답 오류

**근본 원인**: `stripReasoningTrace` 함수가 Qwen3-4B-Thinking의 실제 출력 형식을 처리하지 못함. 이 모델은 `<think>` 시작 태그 없이 thinking 텍스트를 출력하고 `</think>` 종료 태그로 마무리함. 수정 방법은 `debug-qwen3-4b-e2e.md` 참조.

### 4.1.2 WebGPU E2E는 반드시 headed 브라우저로 실행

**헤드리스 브라우저에서는 WebGPU가 동작하지 않습니다.**  
따라서 `⚡ WebGPU` 경로를 검증할 때는 반드시 `--headed` 옵션으로 브라우저를 실행하세요.

```bash
# WebGPU 검증용
npx agent-browser --headed open http://localhost:3456/

# CPU/WASM 전용 회귀 테스트라면 headless 유지 가능
npx agent-browser open http://localhost:3456/
```

### 4.1.3 SmolLM2-135M-Instruct는 Q4로 테스트 (Q4F16/F16 금지)

> [!IMPORTANT]  
> **Q4와 Q4F16은 기술적으로 완전히 다른 모델입니다.**  
> *   **Q4 (INT4)**: 가중치를 4비트 정수로 저장하며, F16을 지원하지 않는 환경에서도 안정적으로 동작합니다. (현재 환경의 표준)
> *   **Q4F16 (Float16-aware 4-bit)**: 내부 계산에 Float16(F16)을 사용하도록 최적화된 모델로, **현재 사용자 환경(F16 미지원)에서는 절대 동작하지 않습니다.**  

테스트 시 실수로 `Q4F16`이나 `F16`이 포함된 선택지를 선택하지 않도록 각별히 주의하십시오. 반드시 **`Q4`** (`q4::onnx/model_q4.onnx`)를 선택해야 합니다.

*   `Q4` (`q4::onnx/model_q4.onnx`) — **권장 및 표준**, E2E 테스트용
*   `Q8` (`q8::onnx/model_quantized.onnx`) — 대안
*   `BNB4` (`bnb4::onnx/model_bnb4.onnx`)
*   `FP32` (`fp32::onnx/model.onnx`)

### 4.1.4 Qwen3-4B-Thinking-2507 (Q4) 테스트 시 주의사항

Thinking 모델은 일반 모델보다 훨씬 큰 리소스와 특정 설정이 필요합니다.

1.  **브라우저 영구 프로필 필수**: 이 모델은 약 2.72 GB로, 무프로필(임시 디렉터리) 실행 시 OPFS 할당량이 ~1.96 GB로 제한되어 다운로드가 실패합니다. 반드시 `--profile` 옵션을 사용하여 영구 프로필을 지정하십시오.

    | 실행 방법 | OPFS 할당량 | 2 GB+ 모델 |
    | :--- | :---: | :---: |
    | `--headed` (무프로필) | ~1.96 GB | ❌ |
    | `--headed --profile <dir>` | ~285 GB | ✅ |

    ```bash
    # 프로젝트 루트에 영구 프로필 디렉터리 생성 (최초 1회)
    mkdir -p .e2e-profile

    # 이후 모든 대용량 모델 E2E는 아래 형식으로 실행
    npx agent-browser --headed --profile "./.e2e-profile" open http://localhost:3456/

    # SW 캐시 클리어 시에도 --profile 일관 적용
    npx agent-browser --headed --profile "./.e2e-profile" eval "navigator.serviceWorker.getRegistrations().then(async r => { for (const reg of r) await reg.unregister(); const keys = await caches.keys(); for (const k of keys) await caches.delete(k); return 'cleared'; })"
    ```

    > **주의**: `.e2e-profile` 디렉터리는 `.gitignore`에 추가하세요. OPFS 모델 데이터가 포함되어 수 GB에 달할 수 있습니다.

2.  **토큰 캡(Token Cap) 확인**: Thinking 모델은 내부 추론 과정(Reasoning trace) 생성을 위해 수천 개의 토큰이 필요합니다. 앱 내부의 `LOCAL_MAX_NEW_TOKENS_QWEN_THINKING_CAP`이 **4096** 이상으로 설정되어 있는지 확인하세요.

3.  **추론 과정(Reasoning Trace) 출력 형식 주의**: Qwen3-4B-Thinking-2507-ONNX는 일반적인 `<think>...</think>` 양방향 태그 형식과 다릅니다. **`<think>` 시작 태그 없이** 첫 토큰부터 추론 텍스트를 출력하고, 추론 종료 시점에만 `</think>` 태그를 삽입한 뒤 실제 답변을 생성합니다.

    ```
    # Qwen3-4B-Thinking의 실제 출력 형식
    [추론 텍스트... (태그 없음)]
    </think>
    실제 답변
    ```

    `stripReasoningTrace`가 이 형식을 처리하지 못하면 추론 텍스트 전체가 UI에 노출됩니다. 수정 방법은 `debug-qwen3-4b-e2e.md` (BUG-1) 참조.

```bash
# 모델 조회 후 Q4 선택
npx agent-browser select "#download-quantization-select" "q4::onnx/model_q4.onnx"
```

### 4.2 설정 패널 열기 및 탭 전환

```bash
# 설정 열기
npx agent-browser click "#open-settings-btn"

# 탭 전환 (data-settings-tab-btn 속성 사용)
npx agent-browser click "[data-settings-tab-btn='llm']"
npx agent-browser click "[data-settings-tab-btn='profile']"
npx agent-browser click "[data-settings-tab-btn='theme']"
npx agent-browser click "[data-settings-tab-btn='language']"
npx agent-browser click "[data-settings-tab-btn='backup']"
npx agent-browser click "[data-settings-tab-btn='model']"
```

### 4.3 각 설정 탭 콘텐츠 검증

```bash
# 모든 설정 패널의 innerHTML 길이 확인 (0이면 빈 패널)
npx agent-browser eval "(() => {
  const panels = document.querySelectorAll('[data-settings-panel]');
  return Array.from(panels).map(p =>
    p.dataset.settingsPanel + ': ' + p.innerHTML.trim().length + ' chars, ' + p.children.length + ' children'
  ).join(' | ');
})()"
```

### 4.4 OPFS 탐색기 테스트

```bash
# 설정 → 모델 관리 탭에서 OPFS 탐색기 확인
npx agent-browser click "#open-settings-btn"
npx agent-browser click "[data-settings-tab-btn='model']"

# OPFS 트리 로딩 상태 확인
npx agent-browser eval "document.getElementById('opfs-tree-body')?.innerHTML?.length"
```

### 4.5 채팅 기능 테스트

```bash
# 채팅 입력 (모델 로드 없이 UI 테스트만)
npx agent-browser fill "#chat-input" "Hello, world!"
npx agent-browser screenshot e2e-chat-input.png

# 채팅 탭 추가
npx agent-browser click "#chat-tab-add-btn"
```

### 4.6 콘솔 에러 확인

```bash
# 페이지의 uncaught 에러 확인
npx agent-browser errors

# 콘솔 로그 확인
npx agent-browser console
```

---

## 5. 고급 기능

### 5.1 대기 (Wait)

```bash
# 요소가 나타날 때까지 대기
npx agent-browser wait "#settings-window"

# 밀리초 대기
npx agent-browser wait 2000

# 네트워크 idle 대기
npx agent-browser wait --load networkidle

# 특정 텍스트 출현 대기
npx agent-browser wait --text "모델 로드 완료"

# JS 조건 대기
npx agent-browser wait --fn "document.getElementById('opfs-tree-body')?.children.length > 0"
```

### 5.2 요소 상태 확인

```bash
# 가시성
npx agent-browser is visible "#settings-window"

# 활성화 여부
npx agent-browser is enabled "#drive-backup-now-btn"

# 체크 여부
npx agent-browser is checked "#drive-backup-compress-toggle"
```

### 5.3 값 가져오기

```bash
# 텍스트 콘텐츠
npx agent-browser get text "#model-status-text"

# input 값
npx agent-browser get value "#system-prompt-input"

# 특정 속성
npx agent-browser get attr "#settings-panel-llm" "class"

# 요소 개수
npx agent-browser get count "[data-settings-panel]"
```

### 5.4 스냅샷 비교 (diff)

```bash
# 이전 스냅샷과 현재 비교
npx agent-browser diff snapshot

# 베이스라인 스크린샷과 비교
npx agent-browser screenshot baseline.png
# ... (변경 적용 후)
npx agent-browser diff screenshot --baseline baseline.png -o diff-result.png
```

### 5.5 localStorage / sessionStorage

```bash
# 전체 localStorage 조회
npx agent-browser storage local

# 특정 키
npx agent-browser storage local "lucidllm-language"

# 값 설정
npx agent-browser storage local set "lucidllm-theme" "dark"
```

### 5.6 뷰포트 및 디바이스 에뮬레이션

```bash
# 모바일 뷰포트
npx agent-browser set viewport 375 812

# 디바이스 에뮬레이션
npx agent-browser set device "iPhone 14"

# 다크모드 에뮬레이션
npx agent-browser set media dark
```

### 5.7 네트워크 모니터링

```bash
# 요청 모니터링 시작
npx agent-browser network route "**/script/*.js"

# 요청 목록 확인
npx agent-browser network requests

# 오프라인 모드 테스트 (서비스 워커 캐시 동작 확인)
npx agent-browser set offline on
npx agent-browser open http://localhost:3456/
npx agent-browser set offline off
```

---

## 6. 디버깅 팁

### 에러 캡처 패턴

페이지 로드 시점의 에러를 캡처하려면 eval로 핸들러를 주입한 후, HTML에 임시 인라인 스크립트를 추가하거나 새로고침합니다.

```bash
# 에러 핸들러 주입 (현재 페이지에서 발생하는 에러만 캡처 가능)
npx agent-browser eval "window._errs = []; window.onerror = (m,s,l) => { window._errs.push(m+' @ '+s+':'+l); }; 'ok'"

# 이후 발생한 에러 확인
npx agent-browser eval "window._errs?.join(' ||| ') || 'none'"
```

> 주의: `window.onerror`는 페이지 새로고침 시 초기화됩니다. 부트스트랩 시점 에러를 캡처하려면 `index.html`의 `<head>`에 임시 인라인 스크립트를 추가하세요.

### 파일 서빙 확인

서비스 워커 캐시로 인해 오래된 파일이 제공될 수 있습니다.

```bash
# 서빙되는 파일이 디스크와 동일한지 확인
npx agent-browser eval "fetch('/script/main.js').then(r => r.text()).then(t => 'length: ' + t.length)"
```

### 브라우저 종료

```bash
npx agent-browser close
```

---

## 7. 전체 명령어 요약

| 카테고리 | 명령어 | 설명 |
|---------|--------|------|
| **탐색** | `open <url>` | 페이지 이동 |
| | `close` | 브라우저 종료 |
| **캡처** | `screenshot [path]` | 스크린샷 (`--full`, `--annotate`) |
| | `snapshot` | 접근성 트리 출력 |
| | `pdf <path>` | PDF 내보내기 |
| **클릭** | `click <selector>` | 클릭 (`--new-tab`) |
| | `dblclick <selector>` | 더블 클릭 |
| **입력** | `fill <sel> <text>` | 비우고 입력 |
| | `type <sel> <text>` | 타이핑 |
| | `press <key>` | 키 입력 (Enter, Tab 등) |
| | `select <sel> <val>` | 드롭다운 선택 |
| | `check / uncheck` | 체크박스 토글 |
| **조회** | `get text/html/value/attr/title/url/count/box/styles` | 요소 정보 |
| | `is visible/enabled/checked` | 상태 확인 |
| **검색** | `find role/text/label/placeholder/alt/title/testid` | 시맨틱 요소 검색 |
| **대기** | `wait <sel>`, `wait <ms>`, `wait --text/--url/--load/--fn` | 조건 대기 |
| **JS** | `eval <code>` | JavaScript 실행 |
| **스크롤** | `scroll up/down/left/right [px]` | 스크롤 |
| | `scrollintoview <sel>` | 요소로 스크롤 |
| **탭** | `tab`, `tab new`, `tab <n>`, `tab close` | 탭 관리 |
| **저장소** | `storage local/session [key]` | 브라우저 저장소 |
| | `cookies`, `cookies set/clear` | 쿠키 관리 |
| **네트워크** | `network route/unroute/requests` | 네트워크 모니터링 |
| **비교** | `diff snapshot/screenshot/url` | 스냅샷/스크린샷 비교 |
| **디버그** | `console`, `errors` | 콘솔/에러 로그 |
| | `trace start/stop` | 트레이스 기록 |
| | `highlight <sel>` | 요소 하이라이트 |
| **설정** | `set viewport/device/geo/offline/headers/media` | 브라우저 설정 |
| **상태** | `state save/load/list/clear` | 인증 상태 저장/복원 |

---

## 8. LucidLLM 전용 테스트 패턴 및 트러블슈팅

### 8.1 모델 다운로드 및 선택 시 주의사항

*   **정확한 파일명 매칭**: 모델 ID가 접두사로 겹치는 경우(예: `SmolLM2-135M` vs `SmolLM2-135M-Instruct`) 오동작을 방지하기 위해 `data-file-name` 속성과 정규식 앵커(`^`, `$`)를 사용하여 정확하게 매칭해야 합니다.
*   **SmolLM2 WebGPU 테스트 모델 선택**: `HuggingFaceTB/SmolLM2-135M-Instruct` 를 WebGPU로 검증할 때 **`Q4`와 `Q4F16`을 절대 혼동하지 마세요.** `Q4F16`은 F16 미지원 환경에서 동작하지 않으므로, 반드시 **순수 `Q4`** 를 사용해야 합니다.
*   **Headed 모드 필수**: WebGPU 자체를 검증하는 시나리오는 `npx agent-browser --headed open ...` 으로 시작해야 합니다. headless는 CPU/WASM 전용 테스트에만 사용하세요.
*   **다운로드 버튼 클릭**: 양자화 선택 후 반드시 '다운로드' 버튼(`#download-start-btn`)을 클릭해야 다운로드 패널이 데이터로 채워지기 시작합니다. 그 전에는 `wait` 조건이 타임아웃될 수 있습니다.
*   **패널 스크롤**: 다운로드 패널이 뷰포트 밖에 있을 수 있으므로 `scrollIntoView("#download-menu-panel")`을 활용하세요.

### 8.2 vDOM 마이그레이션 관련 팁

*   **지연 마운트**: 설정 패널 등 `<template>` 내부에 있는 요소들은 패널이 열리기 전에는 DOM에 존재하지 않습니다. `openSettings()` 호출 후 `wait`를 통해 요소 출현을 기다려야 합니다.
*   **초기화 순서**: `ensureLlmGenerationControls()`나 `renderDriveBackupUi()` 같은 렌더링 함수는 반드시 `cacheSettingsElements()`가 호출되어 `els` 객체가 최신화된 후에 실행되어야 합니다.

### 8.3 주요 테스트 전용 ID

E2E 테스트의 안정성을 위해 다음 ID들이 추가되었습니다:
*   `#download-model-id`: 다운로드 패널에 표시되는 모델 ID `span`
*   `#download-file-name`: 다운로드 패널에 표시되는 타켓 파일명 `span`

### 8.4 "active session restored timed out" 해결 방법

이 에러는 보통 페이지 로드 시(Bootstrap) 발생하는 자바스크립트 에러로 인해 앱이 정상적으로 초기화되지 않았을 때 발생합니다.
1.  `npx agent-browser console` 명령으로 콘솔 로그를 확인하세요.
2.  `ReferenceError` (예: `onMaxOutputTokensChange is not defined`)나 `TypeError` (잘못된 `I18N_KEYS` 참조 등)가 있는지 확인하고 수정하세요.
3.  부트스트랩 시점의 에러는 `index.html`에 인라인 스크립트를 임시로 넣어 디버깅하는 것이 가장 빠릅니다.

### 8.5 알려진 이슈 및 해결 방법

*   **MatMul dimension mismatch (WASM)**: `SmolLM2-135M-Instruct Q4` 모델 등을 WASM 백엔드로 실행할 때 발생할 수 있습니다. 이는 모델 구조와 ONNX 런타임 간의 호환성 문제일 가능성이 높으므로, 가급적 **WebGPU** 백엔드에서 테스트 하세요.
*   **지나친 필터링 (Validator Filtering)**: `Phase 3`에서 도입된 `isStrictAnswerCompliant` 로직이 소형 모델의 응답을 지나치게 공격적으로 차단할 수 있습니다. 모델이 정답을 말했음에도 "무의미한 응답"으로 처리된다면 콘솔 로그의 `[Inference] Rejecting attempt...` 메시지를 확인하고 로직을 조정하십시오.
*   **숫자 검증 실패**: "Answer with only the number" 요청 시, 밸리데이터가 "number"라는 단어 자체를 예상 결과값으로 착각하는 버그가 수정되었습니다. 이제 "4"와 같은 실제 숫자를 정상적으로 수용합니다.
*   **Qwen3-4B-Thinking: thinking 텍스트 그대로 노출** (2026-03-12 확인): `stripReasoningTrace`가 Qwen3의 실제 출력 형식을 처리하지 못합니다. 이 모델은 `<think>` **시작 태그 없이** thinking을 시작하고 `</think>` 종료 태그로 끝낸 뒤 실제 답변을 출력합니다. 현재 코드는 이 패턴을 인식하지 못해 thinking 텍스트 전체가 사용자에게 노출됩니다. `debug-qwen3-4b-e2e.md`의 BUG-1 참조.
*   **Qwen3-4B-Thinking: strict 요청(`answer with only the number`) 전부 실패** (2026-03-12 확인): thinking 텍스트가 제거되지 않은 상태로 `isStrictAnswerCompliant` 검증기에 전달되어 4번의 retry가 모두 거부됩니다. `debug-qwen3-4b-e2e.md`의 BUG-2 참조.
*   **Qwen3-4B-Thinking: 무프로필 환경 OPFS 할당량 부족** (2026-03-12 확인): agent-browser 임시 프로필의 OPFS 할당량(~1.96 GB)이 모델 크기(2.72 GB+)에 미달합니다. **반드시 `--profile` 옵션을 사용하세요.** (4.1.4 참조)
