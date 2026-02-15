---
title: "Assistant: Real-Time AI Voice Assistant - Transparent Overlay with Dual-Layer Response System"
emoji: "👻"
type: "idea"
topics: ["gch4", "electron", "gemini", "ai", "rag"]
published: true
---

# Assistant: The Invisible AI Co-Pilot for Real-Time Conversations

## Project Overview

### Target Users
- **Job seekers** in technical interviews
- **Sales professionals** during client calls
- **Business negotiators**
- **Public speakers and presenters**
- **Students** preparing for tests and deepening understanding

### Problem Statement

During critical real-time conversations (interviews, sales calls, negotiations), recalling relevant information and responding appropriately is extremely difficult. Existing AI assistants have these problems:

1. **Visibility Problem** - AI usage becomes visible through screen sharing/recording
2. **Operation Delay** - Time lost switching windows with Alt+Tab
3. **Lack of Context** - AI doesn't understand real-time conversation context or background
4. **Note-taking Burden** - Taking notes during conversation breaks concentration

### Solution Features

**Assistant** is a desktop AI assistant that solves all of these problems:

**Core Innovation:**

1. **Fully Invisible Ghost Window**
   - Hidden from screen capture, screen recording, and Zoom screen sharing
   - Always on top while remaining transparent and interactive
   - Click-through mode prevents interference with background applications

2. **Dual-Layer Response System**
   - **Visible Layer**: Immediate suggestions and answers for the user
   - **Silent Layer**: AI automatically creates structured notes (hidden during conversation)
   - After the session, categorized notes are exported in Word format

3. **Dynamic RAG (Retrieval-Augmented Generation)**
   - Real-time document retrieval and injection based on conversation flow
   - Dynamic, context-aware information delivery instead of static prompts
   - Automatic query generation from conversation history to fetch optimal chunks

4. **Native Audio Streaming**
   - Direct integration with Google Gemini's audio API (WebSocket over PCM)
   - Simultaneous capture of microphone + system audio
   - Speaker identification for context awareness

5. **Tabbed Session Interface**
   - **Assistant Tab (A)**: Real-time AI response display with Markdown rendering and response navigation
   - **Translation Tab (T)**: Real-time translation across 28 languages with side-by-side display, speaker labels, and live tentative translations via Google Cloud Translation API
   - **Screen Tab (S)**: AI-powered screenshot analysis (auto/manual) with timestamps, thumbnails, and search
   - Instant tab switching via keyboard shortcuts (A/T/S/Tab)
   - New analysis indicator when results arrive while on another tab

---

## Demo Video

@[youtube](YOUR_YOUTUBE_VIDEO_ID)

---

## System Architecture

![System Architecture](./architecture-diagram.png)

### Key Architecture Components:

```
┌──────────────────────────────────────────────────────────────────┐
│                      Electron Main Process                       │
├──────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐     │
│  │ Ghost Window  │  │ Audio Capture │  │  Gemini Session  │     │
│  │  Management   │  │  (Mic + Sys)  │  │   (WebSocket)    │     │
│  └───────────────┘  └───────────────┘  └──────────────────┘     │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐     │
│  │    Screen     │  │  Translation  │  │   RAG / Doc      │     │
│  │   Capture     │  │   Pipeline    │  │   Processing     │     │
│  └───────────────┘  └───────────────┘  └──────────────────┘     │
│         │                  │                    │                 │
│  ┌──────▼──────────────────▼────────────────────▼──────────────┐ │
│  │              IPC Bridge (preload.js)                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                     Renderer Process (Lit)                        │
├──────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐     │
│  │ AssistantView │  │  NotesParser  │  │  RAG Retrieval   │     │
│  │  (Tabbed UI)  │  │ (Dual-Layer)  │  │     Engine       │     │
│  └───────────────┘  └───────────────┘  └──────────────────┘     │
│         │                  │                    │                 │
│  ┌──────▼──────────────────▼────────────────────▼──────────────┐ │
│  │   [Assistant (A)]  [Translation (T)]  [Screen (S)]          │ │
│  │   AI Responses  |  Side-by-Side     |  Screen Analysis      │ │
│  │   + Markdown    |  Translation      |  + Thumbnails         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Google Gemini API  │
                   │  - Audio Stream     │
                   │  - Embeddings       │
                   │  - Vision / OCR     │
                   │  - Screen Analysis  │
                   │  - Translation      │
                   └─────────────────────┘
```

### Data Flow:
1. **Audio Input** -> PCM conversion -> Gemini WebSocket -> Assistant tab displays response
2. **AI Response** -> Notes parser -> Visible layer / Silent layer separation
3. **Document Upload** -> Chunking -> Embedding generation -> Local JSON storage
4. **Conversation Progress** -> RAG engine -> Relevant chunk retrieval -> Context injection
5. **Translation** -> Speech detection -> Buffering -> Google Cloud Translation API (primary, ~50-100ms) with Gemini fallback (~1-3s) -> Translation tab with live tentative translations
6. **Screen Analysis** -> Screenshot capture -> Gemini Vision API -> Screen tab with timestamped results and thumbnails
7. **Session End** -> Structured notes generation -> .docx export

---

## Table of Contents

