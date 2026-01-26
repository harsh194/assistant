# Assistant - AI Desktop Application

## Project Overview

Electron-based AI assistant using Google Gemini API. Features include:
- Real-time AI conversations
- Session history management
- Customizable keybinds
- Cross-platform support (Windows, macOS, Linux)

## Tech Stack

- **Runtime**: Electron 30.x with Electron Forge
- **AI**: Google Gemini API (@google/genai)
- **UI**: Lit web components (vanilla JS, no build step)
- **Markdown**: Marked.js + Highlight.js for code rendering
- **Storage**: JSON file-based persistence

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
│   │   ├── AssistantApp.js   # Main app component
│   │   └── AppHeader.js      # Header component
│   └── views/
│       ├── MainView.js       # Main chat view
│       ├── AssistantView.js  # AI response display
│       ├── OnboardingView.js # Setup wizard
│       ├── HistoryView.js    # Session history
│       ├── CustomizeView.js  # Settings
│       └── HelpView.js       # Help/docs
└── utils/
    ├── gemini.js         # Gemini API integration
    ├── prompts.js        # AI prompt templates
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
- Sessions: Chat history

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
