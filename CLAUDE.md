# Assistant - AI Desktop Application

## Project Overview

Electron-based AI assistant using Google Gemini API. Features include:
- Real-time AI conversations
- Co-Pilot mode for structured, goal-driven sessions
- RAG (Retrieval-Augmented Generation) for dynamic document context injection
- Document ingestion via Gemini API OCR with chunking and embedding
- Custom AI profiles (user-created personas with custom system prompts)
- Post-session summary generation and .docx export
- Session history management
- Customizable keybinds
- Cross-platform support (Windows, macOS, Linux)

## Tech Stack

- **Runtime**: Electron 30.x with Electron Forge
- **AI**: Google Gemini API (@google/genai)
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
├── index.js              # Main process entry
├── preload.js            # Preload script (IPC bridge)
├── storage.js            # JSON persistence layer
├── audioUtils.js         # Audio capture utilities
├── components/
│   ├── index.js          # Component exports
│   ├── app/
│   │   ├── AssistantApp.js   # Main app component (state, routing, co-pilot orchestration)
│   │   └── AppHeader.js      # Header component
│   ├── ui/
│   │   └── SkeletonLoader.js # Loading skeleton with shimmer animation
│   └── views/
│       ├── MainView.js           # Main view (Start + Prepare + Templates)
│       ├── AssistantView.js      # AI response display (silent notes parsing)
│       ├── SessionPrepView.js    # Co-Pilot pre-session setup form (auto-save drafts, save as template)
│       ├── SessionSummaryView.js # Post-session summary, notes view/export
│       ├── OnboardingView.js     # Setup wizard
│       ├── HistoryView.js        # Session history (search, filter by profile/date/co-pilot)
│       ├── CustomizeView.js      # Settings (includes custom profiles management)
│       └── HelpView.js           # Help/docs
└── utils/
    ├── gemini.js         # Gemini API integration (live session + HTTP API + RAG)
    ├── prompts.js        # AI prompt templates (profile-based, RAG-aware)
    ├── copilotPrompts.js # Co-Pilot context and behavioral instructions
    ├── chunker.js        # Text chunking for RAG (fixed-size overlapping chunks)
    ├── embeddings.js     # Vector embeddings via Gemini text-embedding-004 model
    ├── retrieval.js      # RAG engine (dynamic context injection during sessions)
    ├── notesParser.js    # Parse [NOTES], [REFOCUS], [ADVANCE] markers from AI
    ├── notesExporter.js  # Export session notes to .docx
    ├── documentParser.js # Document text extraction (plain text + Gemini OCR)
    ├── renderer.js       # Renderer utilities
    ├── window.js         # Window management
    └── windowResize.js   # Resize handlers
```

## Key Patterns

### IPC Response Format

```javascript
{ success: boolean, data?: any, error?: string }
```

### Storage Domains

- Config: App configuration
- Credentials: API keys
- Preferences: User preferences
- Keybinds: Keyboard shortcuts
- Sessions: Chat history (with co-pilot prep, notes, summary)
- CoPilotPrep: Structured session preparation data
- Embeddings: Vector embeddings for RAG (`embeddings/` directory, one JSON file per document)
- CustomProfiles: User-created AI profiles (`custom-profiles.json`)
- Templates: Reusable session preparation templates (`templates.json`)

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

### Co-Pilot Notes Flow

- AI responses include `[NOTES]...[/NOTES]` markers
- `notesParser.parseResponse()` extracts notes and strips markers
- AssistantView accumulates notes silently (not shown during session)
- On session close, notes saved to session history
- SessionSummaryView allows View Notes and Save as .docx

### IPC Channels

**Storage:**
- `storage:get-copilot-prep`, `storage:set-copilot-prep`, `storage:update-copilot-prep`
- `storage:get-custom-profiles` - Get all custom profiles
- `storage:save-custom-profile` - Save or update a custom profile
- `storage:delete-custom-profile` - Delete a custom profile
- `storage:get-templates` - Get all session templates
- `storage:save-template` - Save or update a template
- `storage:delete-template` - Delete a template
- `storage:clear-copilot-prep` - Reset co-pilot prep to defaults

**Co-Pilot:**
- `copilot:open-file-dialog` - File picker + text extraction + chunking + embedding
- `copilot:parse-document` - Parse a file at a given path
- `copilot:generate-summary` - Generate session summary via Gemini HTTP API
- `copilot:export-notes` - Export notes + summary to .docx
- `copilot:delete-document-embeddings` - Delete embeddings for a document
- `copilot:get-all-embeddings` - Get all stored embeddings

**Theme:**
- `get-native-theme` - Query OS dark/light mode preference

**Events (Main -> Renderer):**
- `document-upload-progress` - Progress updates during document upload (stages: parsing, embedding, done, error)
- `native-theme-changed` - OS theme changed (boolean: shouldUseDarkColors)

## Available Commands

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
