# Assistant - AI Desktop Application

## Project Overview

Electron-based AI assistant using Google Gemini API. Features include:
- Real-time AI conversations via native audio WebSocket streaming
- Co-Pilot mode for structured, goal-driven sessions
- RAG (Retrieval-Augmented Generation) for dynamic document context injection
- Document ingestion via Gemini API OCR with chunking and embedding
- Real-time translation of live speech between 28 languages
- Screen analysis with automated/manual screenshot capture and AI interpretation
- Model fallback with daily rate limiting (Flash -> Flash-Lite)
- Google Search integration for real-time information during sessions
- Custom AI profiles (user-created personas with custom system prompts)
- Post-session summary generation and .docx export
- Session history management
- Configurable audio modes (speaker only, mic only, both)
- Customizable keybinds
- Cross-platform support (Windows, macOS, Linux)

## Tech Stack

- **Runtime**: Electron 30.x with Electron Forge
- **AI**: Google Gemini API (@google/genai)
- **Translation**: Google Cloud Translation API (primary, ~50-100ms) with Gemini fallback (~1-3s)
- **UI**: Lit web components (vanilla JS, no build step)
- **Markdown**: Marked.js + Highlight.js for code rendering
- **Storage**: JSON file-based persistence
- **Export**: docx package for .docx document generation

## Critical Rules

### Code Organization

- Organize by feature: `components/views/`, `components/app/`, `utils/`
- Keep files under 400 lines
- Main process code in `src/index.js`
- Renderer utilities in `src/utils/`

### Code Style

- Vanilla JavaScript (no TypeScript)
- Lit web components for UI
- IPC handlers return `{ success: boolean, data?: T, error?: string }`
- No emojis in code/comments

### Security

- API keys stored via storage.js (user data directory)
- Never log sensitive data
- Validate all IPC inputs

### Testing

- Manual testing via `npm start`
- Test across platforms before release

## File Structure

```
src/
├── index.js              # Main process entry, IPC handlers
├── preload.js            # Preload script (IPC context bridge, channel allowlists)
├── storage.js            # JSON persistence layer, rate limiting, model fallback
├── audioUtils.js         # Audio PCM/WAV utilities, debug audio saving
├── components/
│   ├── index.js          # Component exports
│   ├── app/
│   │   ├── AssistantApp.js   # Main app component (state, routing, co-pilot orchestration)
│   │   └── AppHeader.js      # Header with nav and theme controls
│   ├── ui/
│   │   ├── SkeletonLoader.js # Loading skeleton with shimmer animation
│   │   ├── LoadingSpinner.js # Animated loading spinner
│   │   └── RequestStatus.js  # Status display with spinner and actions
│   └── views/
│       ├── MainView.js           # Main view (Start + Prepare + Templates)
│       ├── AssistantView.js      # AI response display with tabbed UI (Assistant/Translation/Screen)
│       ├── ScreenAnalysisView.js # Screen analysis tab (search, clear, timestamped entries with thumbnails)
│       ├── SessionPrepView.js    # Co-Pilot pre-session setup form (auto-save drafts, save as template)
│       ├── SessionSummaryView.js # Post-session summary, notes view/export
│       ├── OnboardingView.js     # Setup wizard with intro slides
│       ├── HistoryView.js        # Session history (search, filter by profile/date/co-pilot)
│       ├── CustomizeView.js      # Settings (profiles, keybinds, translation, audio config)
│       └── HelpView.js           # Help/docs
└── utils/
    ├── gemini.js         # Gemini API integration (live session + HTTP API + RAG + translation)
    ├── prompts.js        # AI prompt templates (profile-based, RAG-aware)
    ├── copilotPrompts.js # Co-Pilot context and behavioral instructions
    ├── chunker.js        # Text chunking for RAG (fixed-size overlapping chunks)
    ├── embeddings.js     # Vector embeddings via Gemini text-embedding-004 model
    ├── retrieval.js      # RAG engine (dynamic context injection during sessions)
    ├── notesParser.js    # Parse [NOTES], [REFOCUS], [ADVANCE] markers from AI
    ├── notesExporter.js  # Export session notes to .docx
    ├── documentParser.js # Document text extraction (plain text + Gemini OCR)
    ├── requestState.js   # Request lifecycle state constants (IDLE, SENDING, STREAMING, etc.)
    ├── renderer.js       # Renderer utilities, storage API wrapper, screenshot capture
    ├── window.js         # Window management, global shortcuts, lifecycle
    └── windowResize.js   # Resize handlers
```

## Key Patterns

### IPC Response Format

```javascript
{ success: boolean, data?: any, error?: string }
```

### Storage Domains

