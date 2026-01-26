# Technical Documentation: AI Assistant

This document details the technical implementation of the AI Assistant, focusing on the Gemini integration, storage architecture, and IPC communication patterns.

## 1. Gemini Implementation

### 1.1. Models Used

| Task | Model | API Type | Version |
|------|-------|----------|---------|
| **Realtime Conversation** | `gemini-2.5-flash-native-audio-preview-09-2025` | Multimodal Live (WebSocket) | v1alpha |
| **Screen Analysis** | `gemini-2.5-flash` | Generative AI (HTTP) | Standard |
| **Fallback Screen Analysis** | `gemini-2.5-flash-lite` | Generative AI (HTTP) | Standard |

### 1.2. Real-time Audio Session

**File**: `src/utils/gemini.js`

#### Connection Configuration

```javascript
const session = await client.live.connect({
  model: 'gemini-2.5-flash-native-audio-preview-09-2025',
  config: {
    responseModalities: [Modality.AUDIO],
    proactivity: { proactiveAudio: true },
    outputAudioTranscription: {},
    inputAudioTranscription: {
      enableSpeakerDiarization: true,
      minSpeakerCount: 2,
      maxSpeakerCount: 2,
    },
    contextWindowCompression: { slidingWindow: {} },
    speechConfig: { languageCode: language },
    systemInstruction: { parts: [{ text: systemPrompt }] },
    tools: enabledTools
  }
})
```

#### Key Features

| Feature | Configuration | Description |
|---------|---------------|-------------|
| **Native Audio** | `responseModalities: [Modality.AUDIO]` | Model responds with speech |
| **Proactive Audio** | `proactiveAudio: true` | Model can initiate speech |
| **Speaker Diarization** | `enableSpeakerDiarization: true` | Distinguishes Interviewer vs Candidate |
| **Context Compression** | `slidingWindow: {}` | Manages long conversations |
| **Language Support** | `speechConfig.languageCode` | Configurable language (default: en-US) |

### 1.3. Audio Pipeline

#### Microphone Audio (Renderer → Main → Gemini)
```
Renderer Process                Main Process                  Gemini API
     │                               │                            │
     │──send-mic-audio-content──────>│                            │
     │   { data, mimeType }          │──sendRealtimeInput──────-->│
     │                               │   { audio: { data } }      │
```

#### System Audio (macOS only)
```
SystemAudioDump Binary          Main Process                  Gemini API
     │                               │                            │
     │──stdout (PCM 24kHz)──────────>│                            │
     │                               │──convertStereoToMono()     │
     │                               │──sendRealtimeInput──────-->│
```

**Audio Format**: 16-bit PCM at 24kHz, converted from stereo to mono

### 1.4. Session Reconnection

**Strategy**: Up to 3 reconnection attempts with 2-second delay

```javascript
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000;
```

**Context Restoration**: On reconnection, the last 20 conversation turns are sent as a text message to restore context:

```javascript
function buildContextMessage() {
  const lastTurns = conversationHistory.slice(-20);
  // Format as: "[Interviewer]: ... [Your answer]: ..."
  return `Session reconnected. Here's the conversation so far:\n\n${contextLines}\n\nContinue from here.`;
}
```

### 1.5. Screen Analysis (HTTP API)

**File**: `src/utils/gemini.js` → `sendImageToGeminiHttp()`

Uses standard HTTP API (not WebSocket) for image analysis:

```javascript
const response = await ai.models.generateContentStream({
  model: getAvailableModel(), // 'gemini-2.5-flash' or 'gemini-2.5-flash-lite'
  contents: [
    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
    { text: prompt }
  ]
})
```

### 1.6. Tool Integration

**Google Search** can be dynamically toggled via the UI:

```javascript
async function getEnabledTools() {
  const tools = [];
  const googleSearchEnabled = await getStoredSetting('googleSearchEnabled', 'true');
  if (googleSearchEnabled === 'true') {
    tools.push({ googleSearch: {} });
  }
  return tools;
}
```

## 2. Storage Architecture

**File**: `src/storage.js`

### 2.1. Directory Structure

| Platform | Config Directory |
|----------|------------------|
| Windows | `%APPDATA%\assistant-config\` |
| macOS | `~/Library/Application Support/assistant-config/` |
| Linux | `~/.config/assistant-config/` |

```
assistant-config/
├── config.json          # App configuration
├── credentials.json     # API key storage
├── preferences.json     # User preferences
├── keybinds.json        # Custom keyboard shortcuts
├── limits.json          # Rate limiting data
└── history/             # Session history
    ├── {timestamp1}.json
    ├── {timestamp2}.json
    └── ...
```

### 2.2. Configuration Files

#### config.json
```json
{
  "configVersion": 1,
  "onboarded": false,
  "layout": "normal"
}
```

#### preferences.json
```json
{
  "customPrompt": "",
  "selectedProfile": "interview",
  "selectedLanguage": "en-US",
  "selectedScreenshotInterval": "5",
  "selectedImageQuality": "medium",
  "advancedMode": false,
  "audioMode": "speaker_only",
  "fontSize": "medium",
  "backgroundTransparency": 0.8,
  "googleSearchEnabled": false,
  "windowWidth": 500,
  "windowHeight": 600
}
```

### 2.3. Rate Limiting

**Daily Limits**: 20 requests per model per day (free tier)

```javascript
function getAvailableModel() {
  const todayLimits = getTodayLimits();
  if (todayLimits.flash.count < 20) {
    return 'gemini-2.5-flash';
  } else if (todayLimits.flashLite.count < 20) {
    return 'gemini-2.5-flash-lite';
  }
  return 'gemini-2.5-flash'; // Fallback for paid users
}
```

### 2.4. Version Migration

Storage includes automatic migration when `configVersion` changes:

```javascript
const CONFIG_VERSION = 1;

