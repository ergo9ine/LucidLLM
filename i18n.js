/**
 * i18n.js – LucidLLM 다국어화 모듈
 *
 * main.js에서 추출한 i18n 인프라 + HTML 정적 텍스트 키를 통합 관리합니다.
 * 이 모듈은 ES module로 동작하며, main.js에서 import하여 사용합니다.
 */

/* ─── 지원 언어 ─── */
export const SUPPORTED_LANGUAGES = ["ko", "en", "ja", "zh-CN"];

/* ─── 번역 사전 ─── */
export const I18N_MESSAGES = {
    ko: {
        // Header
        "header.model_status_waiting": "모델 로드 대기중...",
        "header.device.webgpu": "⚡ WebGPU",
        "header.device.wasm": "🧩 CPU (WASM)",
        "settings.close": "설정 닫기",
        "header.settings": "설정",
        "header.new_chat": "새 대화",

        // Chat panel
        "chat.label_lucid": "Lucid Chat",
        "chat.token_stats_default": "토큰 속도 Avg: - | Max: - | Min: -",
        "chat.mem_default": "Mem: -",
        "chat.version": "Version-Pre-AT",
        "chat.placeholder": "메시지를 입력하세요...",
        "chat.send": "보내기",
        "chat.sending": "전송 중...",
        "chat.waiting_for_model": "모델 로드 대기중입니다. 모델을 조회하거나 OPFS 세션을 로드하세요.",
        "chat.new_session_hint": "새 대화를 시작합니다. 메시지를 입력하세요.",
        "chat.meta.you": "YOU",
        "chat.meta.assistant": "ASSISTANT",
        "chat.copy": "복사",
        "chat.scroll_bottom": "최하단으로 가기",
        "chat.scroll_bottom_label": "최하단으로 이동",
        "chat.tabs_label": "대화 탭 목록",

        // Profile chip
        "profile.chip.avatar_alt": "프로필 아바타",
        "profile.chip.default_name": "YOU",

        // Settings
        "settings.title": "설정",
        "settings.menu_label": "설정 메뉴",
        "settings.tabs_label": "설정 탭",
        "settings.tab.model": "모델 관리",
        "settings.tab.llm": "LLM 설정",
        "settings.tab.profile": "프로필",
        "settings.tab.theme": "테마",
        "settings.tab.language": "언어",
        "settings.tab.backup": "백업 및 복원",
        "settings.reset_tab": "기본값으로 복원",
        "settings.reset.confirm": "{tab} 설정을 기본값으로 복원할까요?",
        "settings.reset.done": "{tab} 설정이 기본값으로 복원되었습니다.",
        "settings.reset.undo": "되돌리기",
        "settings.reset.undone": "{tab} 설정 복원을 되돌렸습니다.",
        "settings.panel.model_label": "모델 관리 설정",
        "settings.panel.llm_label": "LLM 설정",
        "settings.panel.profile_label": "프로필 설정",
        "settings.panel.theme_label": "테마 설정",
        "settings.panel.language_label": "언어 설정",
        "settings.panel.backup_label": "백업 및 복원 설정",

        // OPFS Explorer
        "opfs.title": "OPFS Explorer",
        "opfs.usage_loading": "용량 정보를 계산하는 중...",
        "opfs.btn_up": "상위",
        "opfs.btn_models": "/models",
        "opfs.btn_refresh": "새로고침",
        "opfs.folder_tree": "폴더 트리",
        "opfs.folder_tree_loading": "폴더 트리를 불러오는 중입니다...",
        "opfs.file_list": "파일 목록",
        "opfs.upload_status_idle": "대기",
        "opfs.th_name": "이름",
        "opfs.th_size": "크기",
        "opfs.th_modified": "수정일",
        "opfs.th_path": "경로",
        "opfs.dir_loading": "OPFS 디렉터리 목록을 불러오는 중입니다...",
        "opfs.status_selection": "선택: 0개",
        "opfs.status_size": "선택 크기: 0 B",
        "opfs.status_total": "현재 폴더: 0개 / 0 B",
        "opfs.btn_create_dir": "폴더 생성",
        "opfs.btn_create_file": "파일 생성",
        "opfs.btn_upload": "업로드",
        "opfs.selected_none": "선택된 항목 없음",
        "opfs.btn_rename": "이름 변경",
        "opfs.btn_move": "이동",
        "opfs.btn_delete": "삭제",
        "opfs.ctx_path": "현재 경로",
        "opfs.ctx_create_dir": "새 폴더",
        "opfs.ctx_create_file": "새 파일",
        "opfs.ctx_upload": "업로드",
        "opfs.ctx_rename": "이름 변경",
        "opfs.ctx_move": "이동",
        "opfs.ctx_delete": "삭제",

        // Model session
        "model.session.title": "모델 세션 목록 (OPFS 통합 관리)",
        "model.session.scanning": "모델 캐시를 스캔하는 중입니다...",
        "model.input_placeholder": "업로더/모델명 형식 예: lightonai/LateOn-Code-edge",
        "model.fetch_btn": "조회",
        "model.loading_info": "모델 정보를 조회하는 중입니다...",
        "model.download.title": "모델 다운로드",
        "model.download.status_idle": "대기",
        "model.download.target_model": "대상 모델:",
        "model.download.target_file": "대상 파일:",
        "model.download.quant_label": "양자화 레벨",
        "model.download.quant_none": "선택 가능한 ONNX 파일 없음",
        "model.download.btn_download": "다운로드",
        "model.download.btn_pause": "일시 중단",
        "model.download.btn_resume": "재개",
        "model.download.progress": "진행률:",
        "model.download.speed": "속도:",
        "model.download.eta": "남은 시간:",
        "model.download.retry": "재시도:",
        "model.download.bytes": "수신 바이트:",
        "model.download.bytes_default": "0 B / -",
        "model.download.status_text": "모델 조회 후 다운로드 메뉴가 자동 활성화됩니다.",
        "model.btn_refresh": "모델 목록 새로고침",
        "model.th_filename": "파일명",
        "model.th_model_id": "모델 ID",
        "model.th_quant": "양자화",
        "model.th_version": "버전",
        "model.th_size": "크기",
        "model.th_modified": "최종 수정",
        "model.th_download": "다운로드",
        "model.th_activate": "활성화",
        "model.th_actions": "동작",
        "model.table_loading": "OPFS 모델 목록을 불러오는 중입니다...",

        // LLM settings
        "llm.system_prompt.title": "시스템 프롬프트 에디터",
        "llm.system_prompt_placeholder": "assistant 기본 동작을 정의하세요. (최대 20줄)",
        "llm.line_count": "라인 수: 0",
        "llm.tokens.title": "생성 토큰 / 컨텍스트",
        "llm.max_tokens": "최대 생성 토큰",
        "llm.context_window": "컨텍스트 윈도우 크기",
        "llm.token_settings": "토큰 설정",
        "llm.hf_token_placeholder": "Hugging Face Access Token (선택)",
        "llm.btn_save_token": "토큰 저장",
        "llm.btn_clear_token": "토큰 삭제",
        "llm.validation_hint": "변경 사항을 검토한 뒤 저장 버튼을 눌러 적용하세요.",
        "llm.btn_save": "저장",
        "llm.generation.title": "생성 파라미터",
        "llm.generation.temperature": "temperature",
        "llm.generation.top_p": "top_p",
        "llm.generation.presence_penalty": "presence_penalty",

        // Profile
        "profile.title": "프로필",
        "profile.upload": "대표 이미지 업로드",
        "profile.remove": "이미지 제거",
        "profile.nickname": "닉네임",
        "profile.nickname_placeholder": "닉네임을 입력하세요 (2~24자)",
        "profile.realtime_hint": "프로필은 입력 즉시 저장됩니다.",
        "profile.saved": "프로필이 저장되었습니다.",
        "profile.avatar_updated": "대표 이미지가 저장되었습니다.",
        "profile.avatar_cleared": "대표 이미지가 제거되었습니다.",
        "profile.avatar_invalid": "이미지 파일만 업로드할 수 있습니다.",
        "profile.avatar_too_large": "이미지 파일은 5MB 이하만 지원됩니다.",
        "profile.nickname_invalid": "닉네임은 2~24자, 영문/숫자/한글/_/- 만 사용할 수 있습니다.",
        "profile.nickname_duplicate": "이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.",
        "profile.preview_alt": "프로필 미리보기",

        // Theme
        "theme.title": "테마",
        "theme.dark": "Dark",
        "theme.light": "Light",
        "theme.oled": "OLED Black",
        "theme.applied": "테마가 적용되었습니다.",
        "theme.hint": "테마 변경 사항은 즉시 적용되며 자동 저장됩니다.",
        "theme.oled_tip": "OLED Black: 배터리 절약을 위해 순수 검정을 유지합니다.",

        // Language
        "language.title": "언어",
        "language.label": "표시 언어",
        "language.applied": "언어 설정이 적용되었습니다.",
        "language.hint": "언어 변경 시 UI와 모델 응답 언어가 즉시 전환됩니다.",
        "language.korean": "한국어",
        "language.english": "English",
        "language.japanese": "日本語",
        "language.chinese_simplified": "简体中文",

        // Backup & Restore
        "backup.gdrive.title": "Google Drive 백업 연결",
        "backup.gdrive.client_id_link": "Client ID 발급받기 →",
        "backup.gdrive.client_id_placeholder": "Google OAuth Client ID 입력",
        "backup.gdrive.btn_save": "저장",
        "backup.gdrive.btn_connect": "Google Drive 연결",
        "backup.gdrive.btn_disconnect": "연결 해제",
        "backup.gdrive.status_disconnected": "미연결",
        "backup.gdrive.last_sync": "마지막 동기화: -",
        "backup.gdrive.auto_label": "자동 백업 활성화 (변경 시 자동 업로드)",
        "backup.gdrive.btn_backup_now": "지금 백업",
        "backup.gdrive.btn_refresh_files": "파일 목록 새로고침",
        "backup.gdrive.progress": "진행률:",
        "backup.gdrive.progress_status": "대기",
        "backup.restore.title": "백업 복원",
        "backup.restore.snapshot_label": "Drive 백업 스냅샷",
        "backup.restore.overwrite_label": "현재 대화 목록 덮어쓰기",
        "backup.restore.btn_restore": "선택 백업 복원",
        "backup.restore.file_count": "백업 파일 0개",

        // Model card
        "model_card.title": "모델 카드",
        "model_card.close_label": "모델 카드 닫기",
        "model_card.selected": "선택된 모델",
        "model_card.uploader": "업로더",
        "model_card.task": "태스크",
        "model_card.downloads": "다운로드",
        "model_card.license": "라이선스",
        "model_card.likes": "좋아요",
        "model_card.updated": "최종 업데이트",
        "model_card.tags": "태그",
        "model_card.description": "설명",

        // Dialogs
        "dialog.switch.title": "모델 전환 확인",
        "dialog.switch.message": "현재 모델을 언로드하고 새 모델을 로드하시겠습니까?",
        "dialog.switch.cancel": "아니오",
        "dialog.switch.confirm": "예",
        "dialog.delete.title": "항목 삭제",
        "dialog.delete.message": "정말로 이 항목을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
        "dialog.delete.cancel": "취소",
        "dialog.delete.confirm": "삭제",
        "dialog.error.title": "오류",
        "dialog.error.message": "삭제할 수 없습니다. 페이지 새로고침 후 다시 시도하세요.",
        "dialog.error.close": "닫기",

        // Status / token / model status
        "status.model.waiting": "모델 로드 대기중...",
        "status.model.loading": "{model} 로딩 중...",
        "status.model.loaded": "{model} 작동 중",
        "status.model.failed": "{model} 로드 실패",
        "token.stats": "토큰 속도 Avg: {avg} tok/s | Max: {max} | Min: {min}",

        // Sidebar
        "sidebar.title": "워크스페이스",
        "sidebar.panel.chat": "대화",
        "sidebar.panel.workspace": "모델/환경",
        "sidebar.panel.preferences": "환경",
        "sidebar.action.new_chat": "새 대화",
        "sidebar.action.delete_chat": "대화 삭제",
        "sidebar.action.export_chat": "내보내기",
        "sidebar.action.open_settings": "설정 열기",
        "sidebar.action.open_model": "모델 관리",
        "sidebar.action.open_theme": "테마 설정",
        "sidebar.action.open_language": "언어 설정",
        "sidebar.mobile_toggle": "메뉴 열기/닫기",
        "sidebar.mobile_toggle_open": "메뉴 열기",
        "sidebar.mobile_toggle_close": "메뉴 닫기",
        "sidebar.shortcut.new": "새 대화 단축키: Ctrl+Shift+N",
        "sidebar.shortcut.delete": "대화 삭제 단축키: Ctrl+Shift+Backspace",
        "sidebar.shortcut.export": "대화 내보내기 단축키: Ctrl+Shift+E",
        "sidebar.shortcut.toggle": "사이드바 토글 단축키: Ctrl+B",
        "chat.delete.confirm": "현재 대화를 삭제할까요?",
        "chat.deleted": "현재 대화를 삭제했습니다.",
        "chat.exported": "현재 대화를 JSON으로 내보냈습니다.",
        "chat.export.empty": "내보낼 대화가 없습니다.",

        // Inference
        "inference.device.webgpu": "WebGPU",
        "inference.device.wasm": "WASM",
        "inference.toggle.current_next": "현재 {current} {currentEmoji} · 클릭하면 {next} {nextEmoji}",
        "inference.toggle.unsupported": "현재 {current} {currentEmoji} · WebGPU 미지원 환경",
        "inference.toggle.switched": "추론 백엔드를 {device}로 변경했습니다.",
        "inference.toggle.webgpu_unavailable": "이 브라우저는 WebGPU를 지원하지 않아 WASM만 사용합니다.",
        "inference.toggle.webgpu_fallback": "WebGPU 미지원으로 {device} 백엔드를 사용합니다.",
        "inference.toggle.reloading": "활성 모델을 {device}로 다시 로드합니다...",
        "inference.toggle.reload_done": "활성 모델이 {device}로 다시 로드되었습니다.",
        "inference.toggle.reload_failed": "백엔드 전환은 저장됐지만 활성 모델 재로드에 실패했습니다.",
        "inference.chat.toggle.on": "추론 켜기",
        "inference.chat.toggle.off": "추론 끄기",
        "inference.chat.disabled_notice": "추론이 비활성화되어 inference=false로 요청합니다.",

        // Model audit / auto-load
        "model.audit.run": "모델 품질 점검 실행",
        "model.audit.running": "모델 점검 실행 중...",
        "model.audit.done": "모델 점검 완료",
        "model.audit.failed": "모델 점검 실패: {message}",
        "model.auto_load.title": "모델 자동 로드",
        "model.auto_load.label": "시작 시 마지막 로드 모델 자동 활성화",
        "model.auto_load.hint": "비활성화하면 앱 시작 시 모델을 자동으로 불러오지 않습니다.",

        // Delete operations
        "delete.deleting": "삭제 중...",
        "delete.done": "삭제 완료: {target}",
        "delete.failed": "삭제 실패: {message}",
        "delete.invalid_path": "삭제 대상 경로가 올바르지 않습니다.",
        "model.loading_warning": "모델 {model}이(가) 로딩 중입니다. 삭제하기 전에 로딩이 완료될 때까지 기다리거나 페이지를 새로고침하세요.",

        // Prompt language guard
        "prompt.language_guard.ko": "모든 답변은 한국어로 작성하세요.",
        "prompt.language_guard.en": "Respond in English only.",
    },
    en: {
        // Header
        "header.model_status_waiting": "Waiting for model load...",
        "header.device.webgpu": "⚡ WebGPU",
        "header.device.wasm": "🧩 CPU (WASM)",
        "settings.close": "Close Settings",
        "header.settings": "Settings",
        "header.new_chat": "New Chat",

        // Chat panel
        "chat.label_lucid": "Lucid Chat",
        "chat.token_stats_default": "Token Speed Avg: - | Max: - | Min: -",
        "chat.mem_default": "Mem: -",
        "chat.version": "Version-Pre-AT",
        "chat.placeholder": "Type a message...",
        "chat.send": "Send",
        "chat.sending": "Sending...",
        "chat.waiting_for_model": "Waiting for model load. Fetch or load an OPFS session first.",
        "chat.new_session_hint": "Start a new conversation by entering a message.",
        "chat.meta.you": "YOU",
        "chat.meta.assistant": "ASSISTANT",
        "chat.copy": "Copy",
        "chat.scroll_bottom": "Go to bottom",
        "chat.scroll_bottom_label": "Scroll to bottom",
        "chat.tabs_label": "Chat tabs list",

        // Profile chip
        "profile.chip.avatar_alt": "Profile avatar",
        "profile.chip.default_name": "YOU",

        // Settings
        "settings.title": "Settings",
        "settings.menu_label": "Settings menu",
        "settings.tabs_label": "Settings tabs",
        "settings.tab.model": "Model",
        "settings.tab.llm": "LLM",
        "settings.tab.profile": "Profile",
        "settings.tab.theme": "Theme",
        "settings.tab.language": "Language",
        "settings.tab.backup": "Backup & Restore",
        "settings.reset_tab": "Reset to Defaults",
        "settings.reset.confirm": "Restore default settings for {tab}?",
        "settings.reset.done": "{tab} settings were reset to defaults.",
        "settings.reset.undo": "Undo",
        "settings.reset.undone": "Reverted reset for {tab}.",
        "settings.panel.model_label": "Model management settings",
        "settings.panel.llm_label": "LLM settings",
        "settings.panel.profile_label": "Profile settings",
        "settings.panel.theme_label": "Theme settings",
        "settings.panel.language_label": "Language settings",
        "settings.panel.backup_label": "Backup & Restore settings",

        // OPFS Explorer
        "opfs.title": "OPFS Explorer",
        "opfs.usage_loading": "Calculating storage...",
        "opfs.btn_up": "Up",
        "opfs.btn_models": "/models",
        "opfs.btn_refresh": "Refresh",
        "opfs.folder_tree": "Folder Tree",
        "opfs.folder_tree_loading": "Loading folder tree...",
        "opfs.file_list": "File List",
        "opfs.upload_status_idle": "Idle",
        "opfs.th_name": "Name",
        "opfs.th_size": "Size",
        "opfs.th_modified": "Modified",
        "opfs.th_path": "Path",
        "opfs.dir_loading": "Loading OPFS directory...",
        "opfs.status_selection": "Selected: 0",
        "opfs.status_size": "Size: 0 B",
        "opfs.status_total": "Current folder: 0 / 0 B",
        "opfs.btn_create_dir": "Create Folder",
        "opfs.btn_create_file": "Create File",
        "opfs.btn_upload": "Upload",
        "opfs.selected_none": "No selection",
        "opfs.btn_rename": "Rename",
        "opfs.btn_move": "Move",
        "opfs.btn_delete": "Delete",
        "opfs.ctx_path": "Current path",
        "opfs.ctx_create_dir": "New Folder",
        "opfs.ctx_create_file": "New File",
        "opfs.ctx_upload": "Upload",
        "opfs.ctx_rename": "Rename",
        "opfs.ctx_move": "Move",
        "opfs.ctx_delete": "Delete",

        // Model session
        "model.session.title": "Model Sessions (OPFS Unified)",
        "model.session.scanning": "Scanning model cache...",
        "model.input_placeholder": "org/model e.g. lightonai/LateOn-Code-edge",
        "model.fetch_btn": "Fetch",
        "model.loading_info": "Fetching model info...",
        "model.download.title": "Model Download",
        "model.download.status_idle": "Idle",
        "model.download.target_model": "Target Model:",
        "model.download.target_file": "Target File:",
        "model.download.quant_label": "Quantization",
        "model.download.quant_none": "No ONNX files available",
        "model.download.btn_download": "Download",
        "model.download.btn_pause": "Pause",
        "model.download.btn_resume": "Resume",
        "model.download.progress": "Progress:",
        "model.download.speed": "Speed:",
        "model.download.eta": "Remaining:",
        "model.download.retry": "Retries:",
        "model.download.bytes": "Received:",
        "model.download.bytes_default": "0 B / -",
        "model.download.status_text": "Download menu activates after model fetch.",
        "model.btn_refresh": "Refresh Model List",
        "model.th_filename": "Filename",
        "model.th_model_id": "Model ID",
        "model.th_quant": "Quant",
        "model.th_version": "Version",
        "model.th_size": "Size",
        "model.th_modified": "Modified",
        "model.th_download": "Download",
        "model.th_activate": "Activate",
        "model.th_actions": "Actions",
        "model.table_loading": "Loading OPFS model list...",

        // LLM settings
        "llm.system_prompt.title": "System Prompt Editor",
        "llm.system_prompt_placeholder": "Define assistant behavior. (max 20 lines)",
        "llm.line_count": "Lines: 0",
        "llm.tokens.title": "Generation Tokens / Context",
        "llm.max_tokens": "Max Output Tokens",
        "llm.context_window": "Context Window Size",
        "llm.token_settings": "Token Settings",
        "llm.hf_token_placeholder": "Hugging Face Access Token (optional)",
        "llm.btn_save_token": "Save Token",
        "llm.btn_clear_token": "Clear Token",
        "llm.validation_hint": "Review changes and click Save to apply.",
        "llm.btn_save": "Save",
        "llm.generation.title": "Generation Parameters",
        "llm.generation.temperature": "temperature",
        "llm.generation.top_p": "top_p",
        "llm.generation.presence_penalty": "presence_penalty",

        // Profile
        "profile.title": "Profile",
        "profile.upload": "Upload Avatar",
        "profile.remove": "Remove Avatar",
        "profile.nickname": "Nickname",
        "profile.nickname_placeholder": "Enter nickname (2-24 chars)",
        "profile.realtime_hint": "Profile changes are saved instantly.",
        "profile.saved": "Profile saved.",
        "profile.avatar_updated": "Avatar saved.",
        "profile.avatar_cleared": "Avatar removed.",
        "profile.avatar_invalid": "Only image files are allowed.",
        "profile.avatar_too_large": "Image must be 5MB or smaller.",
        "profile.nickname_invalid": "Nickname must be 2-24 chars and use letters/numbers/Korean/_/- only.",
        "profile.nickname_duplicate": "Nickname is already in use. Choose another one.",
        "profile.preview_alt": "Profile preview",

        // Theme
        "theme.title": "Theme",
        "theme.dark": "Dark",
        "theme.light": "Light",
        "theme.oled": "OLED Black",
        "theme.applied": "Theme applied.",
        "theme.hint": "Theme changes are applied instantly and auto-saved.",
        "theme.oled_tip": "OLED Black: pure black UI for battery savings on OLED displays.",

        // Language
        "language.title": "Language",
        "language.label": "Display Language",
        "language.applied": "Language applied.",
        "language.hint": "Switching language updates UI and model response language immediately.",
        "language.korean": "Korean",
        "language.english": "English",
        "language.japanese": "Japanese",
        "language.chinese_simplified": "Simplified Chinese",

        // Backup & Restore
        "backup.gdrive.title": "Google Drive Backup",
        "backup.gdrive.client_id_link": "Get Client ID →",
        "backup.gdrive.client_id_placeholder": "Google OAuth Client ID",
        "backup.gdrive.btn_save": "Save",
        "backup.gdrive.btn_connect": "Connect Google Drive",
        "backup.gdrive.btn_disconnect": "Disconnect",
        "backup.gdrive.status_disconnected": "Disconnected",
        "backup.gdrive.last_sync": "Last sync: -",
        "backup.gdrive.auto_label": "Auto backup on change",
        "backup.gdrive.btn_backup_now": "Backup Now",
        "backup.gdrive.btn_refresh_files": "Refresh File List",
        "backup.gdrive.progress": "Progress:",
        "backup.gdrive.progress_status": "Idle",
        "backup.restore.title": "Restore Backup",
        "backup.restore.snapshot_label": "Drive Backup Snapshot",
        "backup.restore.overwrite_label": "Overwrite current chat list",
        "backup.restore.btn_restore": "Restore Selected Backup",
        "backup.restore.file_count": "0 backup files",

        // Model card
        "model_card.title": "Model Card",
        "model_card.close_label": "Close Model Card",
        "model_card.selected": "Selected Model",
        "model_card.uploader": "Uploader",
        "model_card.task": "Task",
        "model_card.downloads": "Downloads",
        "model_card.license": "License",
        "model_card.likes": "Likes",
        "model_card.updated": "Last Updated",
        "model_card.tags": "Tags",
        "model_card.description": "Description",

        // Dialogs
        "dialog.switch.title": "Confirm Model Switch",
        "dialog.switch.message": "Unload current model and load a new one?",
        "dialog.switch.cancel": "No",
        "dialog.switch.confirm": "Yes",
        "dialog.delete.title": "Delete Item",
        "dialog.delete.message": "Permanently delete this item? This cannot be undone.",
        "dialog.delete.cancel": "Cancel",
        "dialog.delete.confirm": "Delete",
        "dialog.error.title": "Error",
        "dialog.error.message": "Unable to delete. Refresh the page and try again.",
        "dialog.error.close": "Close",

        // Status / token / model status
        "status.model.waiting": "Waiting for model load...",
        "status.model.loading": "{model} loading...",
        "status.model.loaded": "{model} active",
        "status.model.failed": "{model} failed to load",
        "token.stats": "Token Speed Avg: {avg} tok/s | Max: {max} | Min: {min}",

        // Sidebar
        "sidebar.title": "Workspace",
        "sidebar.panel.chat": "Chats",
        "sidebar.panel.workspace": "Model/Prefs",
        "sidebar.panel.preferences": "Prefs",
        "sidebar.action.new_chat": "New Chat",
        "sidebar.action.delete_chat": "Delete Chat",
        "sidebar.action.export_chat": "Export",
        "sidebar.action.open_settings": "Open Settings",
        "sidebar.action.open_model": "Model Panel",
        "sidebar.action.open_theme": "Theme",
        "sidebar.action.open_language": "Language",
        "sidebar.mobile_toggle": "Toggle menu",
        "sidebar.mobile_toggle_open": "Open menu",
        "sidebar.mobile_toggle_close": "Close menu",
        "sidebar.shortcut.new": "Shortcut: Ctrl+Shift+N",
        "sidebar.shortcut.delete": "Shortcut: Ctrl+Shift+Backspace",
        "sidebar.shortcut.export": "Shortcut: Ctrl+Shift+E",
        "sidebar.shortcut.toggle": "Shortcut: Ctrl+B",
        "chat.delete.confirm": "Delete the current chat?",
        "chat.deleted": "Current chat deleted.",
        "chat.exported": "Current chat exported as JSON.",
        "chat.export.empty": "No chat to export.",

        // Inference
        "inference.device.webgpu": "WebGPU",
        "inference.device.wasm": "WASM",
        "inference.toggle.current_next": "Current {current} {currentEmoji} · click for {next} {nextEmoji}",
        "inference.toggle.unsupported": "Current {current} {currentEmoji} · WebGPU unavailable",
        "inference.toggle.switched": "Inference backend switched to {device}.",
        "inference.toggle.webgpu_unavailable": "This browser does not support WebGPU, using WASM only.",
        "inference.toggle.webgpu_fallback": "WebGPU unavailable, using {device} backend.",
        "inference.toggle.reloading": "Reloading active model with {device}...",
        "inference.toggle.reload_done": "Active model reloaded with {device}.",
        "inference.toggle.reload_failed": "Backend preference saved, but active model reload failed.",
        "inference.chat.toggle.on": "Inference on",
        "inference.chat.toggle.off": "Inference off",
        "inference.chat.disabled_notice": "Inference is disabled. Requesting with inference=false.",

        // Model audit / auto-load
        "model.audit.run": "Run Model Quality Audit",
        "model.audit.running": "Running model audit...",
        "model.audit.done": "Model audit completed",
        "model.audit.failed": "Model audit failed: {message}",
        "model.auto_load.title": "Model Auto Load",
        "model.auto_load.label": "Auto-load last model at startup",
        "model.auto_load.hint": "When disabled, startup will not auto-load the last OPFS model session.",

        // Delete operations
        "delete.deleting": "Deleting...",
        "delete.done": "Deleted: {target}",
        "delete.failed": "Failed to delete: {message}",
        "delete.invalid_path": "Invalid delete target path.",
        "model.loading_warning": "Model {model} is currently loading. Please wait or refresh before deleting.",

        // Prompt language guard
        "prompt.language_guard.ko": "모든 답변은 한국어로 작성하세요.",
        "prompt.language_guard.en": "Respond in English only.",
    },
};