- **Config** (`config.json`): App configuration (`configVersion`, `onboarded`, `layout`)
- **Credentials** (`credentials.json`): API keys (`apiKey` for Gemini, `googleTranslationApiKey` for Google Cloud Translation)
- **Preferences** (`preferences.json`): User preferences (profile, language, audio mode, font size, transparency, translation config, screenshot settings, Google Search toggle)
- **Keybinds** (`keybinds.json`): Keyboard shortcuts
- **Limits** (`limits.json`): Daily rate limiting per model (`gemini-2.5-flash`: 20/day, `gemini-2.5-flash-lite`: 20/day)
- **Sessions** (`history/*.json`): Chat history per session (conversation, screen analysis, co-pilot prep, notes, summary)
- **CoPilotPrep** (`copilot-prep.json`): Structured session preparation data (goal, outcome, criteria, topics, documents)
- **Embeddings** (`embeddings/*.json`): Vector embeddings for RAG (one JSON file per document)
- **CustomProfiles** (`custom-profiles.json`): User-created AI profiles
- **Templates** (`templates.json`): Reusable session preparation templates

### Co-Pilot Data Flow

```
SessionPrepView -> AssistantApp.handleStartSession(prepData)
  -> renderer.initializeGemini(profile, language, copilotPrep, customProfileData)
  -> IPC 'initialize-gemini' -> gemini.initializeGeminiSession(..., copilotPrep)
  -> prompts.getSystemPrompt(..., copilotPrep, hasEmbeddings, customProfileData)
  -> copilotPrompts.buildCoPilotContext(hasEmbeddings) + buildCoPilotInstructions()
```

### RAG (Retrieval-Augmented Generation) Flow

```
Document Upload:
  copilot:open-file-dialog -> parse document -> chunkText() -> generateEmbeddings()
  -> storage.saveEmbeddings(docId, data) -> document-upload-progress events

During Session (RAG Mode):
  RetrievalEngine initialized with stored embeddings
  -> On each AI response: builds query from last 3 turns
  -> Finds top 5 relevant chunks via cosine similarity
  -> Injects as [REFERENCE CONTEXT] blocks via sendRealtimeInput()
  -> 20-second cooldown between retrievals

Fallback Mode (no embeddings):
  Full document text injected inline in system prompt
```

### Session Tab System

AssistantView uses a 3-tab UI during active sessions:

```
Tabs: [Assistant (A)] [Translation (T)] [Screen (S)]
  - Assistant tab: AI response display with markdown rendering, response navigation
  - Translation tab: Side-by-side columns (source/target language) with speaker labels
  - Screen tab: Timestamped screen analysis entries with search, clear, and thumbnails
  - Tab switching: Click, keyboard shortcuts (A/T/S), or Tab key to cycle
  - Translation tab only visible when translation is enabled
  - Screen tab shows green dot indicator when new analyses arrive while on another tab
  - Tab bar hidden when neither translation nor screen analyses exist
```

### Translation Flow

```
User enables translation in Settings (source + target language)
  -> IPC 'translation:set-config' -> gemini.setTranslationConfig()
  -> Speech language updated to match source language
  -> Optional: Configure Google Cloud Translation API key for real-time tentative translation

During Session:
  Gemini transcription -> handleTranscriptionForTranslation(text, speaker)
  -> Buffer with space separation, track first speaker per buffer
  -> Emit 'translation-live-update' { id, text, speaker } on each chunk (live caption)
  -> If Cloud Translation key configured:
     -> Debounced (150ms) Cloud Translation API call for current buffer
     -> Emit 'translation-live-update' with tentativeTranslation (dimmed/italic in right column)
  -> Buffer until sentence boundary or word threshold (8 words)
  -> On flush: emit 'translation-live-update' { flushed: true }, queue translation
  -> translateText(): Cloud Translation API first (~50-100ms), Gemini fallback (~1-3s)
  -> 'translation-result' { id, original, translated, speaker } to renderer
  -> AssistantView shows: live entry (green dot + tentative) -> pending (shimmer) -> finalized
```

### Screen Analysis Flow

```
Auto-capture (interval-based) or manual trigger
  -> renderer.captureScreenshot() -> desktopCapturer API
  -> IPC 'send-image-content' with base64 image + prompt
  -> Gemini HTTP API analyzes screenshot
  -> 'save-screen-analysis' event to renderer
  -> Routed to Screen tab only (not Assistant tab)
  -> ScreenAnalysisView renders entries with timestamp, model, response text, thumbnail
  -> Stored in session's screenAnalysisHistory
  -> Searchable and clearable within the Screen tab
```

### Model Fallback

```
storage.getAvailableModel()
  -> Check today's usage for gemini-2.5-flash (limit: 20/day)
  -> If under limit: use flash
  -> If over limit: fall back to gemini-2.5-flash-lite (limit: 20/day)
  -> If both exhausted: default to flash (for paid API users)
```

### Co-Pilot Notes Flow

- AI responses include `[NOTES]...[/NOTES]` markers
- `notesParser.parseResponse()` extracts notes and strips markers
- AssistantView accumulates notes silently (not shown during session)
- On session close, notes saved to session history
- SessionSummaryView allows View Notes and Save as .docx

### IPC Channels