1. [Evaluation Criteria](#evaluation-criteria)
2. [Technical Implementation](#the-ghost-window-hiding-in-plain-sight)
   - [The Ghost Window](#the-ghost-window-hiding-in-plain-sight)
   - [Dual-Layer Thinking](#dual-layer-thinking-what-the-user-sees-vs-what-the-ai-remembers)
   - [Live RAG](#live-rag-injecting-knowledge-into-a-real-time-audio-stream)
   - [Tabbed Session Interface](#the-tabbed-session-interface-three-views-into-one-conversation)
3. [A Session From Start to Finish](#a-session-from-start-to-finish)
4. [The Stack and Why Each Piece Exists](#the-stack-and-why-each-piece-exists)
5. [What Went Wrong](#what-went-wrong)
6. [Getting Started](#getting-started)

---

## Evaluation Criteria

### Problem Novelty

With remote work becoming the norm, online interviews, sales calls, and meetings are everyday occurrences. However, existing solutions for "real-time AI assistance during conversations" have fundamental problems:

1. **Detection Risk**: Existing AI tools (ChatGPT, Notion AI, etc.) run in separate windows and become visible through screen sharing
2. **Interaction Cost**: Time lost and unnatural behavior from switching windows
3. **Context Disconnect**: AI doesn't understand conversation history or background documents, leading to irrelevant responses
4. **Cognitive Load**: Taking notes while talking splits concentration

**What makes this project novel:**
- A window completely invisible to screen capture APIs (`setContentProtection(true)`)
- Fully hands-free operation via audio streaming
- Dual-layer responses through prompt engineering
- Dynamic RAG based on conversation context

### Solution Effectiveness

**Five core features directly solve the problems:**

#### 1. Ghost Window Invisibility
```javascript
mainWindow.setContentProtection(true);  // Exclude from screen capture
mainWindow.setHiddenInMissionControl(true);  // Hide from Mission Control
mainWindow.setSkipTaskbar(true);  // Hide from taskbar
mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
```
- **Effect**: Completely invisible in Zoom/Teams/Google Meet screen sharing
- **Verified**: Tested on macOS, Windows, and Linux

#### 2. Dual-Layer Response for Cognitive Load Reduction
```
[Response visible to user]
"Let me explain distributed consensus algorithms..."

[NOTES]  <-- This part is hidden during the conversation
- Key point: Interviewer is focused on Raft vs Paxos
- Decision: Should reference the 2022 database project
- Action item: Explain the relationship with CAP theorem
[/NOTES]
```
- **Effect**: User focuses on conversation while AI automatically creates structured notes
- **Result**: Categorized notes exported as .docx after session ends

#### 3. Dynamic RAG for Context Awareness
```javascript
// Real-time chunk retrieval based on conversation progress
const recentTurns = conversationHistory.slice(-3);
const relevantChunks = await retrievalEngine.retrieve(recentTurns);
geminiSession.sendRealtimeInput({ text: formatContextInjection(chunks) });
```
- **Effect**: Even with a 50-page technical document uploaded, only relevant sections are accurately referenced
- **Differentiation**: Unlike static prompt injection (preloading entire text), chunks are retrieved dynamically based on conversation context

#### 4. Native Audio Integration for Zero-Operation Use
```javascript
// Simultaneous mic + system audio capture -> Gemini WebSocket
audioWorkletNode.port.onmessage = (e) => {
    const pcmData = convertToPCM16(e.data.audioData);
    geminiSession.sendRealtimeInput({ data: pcmData });
};
```
- **Effect**: No keyboard or mouse operation needed -- fully hands-free
- **UX**: Maintains natural conversation flow

#### 5. Tabbed Session Interface
```javascript
// Three tabs provide different information simultaneously
// Assistant (A): AI response display (Markdown-enabled)
// Translation (T): Real-time translation (28 languages, side-by-side)
// Screen (S): Screenshot AI analysis (auto/manual, searchable)
const showTabs = this.translationEnabled || this.screenAnalyses.length > 0;
```
- **Effect**: Instantly switch between information views during conversation (keyboard shortcuts A/T/S/Tab)
- **UX**: Tab bar is hidden when no secondary features are active -- shown only when needed

### Implementation Quality & Scalability

#### Code Quality
- **Total lines**: ~9,000+ lines of JavaScript
- **Dependencies**: Only 3 production dependencies (`@google/genai`, `docx`, `electron-squirrel-startup`)
- **Architecture**: Clear process separation via IPC communication
- **Error handling**: Auto-reconnection on WebSocket disconnect with context restoration

#### Scalability
```javascript
// Batch processing for document embeddings
async function generateEmbeddings(chunks, apiKey) {
    const BATCH_SIZE = 100;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const embeddings = await Promise.all(
            batch.map(chunk => ai.models.embed({
                model: 'text-embedding-004',
                content: chunk.text
            }))
        );
    }
}
```
- **Large document support**: Parallel processing at 100 chunks/batch
- **Storage**: Local JSON (user data directory), zero cloud cost

#### Operability
- **Cross-platform**: Windows, macOS, Linux (Electron Forge)
- **Offline operation**: UI layer is fully offline, only AI API calls require network
- **Cost efficiency**: Works within Gemini's free tier (automatic fallback on rate limits)

#### Extensibility
```javascript
// Profile-based prompt system
const profilePrompts = {
    interview: { /* Interview prompts */ },
    sales: { /* Sales prompts */ },
    negotiation: { /* Negotiation prompts */ },
    // Easy to add new profiles
};
```
- **Customization**: Users can create their own AI profiles

---

## The Ghost Window: Hiding in Plain Sight

The most critical feature of this application isn't the AI. It's the window.

If you're using an AI assistant during a video call, you have exactly one requirement that trumps everything else: *nobody on the call can know it exists.* Screen sharing, screen recording, screenshot tools -- the window must be invisible to all of them.

Electron makes this possible with a single API call:

```javascript
mainWindow.setContentProtection(true);
```

This tells the operating system to exclude the window from screen capture APIs. On macOS, the window doesn't appear in screen recordings, screenshots, or screen shares. On Windows, it renders as a black rectangle in captured output.

But content protection is just the beginning. A ghost window needs to vanish from *everywhere*:

```javascript
// Hide from macOS Mission Control
mainWindow.setHiddenInMissionControl(true);

// Hide from Windows taskbar
mainWindow.setSkipTaskbar(true);

// Float above everything, including fullscreen apps
mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

// On Windows, set to screen-saver level -- above even "always on top" windows
mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
```

The window is frameless and transparent. It has no title bar, no border, no shadow. It's a floating pane of glass with text on it.

### The Click-Through Problem

Here's a subtlety that took real debugging: an always-on-top transparent window *blocks mouse clicks* on everything behind it. If the user clicks where the overlay is, the overlay captures the event, not the application underneath.

The solution is **click-through mode**. A keyboard shortcut (`Ctrl+M` / `Cmd+M`) toggles whether the window captures mouse events:

```javascript
globalShortcut.register(keybinds.toggleClickThrough, () => {
    mouseEventsIgnored = !mouseEventsIgnored;
    if (mouseEventsIgnored) {
        mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
        mainWindow.setIgnoreMouseEvents(false);
    }
});
```

The `{ forward: true }` option is crucial -- it tells Electron to forward mouse events to the window behind, rather than simply swallowing them. Without it, clicking "through" the overlay would click nothing.

The entire interaction model is keyboard-driven: move the window with arrow shortcuts, toggle visibility with `Ctrl+\`, navigate between AI responses with `Ctrl+[` and `Ctrl+]`. The user never needs to grab a title bar or click a button.

### Emergency Erase

And because we're building something that must vanish instantly, there's a panic button:

```javascript
globalShortcut.register(keybinds.emergencyErase, () => {
    mainWindow.hide();
    if (geminiSessionRef.current) {
        geminiSessionRef.current.close();
        geminiSessionRef.current = null;
    }
    sendToRenderer('clear-sensitive-data');
    setTimeout(() => app.quit(), 300);
});
```

`Ctrl+Shift+E` hides the window, kills the AI session, clears all visible data, and exits. The 300ms delay ensures the renderer has time to blank itself before the process terminates.

---

## Dual-Layer Thinking: What the User Sees vs. What the AI Remembers

This is the idea I'm most proud of, and it's implemented entirely through prompt engineering and a 142-line parser.

During a Co-Pilot session, the AI produces two kinds of output simultaneously:

1. **Visible output**: The response displayed to the user in real time -- suggestions, answers, talking points.
2. **Silent output**: Structured notes embedded inside the response that the user never sees during the session.

The AI is instructed to wrap its notes in markers:

```
Here's how I'd answer that question about distributed systems...

[Your visible answer about Raft consensus here]

[NOTES]
- Key point: Interviewer shifted from behavioral to technical questions
- Decision: Focus remaining answers on systems design experience
- Action item: Mention the database migration project with concrete metrics
- Open question: Interviewer hasn't asked about team leadership yet
[/NOTES]
```

The renderer strips everything between `[NOTES]` and `[/NOTES]` before displaying the response. The notes are parsed, categorized, and accumulated silently in the background.

Here's the actual parser:

```javascript
const NOTES_REGEX = /\[NOTES\]([\s\S]*?)\[\/NOTES\]/g;
const REFOCUS_REGEX = /\[REFOCUS:\s*(.*?)\]/g;
const ADVANCE_REGEX = /\[ADVANCE:\s*(.*?)\]/g;

export function parseResponse(text) {
    const alerts = [];
    const allNotes = {
        keyPoints: [], decisions: [], openQuestions: [],
        actionItems: [], nextSteps: [],
    };

    // Extract [NOTES] blocks
    let match;
    const notesRegex = new RegExp(NOTES_REGEX.source, 'g');
    let hasNotes = false;
    while ((match = notesRegex.exec(text)) !== null) {
        hasNotes = true;
        const parsed = parseNotesBlock(match[1]);
        allNotes.keyPoints.push(...parsed.keyPoints);
        allNotes.decisions.push(...parsed.decisions);
        // ... merge other categories
    }

    // Strip all markers from text for clean display
    const cleanText = text
        .replace(NOTES_REGEX, '')
        .replace(REFOCUS_REGEX, '')
        .replace(ADVANCE_REGEX, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return { cleanText, notes: hasNotes ? allNotes : null, alerts };
}
```

The categorization happens by prefix detection -- each note line is routed to the right bucket:

```javascript
function parseNotesBlock(rawNotes) {
    const result = {
        keyPoints: [], decisions: [], openQuestions: [],
        actionItems: [], nextSteps: [],
    };

    const lines = rawNotes.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
        const cleaned = line.replace(/^[-*]\s*/, '');
        const lower = cleaned.toLowerCase();

        if (lower.startsWith('key point:'))
            result.keyPoints.push(cleaned.replace(/^key point:\s*/i, ''));
        else if (lower.startsWith('decision:'))
            result.decisions.push(cleaned.replace(/^decision:\s*/i, ''));
        else if (lower.startsWith('action item:'))
            result.actionItems.push(cleaned.replace(/^action item:\s*/i, ''));
        // ...
    }
    return result;
}
```

### Why This Matters

When the session ends, the user sees a structured summary with every observation the AI made, organized into **Key Points**, **Decisions**, **Action Items**, **Open Questions**, and **Next Steps**. They can export it to a `.docx` file -- a professional document with headings, bullets, and metadata, generated by the `docx` npm package.

The key insight: *the AI is a better note-taker than the user during a live conversation, because the user is busy talking.* By separating the "help me right now" layer from the "remember this for later" layer, both tasks get done without competing for the user's attention.

### Behavioral Markers Beyond Notes

The system also uses non-note markers to guide the session in real time:

- `[REFOCUS: The conversation has drifted from the stated goal of discussing system design]` -- a nudge when things go off track
- `[TOPICS REMAINING: Scalability, Error handling]` -- a reminder of uncovered ground
- `[ADVANCE: Consider asking about next steps to move toward a decision]` -- a prompt to close

These are extracted as "alerts" and rendered differently from notes -- they're actionable guidance that appears inline during the session, while notes stay hidden until the end.

### Profile-Aware Intelligence

The Co-Pilot doesn't track the same things for every context. The prompt includes profile-specific instructions:

```javascript
const profileCopilotAdditions = {
    interview: `
        CO-PILOT FOCUS (Interview):
        - Track which STAR stories have been used and suggest fresh ones
        - Detect interviewer intent (behavioral, technical, cultural fit)
        - Note if the candidate is being too brief or too verbose`,
    sales: `
        CO-PILOT FOCUS (Sales):
        - Track objections raised and whether they've been resolved
        - Identify buying signals (budget questions, timeline discussions)
        - Flag when the prospect is ready to close`,
    negotiation: `
        CO-PILOT FOCUS (Negotiation):
        - Track concessions made by each party
        - Identify BATNA signals and leverage points
        - Monitor deal readiness and suggest closing language`,
};
```

An interview session tracks STAR method usage. A sales session watches for buying signals. A negotiation session monitors concessions. The silent notes capture domain-specific intelligence that would be impossible to track manually while you're in the middle of the conversation.

---

## Live RAG: Injecting Knowledge Into a Real-Time Audio Stream

Most RAG implementations work like this: you upload a document, it gets chunked and embedded, and when you ask a question, the system retrieves relevant chunks and stuffs them into the prompt. This is "static RAG" -- the context is set at query time.

That doesn't work for a live audio session. There's no single query. The conversation evolves continuously, and the document sections that are relevant at minute 5 are different from what's relevant at minute 25.

So I built **dynamic RAG** -- a retrieval engine that watches the conversation as it unfolds and injects relevant document chunks into the AI's context *during* the session, not before it.

### The Ingestion Pipeline

When a user uploads a reference document during session preparation, it goes through four stages:

**1. Document Parsing** -- Plain text files are read directly. PDFs, Word docs, and images are sent to the Gemini API for OCR extraction:

```javascript
// For complex documents, Gemini extracts the text
const ai = new GoogleGenAI({ apiKey });
const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
        { inlineData: { mimeType, data: base64Data } },
        { text: 'Extract all text from this document exactly as written.' }
    ],
});
```

**2. Chunking** -- The extracted text is split into 1,500-character chunks with 200-character overlap. The chunker is smarter than a simple character split -- it searches backward for natural boundaries:

```javascript
function findSplitPoint(text, start, targetEnd) {
    const searchStart = Math.max(start, targetEnd - 300);
    const region = text.slice(searchStart, targetEnd);

    // Try paragraph boundary first
    const paraIdx = region.lastIndexOf('\n\n');
    if (paraIdx !== -1 && paraIdx > region.length * 0.3)
        return searchStart + paraIdx + 2;

    // Then sentence boundary
    const sentenceRegex = /\.\s/g;
    let lastSentenceEnd = -1;
    let match;
    while ((match = sentenceRegex.exec(region)) !== null) {
        if (match.index > region.length * 0.3) lastSentenceEnd = match.index;
    }
    if (lastSentenceEnd !== -1)
        return searchStart + lastSentenceEnd + 2;

    // Then word boundary, then hard split
    const spaceIdx = region.lastIndexOf(' ');
    if (spaceIdx !== -1 && spaceIdx > region.length * 0.3)
        return searchStart + spaceIdx + 1;

    return targetEnd;
}
```

The `0.3` threshold prevents splitting too close to the start of the search region, which would create a tiny chunk followed by a normal one.

**3. Embedding** -- Each chunk is converted to a vector using Gemini's `text-embedding-004` model, processing up to 100 chunks per batch.

**4. Storage** -- Embeddings are saved as JSON files in the user's data directory. No vector database, no external service. One file per document.

### The Retrieval Loop

Here's where it gets interesting. After each AI response completes, the system:

1. Takes the last 3 conversation turns (both human speech and AI responses)
2. Builds a search query from that text
3. Generates an embedding for the query
4. Finds the top 5 most similar document chunks via cosine similarity
5. Injects them into the live audio session as text

```javascript
// Inside the Gemini session's onmessage callback:
if (message.serverContent?.generationComplete) {
    // Dynamic RAG: retrieve and inject relevant document context
    if (retrievalEngine && retrievalEngine.canRetrieve()) {
        const recentTurns = conversationHistory.slice(-3);
        engine.retrieve(recentTurns).then(chunks => {
            if (chunks.length > 0 && global.geminiSessionRef?.current) {
                const contextText = engine.formatContextInjection(chunks);
                global.geminiSessionRef.current.sendRealtimeInput({
                    text: contextText
                });
            }
        });
    }
}
```

The injected text is formatted as a reference block:

```
[REFERENCE CONTEXT - from uploaded documents, use if relevant]
--- From: company_research.pdf ---
The company reported Q3 revenue of $2.1B, up 23% YoY...
[END REFERENCE CONTEXT]
```

### Three Details That Matter

**Deduplication.** The engine tracks which chunk IDs have been injected and never sends the same chunk twice. Without this, the AI would receive the same popular chunks over and over.

```javascript
const availableChunks = this.chunks.filter(
    c => !this.injectedChunkIds.has(c.id)
);
```

**Cooldown.** There's a 20-second minimum between retrievals. The AI needs time to absorb injected context. Flooding it with chunks every few seconds degrades response quality.

```javascript
canRetrieve() {
    if (this.isRetrieving) return false;
    return Date.now() - this.lastRetrievalTime >= 20000;
}
```

**Graceful fallback.** If embedding generation fails (API rate limit, network issue), the system falls back to injecting the full document text directly into the system prompt. Less efficient, but the session still works.

---

## The Tabbed Session Interface: Three Views Into One Conversation

During an active session, the user sees three distinct tabs, each serving a different purpose. The key design decision: all three tabs operate simultaneously over the same live audio session, but present information in fundamentally different ways.

### Assistant Tab (A) -- The Primary View

This is the standard AI response display. Gemini listens to audio and generates text responses that appear here with full markdown rendering -- code blocks, tables, lists, headings. Responses are navigable (previous/next) and scrollable. Co-Pilot notes are parsed and stripped from this view silently.

### Translation Tab (T) -- Real-Time Bilingual Display

When translation is enabled (28 supported languages), this tab displays a side-by-side column layout:

```
+---------------------+---------------------+
|  Japanese (Source)   |  English (Target)   |
+---------------------+---------------------+
|  SPEAKER             |  SPEAKER            |
|  [Original speech]   |  About his          |
|                      |  experience...      |
|  USER                |  USER               |
|  [Original speech]   |  Yes, for 3 years...|
+---------------------+---------------------+
```

The translation pipeline buffers speech until sentence boundaries (or 8 words), queues requests (max 3 concurrent), and routes results exclusively to this tab. Speaker labels (USER/SPEAKER) help track who said what across both languages.

A key innovation is **tentative real-time translation**: when a Google Cloud Translation API key is configured, the right column shows a dimmed, italic tentative translation that updates live as the user speaks (~50-100ms latency). When the buffer flushes at a sentence boundary, the final translation replaces the tentative one. If the Cloud Translation API is unavailable, the system falls back to Gemini translation (~1-3s).

### Screen Tab (S) -- AI-Powered Screen Analysis

Screenshots are captured either automatically (on a configurable interval) or manually via the "Analyze screen" button. Each capture is sent to the Gemini Vision API for analysis, and the results are displayed as timestamped entries with:

- **Timestamp** and **model** metadata
- **AI analysis text** (what Gemini sees on screen)
- **Screenshot thumbnail** (clickable, with the original base64 image)
- **Search** to filter analyses by content
- **Clear All** to reset history

Screen analyses are routed exclusively to the Screen tab -- they never appear in the Assistant tab. When new analyses arrive while the user is on another tab, a green dot indicator appears on the Screen tab label.

```javascript
// Tab switching via keyboard shortcuts
if (e.key === 'a') this._activeTab = 'assistant';
if (e.key === 't') this._activeTab = 'translation';
if (e.key === 's') this._activeTab = 'screen';
if (e.key === 'Tab') {
    // Cycle: assistant -> translation -> screen -> assistant
}
```

The tab bar itself only appears when at least one secondary feature is active (translation enabled or screen analyses exist). When neither is active, the full viewport is the Assistant view with no tabs -- zero UI overhead for users who don't need these features.

---

## A Session From Start to Finish

To make this concrete, here's what a complete Co-Pilot session looks like:

**1. Preparation.** The user opens the Session Prep view and fills in their goal ("Negotiate a 15% budget increase for Q2"), desired outcome, success criteria, and key topics. They upload two reference documents: last quarter's performance report and the company's financial plan. Each document is parsed, chunked, embedded, and stored. The form auto-saves every keystroke.

**2. Session start.** The app establishes a WebSocket connection to Gemini's native audio model. The system prompt is assembled from the selected profile (Negotiation), the user's custom context, Co-Pilot behavioral instructions, and document references. Two audio streams begin: microphone input and system audio (the other person's voice).

**3. Live session.** The AI listens to both audio streams with speaker diarization -- it knows who said what. The session UI presents three tabs: the **Assistant tab** shows AI responses with markdown formatting and syntax highlighting; the **Translation tab** (if enabled) displays side-by-side bilingual transcriptions; the **Screen tab** captures and analyzes what's on screen. After each response, the RAG engine checks if new document context should be injected. Co-Pilot markers are stripped in real time, notes are accumulated silently.

**4. Mid-session.** Twenty minutes in, the conversation drifts to unrelated topics. The AI injects `[REFOCUS: The budget discussion hasn't addressed the ROI data from the performance report yet]`. Meanwhile, the RAG engine has noticed the conversation is now about Q1 results and injects relevant chunks from the financial plan. On the Screen tab, periodic screenshots have captured the other party's presentation slides, and Gemini's analysis highlights key figures that could strengthen the user's position.

**5. Session close.** The user presses the close shortcut. The app saves the conversation history, accumulated notes, and Co-Pilot prep data. It navigates to the Summary view.

**6. Post-session.** The Summary view calls the Gemini HTTP API to generate a structured summary of the session. The user sees their notes categorized into decisions made, action items, open questions, and next steps. They see which topics were covered and which were missed. One click exports everything to a formatted `.docx` file.

---

## The Stack and Why Each Piece Exists

Every technology choice in this project was made for a specific reason.

| Layer | Choice | Why Not the Alternative |
|-------|--------|------------------------|
| **Runtime** | Electron 30.x | Needs system audio access, global shortcuts, screen capture, always-on-top overlay. No web app can do this. Tauri can't do transparent overlays well on all platforms. |
| **AI** | Google Gemini | Only major model with native audio input (direct PCM streaming over WebSocket). OpenAI's Realtime API is similar but costs more. Gemini also provides embeddings, OCR, translation, and screen analysis in the same SDK. |
| **UI** | Lit 2.7 (vanilla JS) | No build step. Edit a file, reload the app. React would require a bundler, TypeScript would require compilation. For a project where you're testing against live audio, 2-second iteration cycles matter. |
| **Storage** | JSON files | Single user, local data, no relationships to query. SQLite would add complexity without benefit. Each data domain is a separate file -- if one corrupts, the others survive. |
| **Export** | `docx` npm package | Users want to share session notes with colleagues. PDF is read-only; `.docx` is editable and professional. |

### The Dependency Diet

The production dependency list is three packages:

- `@google/genai` -- Gemini API client
- `docx` -- Word document generation
- `electron-squirrel-startup` -- Windows installer support

Lit, Marked.js, and Highlight.js are bundled as local assets. No CDN calls, no network dependencies for the UI. The app works offline for everything except the AI itself.

---

## What Went Wrong

Every project has war stories. Here are the ones worth sharing.

### Static RAG Was a Dead End

The first version of document support loaded the entire document text into the system prompt before the session started. This worked for a one-page resume. It failed spectacularly for a 50-page technical document -- the prompt would exceed token limits, and even when it fit, the AI would lose focus on the actual conversation because it was trying to process too much reference material.

The fix -- dynamic retrieval with conversation-based queries -- was a complete rewrite of the document pipeline. But the improvement was dramatic: the AI now references documents naturally, as if it studied them beforehand, rather than trying to hold the entire text in working memory.

### Audio Reconnection Is Fragile

WebSocket connections to Gemini's live API drop. It happens. Network hiccups, server timeouts, WiFi switching. For a text chat, this is a minor inconvenience. For a live audio session during an important meeting, it's a disaster.

The reconnection logic took multiple iterations to get right:

```javascript
async function attemptReconnect() {
    reconnectAttempts++;
    sendToRenderer('update-status',
        `Reconnecting... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

    await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));

    const session = await initializeGeminiSession(
        sessionParams.apiKey, sessionParams.customPrompt,
        sessionParams.profile, sessionParams.language,
        true, // isReconnect flag
        sessionParams.copilotPrep, sessionParams.customProfileData
    );

    if (session) {
        // Restore context: replay last 20 conversation turns
        const contextMessage = buildContextMessage();
        if (contextMessage) {
            await session.sendRealtimeInput({ text: contextMessage });
        }
        return true;
    }

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        return attemptReconnect(); // Recursive retry
    }
    return false;
}
```

The hardest part: deciding what "context restoration" means for an audio session. You can't replay audio. What you can do is send a text summary of the last 20 conversation turns -- both what was said and what the AI responded -- and tell the model to continue from there. It's imperfect but better than starting cold.

### Stereo-to-Mono Conversion

On macOS, system audio capture returns stereo PCM at 24kHz. Gemini expects mono. This one-line conceptual operation required understanding the raw byte layout of interleaved 16-bit PCM audio:

```javascript
function convertStereoToMono(stereoBuffer) {
    const samples = stereoBuffer.length / 4; // 2 bytes per sample, 2 channels
    const monoBuffer = Buffer.alloc(samples * 2);

    for (let i = 0; i < samples; i++) {
        const leftSample = stereoBuffer.readInt16LE(i * 4);
        monoBuffer.writeInt16LE(leftSample, i * 2);
    }
    return monoBuffer;
}
```

This takes the left channel only. A proper implementation would average both channels, but for voice audio where both channels are nearly identical, taking one channel avoids potential clipping from addition.

### The Rate Limit Dance

Gemini's free tier has strict rate limits. The app tracks daily usage per model and automatically falls back:

```
gemini-2.5-flash (primary) -> gemini-2.5-flash-lite (fallback)
```

This works, but it means screen analysis quality degrades silently when you hit the limit. The user sees a response from `flash-lite` that's slightly less detailed than what `flash` would produce, with no indication of why. An honest UI would surface this, and that's a known gap.

---

## Lessons Learned

### The Essence of Desktop AI

The key insight from building this application: **the most powerful AI features are often invisible.**

- The silent notes system is invisible during conversation
- RAG information injection is invisible -- the AI behaves as if it "knew all along"
- The ghost window is literally invisible
- Reconnection logic is invisible during normal operation
- Rate limit fallback is invisible

**The ideal form of desktop AI is not a chatbot window.** It's an ambient intelligence layer that operates in the gaps of human attention.

- You focus on the conversation
- The AI focuses on everything else: tracking what was said, searching for relevant information, recording follow-up needs, remembering what shouldn't be forgotten

This project is:
- **9,000+ lines of JavaScript** / 30+ files
- **Only 3 production dependencies**
- **3-tab integrated session UI** (Assistant / Translation / Screen)
- **Cross-platform**: Windows, macOS, Linux
- **Most important feature: making you forget it's there**

### Leveraging Google Gemini API

This project leverages **5 core capabilities of the Gemini API**:

1. **Gemini Live (Audio Streaming)** -> Assistant Tab
   - Direct PCM transmission via WebSocket
   - Low-latency (~500ms) real-time responses
   - Speaker identification for context awareness

2. **Embeddings API (text-embedding-004)** -> RAG Engine
   - High-precision vectorization of 1,500-character chunks
   - Document search via cosine similarity
   - Parallel processing at 100 chunks/batch

3. **Vision API (OCR + Screen Analysis)** -> Screen Tab
   - Text extraction from PDFs, images, Word documents
   - Digitization of handwritten notes
   - Auto/manual screenshot AI analysis
   - Real-time interpretation and summarization of on-screen information

4. **Translation API (HTTP) + Google Cloud Translation API** -> Translation Tab
   - Real-time translation across 28 languages
   - Google Cloud Translation API for tentative live translations (~50-100ms)
   - Gemini API as high-quality fallback (~1-3s)
   - Natural translation quality via sentence-boundary buffering
   - Max 3 concurrent translation requests, 20-request queue limit
   - Side-by-side display with speaker labels and live tentative preview

5. **Summary Generation (HTTP)** -> Post-Session
   - Structured summary generation for entire sessions
   - Export in .docx format

**Why Gemini was chosen:**
- Lower cost than OpenAI Realtime API
- Multimodal processing within a single SDK (audio, image, text, translation, embeddings)
- Practical even within the free tier

---

## Future Roadmap

### Phase 1: Core Feature Enhancement
- [x] Real-time translation (28 languages, side-by-side display in Translation tab)
- [x] Screen analysis tab (auto/manual capture, AI analysis, search and thumbnails)
- [x] 3-tab integrated session UI (Assistant/Translation/Screen with keyboard shortcuts)
- [ ] OpenAI Realtime API support (selectable backend)

### Phase 2: Enterprise Features
- [ ] Team session sharing (Firestore integration)
- [ ] Admin dashboard (usage statistics, compliance)
- [ ] SSO support (Google Workspace, Microsoft 365)

### Phase 3: Mobile Expansion
- [ ] React Native version (iOS/Android)
- [ ] Cloud sync (session history, documents, settings)
- [ ] Wearable support (Apple Watch, Galaxy Watch)

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- [Google Gemini API key](https://aistudio.google.com/apikey) (works within free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/harsh194/assistant.git
cd assistant

# Install dependencies
npm install

# Start in development mode
npm start
```

### First-Time Setup

1. The **onboarding wizard** launches automatically
2. Enter your Gemini API key
3. Select a profile (Interview, Sales, Meeting, etc.)
4. Optional: Upload custom context (resume, job description, etc.)

### Building

```bash
# Generate platform-specific installers
npm run make
```

Output:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.deb`, `.rpm`, `.AppImage`

### Usage

#### Basic Session
1. Select profile -> Enter custom context
2. Click `Start Session`
3. Microphone and system audio capture begins automatically
4. Real-time AI responses appear in the transparent overlay (Assistant tab)
5. When translation is enabled, Translation tab (T) shows side-by-side translation
6. Screen tab (S) shows manual/auto screenshot AI analysis

#### Co-Pilot Mode (Recommended)
1. Click `Prepare Session`
2. Enter goal, success criteria, and key topics
3. Upload reference documents (PDF, Word, images, etc.)
4. Start the session
5. During conversation, AI automatically creates notes (hidden from view)
6. After session ends, review and export structured notes

### Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Show/hide window | `Cmd+\` | `Ctrl+\` |
| Toggle click-through | `Cmd+M` | `Ctrl+M` |
| Next step | `Cmd+Enter` | `Ctrl+Enter` |
| Previous response | `Cmd+[` | `Ctrl+[` |
| Next response | `Cmd+]` | `Ctrl+]` |
| Emergency erase | `Cmd+Shift+E` | `Ctrl+Shift+E` |
| Assistant tab | `A` | `A` |
| Translation tab | `T` | `T` |
| Screen tab | `S` | `S` |
| Cycle tabs | `Tab` | `Tab` |

---

## Tech Stack Details

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Electron 30.x | System audio access, global shortcuts, and screen capture exclusion are essential. Impossible with web apps. |
| **AI** | Google Gemini | The only major model with native audio input. Lower cost than OpenAI Realtime API. Embeddings, OCR, translation, and screen analysis all in one SDK. |
| **UI** | Lit 2.7 | No build step required. Edit a file, reload, and see changes instantly. Ideal for rapid iteration with audio testing. |
| **Storage** | JSON files | Single user, local data, no queries needed. SQLite would be overkill. Separate files per domain for fault isolation. |
| **Export** | docx | Enterprise users can share with colleagues. PDF is read-only; .docx is editable and practical. |

### Minimal Dependencies

**Production dependencies (only 3):**
```json
{
  "@google/genai": "^1.2.0",
  "docx": "^9.5.1",
  "electron-squirrel-startup": "^1.0.1"
}
```

**Bundled assets (no CDN dependency):**
- Lit 2.7.4
- Marked.js (Markdown rendering)
- Highlight.js (code highlighting)

-> **Offline capable** (only AI API calls require network)

---

## Privacy & Security

### Data Handling

**Local-first architecture:**
- All conversation history, notes, and documents are stored on the user's machine
- No cloud data transmission (except Gemini API calls)
- User data directory: `~/.assistant/`

**API key safety:**
```javascript
// Credentials stored locally in user data directory
storage.setCredentials({ apiKey: encryptedKey });
```

**Emergency erase:**
- `Cmd+Shift+E` / `Ctrl+Shift+E` instantly hides the window
- AI session terminated
- Visible data cleared
- Full exit in 300ms

### Open Source Transparency

**License**: MIT
**GitHub**: https://github.com/harsh194/assistant

- Full source code available
- Community security audits welcome
- Free to fork and customize

---

## Responsible Use

### Design Philosophy

Assistant is designed for **learning enhancement** and **communication improvement**:

**Intended use cases:**
- **Interview Preparation** - Practice and build confidence through mock interviews
- **Learning Enhancement** - Deepen understanding and reinforce knowledge
- **Language Support** - Conversation assistance for non-native speakers and accessibility
- **Meeting Notes** - Automatically capture key points while staying focused on discussion
- **Cognitive Support** - Real-time assistance for individuals with anxiety or ADHD

**Ethical consideration:**
This tool aims to **augment**, not **replace**, user capability. The AI provides suggestions; the human makes decisions and speaks in their own voice.

---

## Conclusion

### The Core Problem This Project Solves

In the remote work era, many people want **real-time AI assistance during conversations**, but existing solutions suffer from fundamental problems: they're visible, they're slow, and they don't understand context.

**Assistant** comprehensively solves these problems with five core technologies:

1. **Ghost Window** - Natural usage experience through complete invisibility
2. **Dual-Layer Response** - Conversation and note-taking working together
3. **Dynamic RAG** - Context-aware knowledge injection
4. **Real-Time Translation** - Side-by-side translation across 28 languages
5. **Screen Analysis** - AI automatically interprets on-screen information

### 3-Tab Integrated Session UI

During sessions, three tabs (Assistant/Translation/Screen) provide different information simultaneously. Keyboard shortcuts (A/T/S/Tab) enable instant switching. The tab bar is hidden when no secondary features are active, minimizing UI complexity.

### Technical Originality

- Creative use of Electron's `setContentProtection` API
- Structured markers through prompt engineering (`[NOTES]`, `[REFOCUS]`, etc.)
- Dynamic RAG via conversation-history-based query generation
- Native audio streaming (WebSocket/PCM)
- 3-tab UI: responses, translation, and screen analysis unified in a single session

### Practicality and Scalability

- **Cross-platform**: Windows, macOS, Linux
- **Low cost**: Works within Gemini's free tier
- **Offline capable**: UI layer is fully local
- **Extensible**: Easy to add profiles and support new AI models

### Google Cloud Platform Integration Potential

Currently runs locally, but future integration with GCP services is possible:

- **Cloud Run**: Session management backend
- **Firestore**: Team sharing features
- **Cloud Storage**: Large-scale document hosting
- **Vertex AI**: Enterprise-grade inference

---

## Acknowledgments

This project was made possible by the following technologies and communities:

- **Google Gemini API** - Powerful multimodal AI
- **Electron** - Cross-platform desktop development
- **Lit** - Simple and fast Web Components
- **Open source community** - Valuable feedback and contributions

---

**Built with Electron, Lit, and Google Gemini**
*All conversations, notes, and documents stay on your machine.*

---

## License

MIT License

Copyright (c) 2026

This project is open source. Free to use, modify, and redistribute. See the [LICENSE](LICENSE) file for details.