/* ja / zh-CN: en을 기본값으로 사용하되 언어 이름만 오버라이드 */
I18N_MESSAGES.ja = {
    ...I18N_MESSAGES.en,
    "language.korean": "Korean",
    "language.english": "English",
    "language.japanese": "日本語",
    "language.chinese_simplified": "简体中文",
};
I18N_MESSAGES["zh-CN"] = {
    ...I18N_MESSAGES.en,
    "language.korean": "韩语",
    "language.english": "英语",
    "language.japanese": "日语",
    "language.chinese_simplified": "简体中文",
};

/* ─── 언어 유틸 ─── */

export function matchSupportedLanguage(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";

    const normalized = raw.replace(/_/g, "-");
    const lower = normalized.toLowerCase();

    if (lower === "ko" || lower.startsWith("ko-")) return "ko";
    if (lower === "en" || lower.startsWith("en-")) return "en";
    if (lower === "ja" || lower.startsWith("ja-")) return "ja";
    if (
        lower === "zh-cn"
        || lower.startsWith("zh-cn")
        || lower.startsWith("zh-hans-cn")
        || lower.startsWith("zh-hans")
    ) {
        return "zh-CN";
    }

    for (const supported of SUPPORTED_LANGUAGES) {
        if (lower === String(supported).toLowerCase()) {
            return supported;
        }
    }
    return "";
}