**Storage:**
- `storage:get-config`, `storage:set-config`, `storage:update-config`
- `storage:get-credentials`, `storage:set-credentials`, `storage:get-api-key`, `storage:set-api-key`
- `storage:get-google-translation-key`, `storage:set-google-translation-key` - Google Cloud Translation API key
- `storage:get-preferences`, `storage:set-preferences`, `storage:update-preference`
- `storage:get-keybinds`, `storage:set-keybinds`
- `storage:get-all-sessions`, `storage:get-session`, `storage:save-session`, `storage:delete-session`, `storage:delete-all-sessions`
- `storage:get-today-limits` - Rate limiting per model
- `storage:get-copilot-prep`, `storage:set-copilot-prep`, `storage:update-copilot-prep`, `storage:clear-copilot-prep`
- `storage:get-templates`, `storage:save-template`, `storage:delete-template`
- `storage:get-custom-profiles`, `storage:save-custom-profile`, `storage:delete-custom-profile`
- `storage:clear-all`

**Gemini Session:**
- `initialize-gemini` - Start live AI session with profile, language, co-pilot prep
- `close-session` - End current session
- `get-current-session` - Check if session is active
- `start-new-session` - Start fresh session
- `cancel-current-request` - Cancel in-flight request
- `send-audio-content` - System/speaker audio (PCM)
- `send-mic-audio-content` - Microphone audio (PCM)
- `send-image-content` - Screenshot/image analysis with prompt
- `send-text-message` - Text-based queries
- `update-google-search-setting` - Enable/disable Google Search tool

**Translation:**
- `translation:set-config` - Configure source/target language and enable/disable
- `translation:get-config` - Get current translation config

**Audio (macOS):**
- `start-macos-audio` - Start system audio capture via SystemAudioDump
- `stop-macos-audio` - Stop system audio capture

**Co-Pilot:**
- `copilot:open-file-dialog` - File picker + text extraction + chunking + embedding
- `copilot:parse-document` - Parse a file at a given path
- `copilot:generate-summary` - Generate session summary via Gemini HTTP API
- `copilot:export-notes` - Export notes + summary to .docx
- `copilot:delete-document-embeddings` - Delete embeddings for a document
- `copilot:get-all-embeddings` - Get all stored embeddings

**General:**
- `get-native-theme` - Query OS dark/light mode preference
- `get-app-version` - Get Electron app version
- `quit-application` - Quit the app
- `open-external` - Open URL in default browser
- `update-keybinds` - Fire-and-forget keybind update
- `log-message` - Fire-and-forget logging

**Events (Main -> Renderer):**
- `new-response` - New AI response started
- `update-response` - AI response streaming update
- `response-complete` - AI response finished
- `request-cancelled` - Request was cancelled
- `update-status` - Session status update
- `session-initializing` - Session setup in progress
- `reconnect-failed` - Auto-reconnect exhausted
- `navigate-previous-response`, `navigate-next-response` - Response navigation
- `scroll-response-up`, `scroll-response-down` - Scroll controls
- `click-through-toggled` - Click-through mode changed
- `save-conversation-turn` - Save user-AI exchange to session
- `save-session-context` - Initialize session with profile
- `save-screen-analysis` - Save screen analysis results
- `clear-sensitive-data` - Wipe visible data (emergency erase)
- `document-upload-progress` - Progress updates during document upload (stages: parsing, embedding, done, error)
- `native-theme-changed` - OS theme changed (boolean: shouldUseDarkColors)
- `translation-result` - Translation completion (original, translated, speaker, timestamp)
- `translation-live-update` - Live transcription update for real-time caption display (id, text, speaker, flushed?, tentativeTranslation?)

**Events (Renderer -> Main):**
- `update-keybinds` - Keybind configuration changed
- `view-changed` - Navigation event
- `log-message` - Renderer-side logging

## npm Commands

- `npm start` - Run in development
- `npm run package` - Package for current platform
- `npm run make` - Create distributable

## Available Commands

Located in `.claude/commands/`:

| Command | Description |
|---------|-------------|
| `/run-dev` | Start the app in development mode |
| `/build-app` | Build distributable packages |
| `/add-ipc-channel` | Guide for adding new IPC channels |
| `/add-component` | Template for creating Lit components |

## Available Agents

Located in `.claude/agents/`:

| Agent | Purpose |
|-------|---------|
| `electron-debugger` | Debug main/renderer process issues, IPC communication |
| `gemini-api` | Gemini API integration, streaming, error handling |
| `lit-component` | Lit web component creation and optimization |
| `ipc-handler` | IPC channel design and implementation |

## Available Skills

Located in `.claude/skills/`:

| Skill | Purpose |
|-------|---------|
| `electron-patterns` | Window management, lifecycle, cross-platform |
| `lit-components` | Reactive UI components, state management |
| `gemini-integration` | AI API patterns, streaming, chat sessions |
| `storage-patterns` | JSON persistence, versioning, migration |

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Test locally before committing
