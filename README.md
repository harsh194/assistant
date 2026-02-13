# Assistant

AI-powered desktop assistant for real-time conversations. Built with Electron and Google Gemini API.

## Features

- **Real-Time AI Responses** - Live audio capture and transcription with AI-generated suggestions
- **Multiple Profiles** - Interview, Sales, Meeting, Presentation, Negotiation, Study Coach
- **Co-Pilot Mode** - Structured, goal-driven session assistant with:
  - Pre-session setup (goal, desired outcome, key topics, reference documents)
  - Document ingestion via Gemini API OCR (PDF, DOCX, images, text)
  - Silent notes accumulation during sessions
  - Post-session summary generation
  - Export notes and summary as .docx
- **Screen Analysis** - Capture and analyze screen content with AI
- **Session History** - Browse past sessions with conversation, screen analysis, and co-pilot notes
- **Customizable** - Themes, keybinds, layout modes, transparency
- **Cross-Platform** - Windows, macOS, Linux

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone <repository-url>
cd assistant
npm install
```

### Development

```bash
npm start
```

### Build

```bash
# Package for current platform
npm run package

# Create distributable
npm run make
```

## How It Works

### Quick Start

1. Enter your Gemini API key
2. Click **Start** to begin a live session
3. The AI listens to your conversation and provides real-time suggestions

### Co-Pilot Mode

1. Click **Prepare Session** from the main screen
2. Fill in session details:
   - **Goal** - What you want to achieve
   - **Desired Outcome** - Expected result
   - **Success Criteria** - How to measure success
   - **Key Topics** - Topics to cover during the session
   - **Reference Documents** - Upload PDFs, images, Word docs, or text files
   - **Custom Notes** - Additional context
3. Click **Start Session** to begin
4. During the session, the AI silently accumulates structured notes (key points, decisions, action items, open questions)
5. When you close the session, a **Session Summary** view appears with:
   - AI-generated summary
   - **View Notes** - See all accumulated notes
   - **Save as Document** - Export everything as a .docx file

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Electron 30.x | Desktop runtime |
| Google Gemini API | AI (live audio + HTTP API) |
| Lit 2.7.4 | Web components (no build step) |
| Marked.js | Markdown rendering |
| docx | .docx document generation |
| JSON files | Persistent storage |

## Project Structure

```
src/
├── index.js                  # Main process (IPC handlers, window management)
├── storage.js                # JSON persistence layer
├── components/
│   ├── app/
│   │   ├── AssistantApp.js   # Root component (state, routing)
│   │   └── AppHeader.js      # Header with navigation
│   └── views/
│       ├── MainView.js           # Start + Prepare buttons
│       ├── AssistantView.js      # Live AI response display
│       ├── SessionPrepView.js    # Co-Pilot setup form
│       ├── SessionSummaryView.js # Post-session summary + export
│       ├── HistoryView.js        # Session history browser
│       ├── CustomizeView.js      # Settings
│       └── HelpView.js          # Help & shortcuts
└── utils/
    ├── gemini.js             # Gemini API (live session + HTTP)
    ├── prompts.js            # Profile-based prompt templates
    ├── copilotPrompts.js     # Co-Pilot behavioral instructions
    ├── notesParser.js        # Parse structured markers from AI
    ├── notesExporter.js      # Export notes to .docx
    ├── documentParser.js     # Document text extraction (OCR)
    └── renderer.js           # Renderer process utilities
```

## Supported Document Types

For Co-Pilot reference document upload:

| Type | Extension | Method |
|------|-----------|--------|
| Plain text | .txt, .md | Direct read |
| PDF | .pdf | Gemini API OCR |
| Word | .docx, .doc | Gemini API OCR |
| Images | .png, .jpg, .jpeg | Gemini API OCR |

Max file size: 10MB