export function normalizeLanguage(value) {
    return matchSupportedLanguage(value) || "en";
}

export function detectNavigatorLanguage() {
    const candidates = [];
    if (typeof navigator !== "undefined" && navigator) {
        if (Array.isArray(navigator.languages)) {
            candidates.push(...navigator.languages);
        }
        if (typeof navigator.language === "string" && navigator.language.trim()) {
            candidates.push(navigator.language);
        }
    }

    for (const candidate of candidates) {
        const matched = matchSupportedLanguage(candidate);
        if (matched) {
            return matched;
        }
    }
    return "en";
}

/* ─── 현재 언어 상태 (외부에서 설정 가능) ─── */
let _currentLanguage = "en";

export function setCurrentLanguage(lang) {
    _currentLanguage = normalizeLanguage(lang);
}

export function getCurrentLanguage() {
    return _currentLanguage;
}

/* ─── 번역 함수 ─── */

export function t(key, vars = {}, fallback = "") {
    const lang = _currentLanguage;
    const dict = I18N_MESSAGES[lang] || I18N_MESSAGES.en || I18N_MESSAGES.ko || {};
    const template = dict[key]
        || (I18N_MESSAGES.en && I18N_MESSAGES.en[key])
        || (I18N_MESSAGES.ko && I18N_MESSAGES.ko[key])
        || fallback
        || key;
    return String(template).replace(/\{(\w+)\}/g, (_match, token) => {
        if (Object.prototype.hasOwnProperty.call(vars, token)) {
            return String(vars[token]);
        }
        return "";
    });
}

/* ─── data-i18n 자동 적용 ─── */

/**
 * DOM 내 모든 data-i18n, data-i18n-placeholder, data-i18n-title,
 * data-i18n-aria-label, data-i18n-alt 속성을 갖는 요소에 번역을 적용합니다.
 */
export function applyI18nToDOM(root = document) {
    // textContent
    for (const el of root.querySelectorAll("[data-i18n]")) {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
    }
    // placeholder
    for (const el of root.querySelectorAll("[data-i18n-placeholder]")) {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key) el.placeholder = t(key);
    }
    // title
    for (const el of root.querySelectorAll("[data-i18n-title]")) {
        const key = el.getAttribute("data-i18n-title");
        if (key) el.setAttribute("title", t(key));
    }
    // aria-label
    for (const el of root.querySelectorAll("[data-i18n-aria-label]")) {
        const key = el.getAttribute("data-i18n-aria-label");
        if (key) el.setAttribute("aria-label", t(key));
    }
    // alt
    for (const el of root.querySelectorAll("[data-i18n-alt]")) {
        const key = el.getAttribute("data-i18n-alt");
        if (key) el.setAttribute("alt", t(key));
    }
}
