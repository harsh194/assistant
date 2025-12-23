![AI Assistant Banner](assets/assistant.png)

# AI Assistant

A powerful, real-time AI assistant designed to provide contextual help during video calls, interviews, presentations, and meetings. By leveraging screen capture and audio analysis, it understands your current context and offers relevant support instantly.

## 🌟 Features

-   **Live AI Assistance**: Powered by the cutting-edge **Google Gemini** model for rapid, accurate responses.
-   **Contextual Awareness**: Analyzes both **screen content** and **system/microphone audio** to understand what is happening in real-time.
-   **Specialized Profiles**: Tailored modes for various scenarios:
    -   Interview
    -   Sales Call
    -   Business Meeting
    -   Presentation
    -   Negotiation
    -   Exam Assistant

-   **Unobtrusive Overlay**: An always-on-top window that integrates seamlessly into your workflow.
-   **Interactive & Passive Modes**: Toggle "Click-through Mode" to interact with windows behind the assistant.
-   **Cross-Platform Core**: Built on Electron for macOS and Windows.

## 🛠️ Tech Stack

-   **Runtime**: Electron
-   **AI Model**: Google Gemini 
-   **Language**: JavaScript/Node.js

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (Latest LTS recommended)
-   **npm** (comes with Node.js)
-   A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/apikey))
-   **FFmpeg** (Ensure it is installed and in your system PATH, mostly for Linux/macOS audio handling if needed)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/harsh194/assistant.git
    cd assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the application**
    ```bash
    npm start
    ```

## 📖 Usage

1.  **Launch the App**: Run `npm start`.
2.  **Configure API Key**: Enter your Google Gemini API Key in the main window input field.
3.  **Select Profile**: Go to settings and choose the profile that matches your current activity (e.g., *Interview*).
4.  **Start Session**: Click **"Start Session"**.
5.  **Position Overlay**: Use the keyboard shortcuts to move the assistant window to a convenient spot on your screen.
6.  **Receive Help**: The AI will listen and watch your screen, providing real-time text assistance based on the conversation and visual context.

## ⌨️ Keyboard Shortcuts

| Action | Shortcut | Description |
| :--- | :--- | :--- |
| **Move Window** | `Ctrl`/`Cmd` + `Arrow Keys` | Move the overlay window around the screen. |
| **Toggle Click-through** | `Ctrl`/`Cmd` + `M` | Toggle mouse events (pass clicks through the window). |
| **Close / Back** | `Ctrl`/`Cmd` + `\` | Close the window or navigate back. |
| **Send Message** | `Enter` | Send typed text to the AI manually. |



## 📄 License

This project is licensed under the **MIT License**.

## 👤 Author

**Harsh Ranjan**
-   Email: harshranjan194@gmail.com

---

