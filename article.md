# The Ghost in Your Screen: Building an AI That Listens, Thinks in Secret, and Disappears

You're thirty minutes into a technical interview. The interviewer asks about distributed consensus algorithms -- a topic you studied years ago but can't recall the nuances of. You glance at the corner of your screen. A transparent overlay, invisible to the Zoom screen share, is already displaying a structured answer tailored to your resume. You've never typed a query. The AI heard the question, understood the context, and responded before you could alt-tab.

Meanwhile, hidden inside that response, the AI is silently writing notes you'll never see until the session ends: *"Key point: Interviewer is focused on Raft vs Paxos -- candidate should mention their distributed database project from 2022."*

This is **Assistant** -- an open-source Electron desktop application I built that combines real-time audio AI, an invisible overlay window, and a novel dual-layer response system. This article isn't a feature tour. It's about the three engineering ideas that made it work, the code behind them, and what went wrong along the way.

---

## Table of Contents

1. [The Ghost Window: Hiding in Plain Sight](#the-ghost-window-hiding-in-plain-sight)
2. [Dual-Layer Thinking: What the User Sees vs. What the AI Remembers](#dual-layer-thinking-what-the-user-sees-vs-what-the-ai-remembers)
3. [Live RAG: Injecting Knowledge Into a Real-Time Audio Stream](#live-rag-injecting-knowledge-into-a-real-time-audio-stream)
4. [A Session From Start to Finish](#a-session-from-start-to-finish)
5. [The Stack and Why Each Piece Exists](#the-stack-and-why-each-piece-exists)
6. [What Went Wrong](#what-went-wrong)
7. [What This Taught Me About Desktop AI](#what-this-taught-me-about-desktop-ai)

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

## A Session From Start to Finish

To make this concrete, here's what a complete Co-Pilot session looks like:

**1. Preparation.** The user opens the Session Prep view and fills in their goal ("Negotiate a 15% budget increase for Q2"), desired outcome, success criteria, and key topics. They upload two reference documents: last quarter's performance report and the company's financial plan. Each document is parsed, chunked, embedded, and stored. The form auto-saves every keystroke.

**2. Session start.** The app establishes a WebSocket connection to Gemini's native audio model. The system prompt is assembled from the selected profile (Negotiation), the user's custom context, Co-Pilot behavioral instructions, and document references. Two audio streams begin: microphone input and system audio (the other person's voice).

**3. Live session.** The AI listens to both audio streams with speaker diarization -- it knows who said what. Responses appear in the transparent overlay with markdown formatting and syntax highlighting. After each response, the RAG engine checks if new document context should be injected. Co-Pilot markers are stripped in real time, notes are accumulated silently.

**4. Mid-session.** Twenty minutes in, the conversation drifts to unrelated topics. The AI injects `[REFOCUS: The budget discussion hasn't addressed the ROI data from the performance report yet]`. Meanwhile, the RAG engine has noticed the conversation is now about Q1 results and injects relevant chunks from the financial plan.

**5. Session close.** The user presses the close shortcut. The app saves the conversation history, accumulated notes, and Co-Pilot prep data. It navigates to the Summary view.

**6. Post-session.** The Summary view calls the Gemini HTTP API to generate a structured summary of the session. The user sees their notes categorized into decisions made, action items, open questions, and next steps. They see which topics were covered and which were missed. One click exports everything to a formatted `.docx` file.

---

## The Stack and Why Each Piece Exists

Every technology choice in this project was made for a specific reason.

| Layer | Choice | Why Not the Alternative |
|-------|--------|------------------------|
| **Runtime** | Electron 30.x | Needs system audio access, global shortcuts, screen capture, always-on-top overlay. No web app can do this. Tauri can't do transparent overlays well on all platforms. |
| **AI** | Google Gemini | Only major model with native audio input (direct PCM streaming over WebSocket). OpenAI's Realtime API is similar but costs more. Gemini also provides embeddings and OCR in the same SDK. |
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

## What This Taught Me About Desktop AI

Building this application taught me something I didn't expect: **the most powerful AI features are often invisible.**

The silent notes system is invisible during the session. The RAG injection is invisible -- the AI just seems to "know" the documents. The ghost window is literally invisible. The reconnection logic is invisible if it works. The rate limit fallback is invisible.

The best desktop AI isn't a chatbot window. It's an ambient intelligence layer that operates in the gaps of human attention. You're focused on the conversation. The AI is focused on everything else: tracking what was said, finding relevant information, noting what needs to follow up, remembering what you'll forget.

This project is ~9,000 lines of JavaScript across 30 files. It has three production dependencies. It runs on Windows, macOS, and Linux. And its most important feature is that you forget it's there.

---

## Getting Started

Assistant is open source and licensed under GPL-3.0. You'll need a [Google Gemini API key](https://aistudio.google.com/apikey) (free tier works).

```bash
git clone <repository-url>
cd assistant
npm install
npm start
```

The onboarding wizard will walk you through API key setup, profile selection, and optional context (resume, job description, etc.). From there, start a session or use Co-Pilot mode with full document support.

To build for distribution:

```bash
npm run make
```

This produces platform-specific installers via Electron Forge for Windows (.exe), macOS (.dmg), and Linux (.deb, .rpm, .AppImage).

---

*Built with Electron, Lit, and Google Gemini. The entire application runs locally -- your conversations, notes, and documents never leave your machine.*
