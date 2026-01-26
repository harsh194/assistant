# Requirements Specification: AI Assistant

## 1. Product Overview

The **AI Assistant** is a desktop application designed to augment human performance during high-stakes interactions such as interviews, meetings, sales calls, and exams. Built on the Electron framework and powered by Google's Gemini 2.5 multimodal models, it acts as a real-time co-pilot that listens, sees, and assists.

## 2. Background and Pain Points

In the modern digital workspace, professionals face several critical challenges:

| Pain Point | Description |
|------------|-------------|
| **Information Overload** | Participants struggle to listen, process, and respond simultaneously |
| **Context Switching** | Breaking flow to search for information reduces effectiveness |
| **Language Barriers** | Global teams struggle with real-time multilingual communication |
| **Lost Details** | Important points and action items are frequently missed |
| **Preparation Gaps** | Insufficient preparation for interviews, sales calls, or presentations |

## 3. Primary Objectives

- **Real-time Intelligence**: Provide immediate, context-aware assistance without disrupting conversation flow
- **Multi-Profile Support**: Adapt response style to different scenarios (interviews, sales, meetings, etc.)
- **Privacy-First Design**: Keep user data local with secure credential storage
- **Cross-Platform**: Support Windows, macOS, and Linux environments
- **Low Latency**: Maintain sub-second response times for natural interaction

## 4. Functional Requirements

### 4.1. Implemented Requirements (v0.5.0)

#### Core Audio Features
| ID | Requirement | Status |
|----|-------------|--------|
| FR-01 | Real-time microphone audio streaming to Gemini via WebSocket | ✅ Implemented |
| FR-02 | System audio capture and analysis (macOS only) | ✅ Implemented |
| FR-03 | Speaker diarization (Interviewer vs. Candidate) | ✅ Implemented |
| FR-04 | Native audio response from Gemini (speech output) | ✅ Implemented |
| FR-05 | Automatic session reconnection with context restoration | ✅ Implemented |

#### Visual Features
| ID | Requirement | Status |
|----|-------------|--------|
| FR-06 | Screen capture and image analysis | ✅ Implemented |
| FR-07 | Streaming response display with markdown formatting | ✅ Implemented |
| FR-08 | Code syntax highlighting in responses | ✅ Implemented |

#### Assistant Profiles
| ID | Requirement | Status |
|----|-------------|--------|
| FR-09 | Interview profile with STAR method responses | ✅ Implemented |
| FR-10 | Sales profile with value-focused messaging | ✅ Implemented |
| FR-11 | Meeting profile with action-oriented language | ✅ Implemented |
| FR-12 | Presentation profile with confident delivery | ✅ Implemented |
| FR-13 | Negotiation profile with strategic responses | ✅ Implemented |
| FR-14 | Exam profile with direct, efficient answers | ✅ Implemented |

#### Tool Integration
| ID | Requirement | Status |
|----|-------------|--------|
| FR-15 | Google Search integration for real-time information | ✅ Implemented |
| FR-16 | Custom user context injection into prompts | ✅ Implemented |
| FR-17 | Toggleable tool enable/disable | ✅ Implemented |

#### Session Management
| ID | Requirement | Status |
|----|-------------|--------|
| FR-18 | Conversation history tracking with timestamps | ✅ Implemented |
| FR-19 | Session persistence and restoration | ✅ Implemented |
| FR-20 | Screen analysis history tracking | ✅ Implemented |
| FR-21 | Session deletion (individual and bulk) | ✅ Implemented |

#### Configuration & Storage
| ID | Requirement | Status |
|----|-------------|--------|
| FR-22 | OS-specific config directory storage | ✅ Implemented |
| FR-23 | API key secure storage | ✅ Implemented |
| FR-24 | User preferences persistence | ✅ Implemented |
| FR-25 | Custom keybind configuration | ✅ Implemented |
| FR-26 | Rate limiting with daily usage tracking | ✅ Implemented |
| FR-27 | Automatic model fallback when limits exceeded | ✅ Implemented |

### 4.2. Planned Requirements (Future Releases)

#### Knowledge Management (RAG)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-P01 | Custom document ingestion (PDF, DOCX, TXT) | High |
| FR-P02 | Local vector store for semantic search | High |
| FR-P03 | RAG-powered contextual retrieval | High |

#### Productivity Features
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-P04 | Live language translation and subtitles | Medium |
| FR-P05 | Automated action item extraction | Medium |
| FR-P06 | Calendar integration (Google, Outlook) | Medium |
| FR-P07 | Proactive context-aware suggestions | Low |
| FR-P08 | Voice-triggered note capture | Low |

#### Platform Expansion
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-P09 | System audio capture for Windows | High |
| FR-P10 | System audio capture for Linux | Medium |

## 5. Non-Functional Requirements

### 5.1. Performance
| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NFR-01 | Audio-to-response latency | < 2 seconds | ✅ Met |
| NFR-02 | Screen analysis response time | < 5 seconds | ✅ Met |
| NFR-03 | App startup time | < 3 seconds | ✅ Met |
| NFR-04 | Memory usage (idle) | < 200 MB | ✅ Met |

### 5.2. Security & Privacy
| ID | Requirement | Status |
|----|-------------|--------|
| NFR-05 | Local-only data storage (no cloud sync) | ✅ Implemented |
| NFR-06 | API key stored in OS-specific secure location | ✅ Implemented |
| NFR-07 | No telemetry or usage data collection | ✅ Implemented |
| NFR-08 | Context isolation enabled for renderer | ✅ Implemented |

### 5.3. Compatibility
| ID | Requirement | Status |
|----|-------------|--------|
| NFR-09 | Windows 10/11 support | ✅ Supported |
| NFR-10 | macOS 12+ support (full features) | ✅ Supported |
| NFR-11 | Linux support (Debian, Fedora, AppImage) | ✅ Supported |

### 5.4. Reliability
| ID | Requirement | Status |
|----|-------------|--------|
| NFR-12 | Automatic reconnection on network failure | ✅ Implemented |
| NFR-13 | Context preservation across reconnections | ✅ Implemented |
| NFR-14 | Graceful degradation when API limits reached | ✅ Implemented |

## 6. User Interface Requirements

### 6.1. Views
| View | Purpose | Status |
|------|---------|--------|
| Main | Chat interface with streaming responses | ✅ Implemented |
| History | View and manage past sessions | ✅ Implemented |
| Customize | Settings, profile selection, keybinds | ✅ Implemented |
| Help | Onboarding and documentation | ✅ Implemented |
| Onboarding | First-time setup wizard | ✅ Implemented |

### 6.2. Customization Options
| Option | Description | Status |
|--------|-------------|--------|
| Font Size | Small, Medium, Large | ✅ Implemented |
| Background Transparency | 0-100% opacity | ✅ Implemented |
| Audio Mode | Speaker only, Mic + Speaker | ✅ Implemented |
| Screenshot Interval | Configurable capture frequency | ✅ Implemented |
| Image Quality | Low, Medium, High | ✅ Implemented |
| Window Size | Resizable with persistence | ✅ Implemented |

## 7. API Usage Limits

| Model | Daily Limit | Fallback |
|-------|-------------|----------|
| `gemini-2.5-flash` | 20 requests | Switch to flash-lite |
| `gemini-2.5-flash-lite` | 20 requests | Return to flash (paid users) |

---

*Last Updated: 2026-01-26*