function needsReset() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return !config.configVersion || config.configVersion !== CONFIG_VERSION;
}
```

## 3. IPC Communication

**Files**: `src/index.js`, `src/preload.js`

### 3.1. IPC Channels

#### Gemini Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `initialize-gemini` | invoke | Start WebSocket session |
| `send-mic-audio-content` | invoke | Stream microphone audio |
| `send-audio-content` | invoke | Stream system audio |
| `send-image-content` | invoke | Analyze screenshot |
| `send-text-message` | invoke | Send text to session |
| `close-session` | invoke | End WebSocket session |
| `start-macos-audio` | invoke | Start system audio capture |
| `stop-macos-audio` | invoke | Stop system audio capture |

#### Storage Channels
| Channel | Direction | Description |
|---------|-----------|-------------|
| `storage:get-config` | invoke | Get app config |
| `storage:set-config` | invoke | Update app config |
| `storage:get-credentials` | invoke | Get API credentials |
| `storage:set-credentials` | invoke | Update credentials |
| `storage:get-preferences` | invoke | Get user preferences |
| `storage:update-preference` | invoke | Update single preference |
| `storage:get-keybinds` | invoke | Get keybinds |
| `storage:set-keybinds` | invoke | Update keybinds |
| `storage:get-all-sessions` | invoke | Get session list |
| `storage:get-session` | invoke | Get single session |
| `storage:save-session` | invoke | Save session data |
| `storage:delete-session` | invoke | Delete session |
| `storage:delete-all-sessions` | invoke | Clear all sessions |
| `storage:get-today-limits` | invoke | Get rate limit status |

#### Event Channels (Main → Renderer)
| Channel | Description |
|---------|-------------|
| `update-status` | Status message updates |
| `new-response` | Start of new AI response |
| `update-response` | Streaming response update |
| `session-initializing` | Session init progress |
| `reconnect-failed` | Max reconnection attempts reached |
| `save-conversation-turn` | Persist conversation turn |
| `save-screen-analysis` | Persist screen analysis |

### 3.2. Response Format

All IPC handlers use a consistent response format:

```typescript
interface IPCResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## 4. Assistant Profiles

**File**: `src/utils/prompts.js`

### 4.1. Profile Structure

Each profile contains:

```javascript
{
  intro: "Role description...",
  formatRequirements: "Response format rules...",
  searchUsage: "When to use Google Search...",
  content: "Examples and guidelines...",
  outputInstructions: "Final output rules..."
}
```

### 4.2. Available Profiles

| Profile | Response Style | Primary Use |
|---------|----------------|-------------|
| `interview` | Detailed, STAR method | Job interviews |
| `sales` | Concise, value-focused | Sales calls |
| `meeting` | Action-oriented | Team meetings |
| `presentation` | Confident, engaging | Public speaking |
| `negotiation` | Strategic, win-win | Deal-making |
| `exam` | Direct, efficient | Academic tests |

### 4.3. Dynamic Prompt Building

```javascript
function getSystemPrompt(profile, customPrompt = '', googleSearchEnabled = true) {
  const promptParts = profilePrompts[profile] || profilePrompts.interview;
  return buildSystemPrompt(promptParts, customPrompt, googleSearchEnabled);
}
```

The `searchUsage` section is conditionally included based on `googleSearchEnabled`.

## 5. Session Management

### 5.1. Session Data Structure

```javascript
{
  sessionId: "1706300000000",
  createdAt: 1706300000000,
  lastUpdated: 1706300100000,
  profile: "interview",
  customPrompt: "User context...",
  conversationHistory: [
    {
      timestamp: 1706300050000,
      transcription: "Interviewer question...",
      ai_response: "Assistant response..."
    }
  ],
  screenAnalysisHistory: [
    {
      timestamp: 1706300075000,
      prompt: "What's on screen?",
      response: "Analysis...",
      model: "gemini-2.5-flash"
    }
  ]
}
```

### 5.2. History Persistence

Sessions are stored as individual JSON files named by their timestamp:

```
history/
├── 1706300000000.json
├── 1706300100000.json
└── 1706300200000.json
```

## 6. Build Configuration

**File**: `package.json`

### 6.1. Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `electron-forge start` | Development mode |
| `package` | `electron-forge package` | Create executable |
| `make` | `electron-forge make` | Create installer |

### 6.2. Platform Targets

| Platform | Maker |
|----------|-------|
| Windows | `@electron-forge/maker-squirrel` |
| macOS | `@electron-forge/maker-dmg` |
| Linux (DEB) | `@electron-forge/maker-deb` |
| Linux (RPM) | `@electron-forge/maker-rpm` |
| Linux (AppImage) | `@reforged/maker-appimage` |

---

*Last Updated: 2026-01-26*
