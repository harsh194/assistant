import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { RequestState, isRequestInProgress } from '../../utils/requestState.js';
import { parseResponse, mergeNotes } from '../../utils/notesParser.js';
import '../ui/RequestStatus.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
        }

        .response-container {
            height: 100%;
            overflow-y: auto;
            font-size: var(--response-font-size, 16px);
            line-height: 1.6;
            background: var(--bg-primary);
            padding: 12px;
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
        }

        .response-container * {
            user-select: text;
            cursor: text;
        }

        .response-container a {
            cursor: pointer;
        }

        /* Word display (no animation) */
        .response-container [data-word] {
            display: inline-block;
        }

        /* Markdown styling */
        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            margin: 1em 0 0.5em 0;
            color: var(--text-color);
            font-weight: 600;
        }

        .response-container h1 { font-size: 1.6em; }
        .response-container h2 { font-size: 1.4em; }
        .response-container h3 { font-size: 1.2em; }
        .response-container h4 { font-size: 1.1em; }
        .response-container h5 { font-size: 1em; }
        .response-container h6 { font-size: 0.9em; }

        .response-container p {
            margin: 0.6em 0;
            color: var(--text-color);
        }

        .response-container ul,
        .response-container ol {
            margin: 0.6em 0;
            padding-left: 1.5em;
            color: var(--text-color);
        }

        .response-container li {
            margin: 0.3em 0;
        }

        .response-container blockquote {
            margin: 0.8em 0;
            padding: 0.5em 1em;
            border-left: 2px solid var(--border-default);
            background: var(--bg-secondary);
        }

        .response-container code {
            background: var(--bg-tertiary);
            padding: 0.15em 0.4em;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.85em;
        }

        .response-container pre {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 12px;
            overflow-x: auto;
            margin: 0.8em 0;
        }

        .response-container pre code {
            background: none;
            padding: 0;
        }

        .response-container a {
            color: var(--text-color);
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .response-container strong,
        .response-container b {
            font-weight: 600;
        }

        .response-container hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 1.5em 0;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 0.8em 0;
        }

        .response-container th,
        .response-container td {
            border: 1px solid var(--border-color);
            padding: 8px;
            text-align: left;
        }

        .response-container th {
            background: var(--bg-secondary);
            font-weight: 600;
        }

        .response-container::-webkit-scrollbar {
            width: 8px;
        }

        .response-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .response-container::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        .response-container::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        .text-input-container {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            align-items: center;
        }

        .text-input-container input {
            flex: 1;
            background: transparent;
            color: var(--text-color);
            border: none;
            border-bottom: 1px solid var(--border-color);
            padding: 8px 4px;
            border-radius: 0;
            font-size: 13px;
        }

        .text-input-container input:focus {
            outline: none;
            border-bottom-color: var(--text-color);
        }

        .text-input-container input::placeholder {
            color: var(--placeholder-color);
        }

        .nav-button {
            background: transparent;
            color: var(--text-secondary);
            border: none;
            padding: 6px;
            border-radius: 3px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s ease;
        }

        .nav-button:hover {
            background: var(--hover-background);
            color: var(--text-color);
        }

        .nav-button:disabled {
            opacity: 0.3;
        }

        .nav-button svg {
            width: 18px;
            height: 18px;
            stroke: currentColor;
        }

        .response-counter {
            font-size: 11px;
            color: var(--text-muted);
            white-space: nowrap;
            min-width: 50px;
            text-align: center;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .screen-answer-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: var(--btn-primary-bg, #ffffff);
            color: var(--btn-primary-text, #000000);
            border: none;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .screen-answer-btn:hover {
            background: var(--btn-primary-hover, #f0f0f0);
        }

        .screen-answer-btn svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }


        .screen-answer-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .screen-answer-btn:disabled:hover {
            background: var(--btn-primary-bg, #ffffff);
        }

        .request-status-container {
            margin-bottom: 8px;
        }

        .input-disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        .response-wrapper {
            position: relative;
            height: calc(100% - 50px);
        }

        .copy-btn {
            position: absolute;
            top: 8px;
            right: 16px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 11px;
            color: var(--text-muted);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.15s ease;
            z-index: 10;
        }

        .response-wrapper:hover .copy-btn {
            opacity: 1;
        }

        .copy-btn:hover {
            color: var(--text-color);
            background: var(--hover-background);
        }

        /* Mode indicator bar */
        .mode-indicator {
            display: flex;
            gap: 4px;
            padding: 6px 12px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            flex-shrink: 0;
        }

        .mode-tab {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid transparent;
            padding: 4px 12px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.1s ease;
            font-family: inherit;
        }

        .mode-tab.active {
            color: var(--text-color);
            border-color: var(--border-color);
            background: var(--bg-tertiary);
        }

        .mode-tab:hover:not(.active) {
            color: var(--text-secondary);
        }

        .mode-key {
            background: var(--bg-tertiary);
            padding: 1px 5px;
            border-radius: 2px;
            font-size: 10px;
            font-family: 'SF Mono', Monaco, monospace;
            margin-left: 4px;
        }

        .peek-toggle {
            margin-left: auto;
            background: transparent;
            color: var(--text-muted);
            border: 1px solid transparent;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            font-family: inherit;
        }

        .peek-toggle.active {
            color: var(--text-secondary);
            border-color: var(--border-color);
        }

        .peek-toggle:hover {
            color: var(--text-secondary);
        }

        /* Translation container */
        .translation-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            scroll-behavior: smooth;
        }

        .translation-container::-webkit-scrollbar { width: 8px; }
        .translation-container::-webkit-scrollbar-track { background: transparent; }
        .translation-container::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }

        .translation-empty {
            color: var(--text-muted);
            font-size: 14px;
            text-align: center;
            padding: 40px 20px;
        }

        .translation-entry {
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .translation-entry:last-child {
            border-bottom: none;
        }

        .translation-speaker {
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
        }

        .translation-original {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 6px;
            user-select: text;
            cursor: text;
        }

        .translation-translated {
            font-size: var(--response-font-size, 18px);
            color: var(--text-color);
            line-height: 1.6;
            font-weight: 500;
            user-select: text;
            cursor: text;
        }

        .translation-translated.error {
            color: var(--error-color);
            font-style: italic;
            font-weight: 400;
        }

        /* Peek assistant overlay */
        .peek-overlay {
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 280px;
            max-height: 200px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            overflow: hidden;
            z-index: 20;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .peek-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;
            border-bottom: 1px solid var(--border-color);
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 500;
        }

        .peek-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 14px;
            padding: 0 2px;
            font-family: inherit;
        }

        .peek-close:hover {
            color: var(--text-color);
        }

        .peek-content {
            padding: 8px 10px;
            font-size: 12px;
            color: var(--text-color);
            line-height: 1.5;
            overflow-y: auto;
            max-height: 160px;
            user-select: text;
            cursor: text;
        }

        .translation-wrapper {
            position: relative;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
    `;

    static properties = {
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        requestState: { type: String },
        requestStartTime: { type: Number },
        elapsedTime: { type: Number },
        copilotActive: { type: Boolean },
        copilotPrep: { type: Object },
        translationEnabled: { type: Boolean },
        _copyFeedback: { state: true },
        _translationMode: { state: true },
        _translationEntries: { state: true },
        _peekAssistantEnabled: { state: true },
    };

    constructor() {
        super();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.selectedProfile = 'interview';
        this.onSendText = () => { };
        this.requestState = RequestState.IDLE;
        this.requestStartTime = null;
        this.elapsedTime = 0;
        this._elapsedTimer = null;
        this.copilotActive = false;
        this.copilotPrep = null;
        this.translationEnabled = false;
        this._lastRenderedLength = 0;
        this._copyFeedback = false;
        this._translationMode = false;
        this._translationEntries = [];
        this._peekAssistantEnabled = false;
        this._sessionNotes = { keyPoints: [], decisions: [], openQuestions: [], actionItems: [], nextSteps: [] };
        this._lastParsedResponse = '';
    }

    getSessionNotes() {
        return this._sessionNotes;
    }

    resetSessionNotes() {
        this._sessionNotes = { keyPoints: [], decisions: [], openQuestions: [], actionItems: [], nextSteps: [] };
        this._lastParsedResponse = '';
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    getCurrentResponse() {
        const profileNames = this.getProfileNames();
        return this.responses.length > 0 && this.currentResponseIndex >= 0
            ? this.responses[this.currentResponseIndex]
            : `Hey, Im listening to your ${profileNames[this.selectedProfile] || 'session'}?`;
    }

    renderMarkdown(content, skipSpanWrap = false) {
        if (typeof window !== 'undefined' && window.marked) {
            try {
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false,
                });
                let rendered = window.marked.parse(content);
                if (!skipSpanWrap) {
                    rendered = this.wrapWordsInSpans(rendered);
                }
                return rendered;
            } catch (error) {
                return content;
            }
        }
        return content;
    }

    wrapWordsInSpans(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tagsToSkip = ['PRE'];

        function wrap(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode.tagName)) {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.setAttribute('data-word', '');
                        span.textContent = word;
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(document.createTextNode(word));
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
                Array.from(node.childNodes).forEach(wrap);
            }
        }
        Array.from(doc.body.childNodes).forEach(wrap);
        return doc.body.innerHTML;
    }

    getResponseCounter() {
        return this.responses.length > 0 ? `${this.currentResponseIndex + 1}/${this.responses.length}` : '';
    }

    navigateToPreviousResponse() {
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
            this._lastRenderedLength = 0;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    navigateToNextResponse() {
        if (this.currentResponseIndex < this.responses.length - 1) {
            this.currentResponseIndex++;
            this._lastRenderedLength = 0;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    scrollResponseUp() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    scrollResponseDown() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up IPC listeners for keyboard shortcuts
        if (window.electronAPI) {
            this._cleanups = [];

            this._cleanups.push(window.electronAPI.on('navigate-previous-response', () => {
                this.navigateToPreviousResponse();
            }));

            this._cleanups.push(window.electronAPI.on('navigate-next-response', () => {
                this.navigateToNextResponse();
            }));

            this._cleanups.push(window.electronAPI.on('scroll-response-up', () => {
                this.scrollResponseUp();
            }));

            this._cleanups.push(window.electronAPI.on('scroll-response-down', () => {
                this.scrollResponseDown();
            }));

            this._cleanups.push(window.electronAPI.on('new-response', () => {
                this._lastRenderedLength = 0;
                this._setRequestState(RequestState.STREAMING);
            }));

            this._cleanups.push(window.electronAPI.on('response-complete', () => {
                this._setRequestState(RequestState.DONE);
                setTimeout(() => this._setRequestState(RequestState.IDLE), 500);
            }));

            this._cleanups.push(window.electronAPI.on('request-cancelled', () => {
                this._setRequestState(RequestState.CANCELLED);
                setTimeout(() => this._setRequestState(RequestState.IDLE), 1500);
            }));

            this._cleanups.push(window.electronAPI.on('update-status', (status) => {
                if (typeof status === 'string') {
                    const lowerStatus = status.toLowerCase();
                    if (lowerStatus.includes('listening') || lowerStatus.includes('ready')) {
                        if (this.requestState === RequestState.STREAMING) {
                            this._setRequestState(RequestState.IDLE);
                        }
                    }
                    if (lowerStatus.includes('error')) {
                        this._setRequestState(RequestState.ERROR);
                        setTimeout(() => this._setRequestState(RequestState.IDLE), 2000);
                    }
                }
            }));

            // Translation result listener
            this._cleanups.push(window.electronAPI.on('translation-result', (data) => {
                const MAX_ENTRIES = 500;
                const updated = [...this._translationEntries, data];
                this._translationEntries = updated.length > MAX_ENTRIES ? updated.slice(-MAX_ENTRIES) : updated;
                if (this._translationMode) {
                    this.scrollTranslationToBottom();
                }
            }));
        }

        // Keyboard shortcuts for translation mode switching
        this._modeKeydownHandler = (e) => {
            if (!this.translationEnabled) return;

            // Don't intercept when input/textarea/contenteditable is focused
            const activeEl = this.shadowRoot?.activeElement || document.activeElement;
            const isInputFocused = activeEl && (
                activeEl.tagName === 'INPUT' ||
                activeEl.tagName === 'TEXTAREA' ||
                activeEl.isContentEditable
            );
            if (isInputFocused) return;

            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                this._translationMode = true;
            } else if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                this._translationMode = false;
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this._translationMode = !this._translationMode;
            } else if ((e.key === 'p' || e.key === 'P') && this._translationMode) {
                e.preventDefault();
                this._peekAssistantEnabled = !this._peekAssistantEnabled;
            }
        };
        document.addEventListener('keydown', this._modeKeydownHandler);

        // Reset translation state for new session and default to translation mode
        if (this.translationEnabled) {
            this._translationMode = true;
            this._translationEntries = [];
            this._peekAssistantEnabled = false;
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Clean up elapsed timer
        if (this._elapsedTimer) {
            clearInterval(this._elapsedTimer);
            this._elapsedTimer = null;
        }

        // Clean up IPC listeners
        if (this._cleanups) {
            this._cleanups.forEach(cleanup => cleanup && cleanup());
            this._cleanups = [];
        }

        // Clean up translation keyboard handler
        if (this._modeKeydownHandler) {
            document.removeEventListener('keydown', this._modeKeydownHandler);
            this._modeKeydownHandler = null;
        }
    }

    _setRequestState(state) {
        this.requestState = state;

        if (state === RequestState.THINKING || state === RequestState.SENDING) {
            this.requestStartTime = Date.now();
            this._startElapsedTimer();
        } else if (state === RequestState.DONE || state === RequestState.ERROR || state === RequestState.CANCELLED || state === RequestState.IDLE) {
            this._stopElapsedTimer();
            this.elapsedTime = 0;
            this.requestStartTime = null;
        }

        this.requestUpdate();
    }

    _startElapsedTimer() {
        if (this._elapsedTimer) {
            clearInterval(this._elapsedTimer);
        }
        this._elapsedTimer = setInterval(() => {
            if (this.requestStartTime) {
                this.elapsedTime = Date.now() - this.requestStartTime;
                this.requestUpdate();
            }
        }, 1000);
    }

    _stopElapsedTimer() {
        if (this._elapsedTimer) {
            clearInterval(this._elapsedTimer);
            this._elapsedTimer = null;
        }
    }

    _handleCancelRequest() {
        // Immediately set state to cancelled for responsive UI
        this._setRequestState(RequestState.CANCELLED);

        if (window.electronAPI) {
            window.electronAPI.invoke('cancel-current-request').then(() => {
                setTimeout(() => this._setRequestState(RequestState.IDLE), 500);
            }).catch((error) => {
                console.error('Error cancelling request:', error);
                this._setRequestState(RequestState.IDLE);
            });
        } else {
            setTimeout(() => this._setRequestState(RequestState.IDLE), 500);
        }
    }

    _isRequestInProgress() {
        return isRequestInProgress(this.requestState);
    }

    async handleCopyResponse() {
        const currentResponse = this.getCurrentResponse();
        try {
            await navigator.clipboard.writeText(currentResponse);
            this._copyFeedback = true;
            setTimeout(() => { this._copyFeedback = false; }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            textInput.value = ''; // Clear input

            // Set thinking state before sending
            this._setRequestState(RequestState.THINKING);

            const result = await assistant.sendTextMessage(message);

            if (!result.success) {
                this._setRequestState(RequestState.ERROR);
                setTimeout(() => this._setRequestState(RequestState.IDLE), 2000);
            }
            // Note: Success state transitions are handled by IPC events (new-response -> STREAMING -> DONE)
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    async handleScreenAnswer() {
        // Prevent multiple clicks while processing
        if (this._isRequestInProgress()) {
            return;
        }

        if (window.captureManualScreenshot) {
            // Set thinking state before capturing
            this._setRequestState(RequestState.THINKING);

            window.captureManualScreenshot();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.response-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    scrollTranslationToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.translation-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateResponseContent();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex')) {
            this.updateResponseContent();
        }
    }

    updateResponseContent() {
        const container = this.shadowRoot.querySelector('#responseContainer');
        if (!container) return;

        const currentResponse = this.getCurrentResponse();
        const isStreaming = this.requestState === RequestState.STREAMING;
        let displayText = currentResponse;

        // Defer co-pilot notes parsing to completion - regex is expensive per chunk
        if (this.copilotActive && currentResponse && !isStreaming) {
            const parsed = parseResponse(currentResponse);
            displayText = parsed.cleanText;

            if (parsed.notes && currentResponse !== this._lastParsedResponse) {
                this._lastParsedResponse = currentResponse;
                this._sessionNotes = mergeNotes(this._sessionNotes, parsed.notes);
                this.dispatchEvent(new CustomEvent('notes-updated', {
                    detail: { notes: this._sessionNotes },
                    bubbles: true,
                    composed: true,
                }));
            }
        }

        if (isStreaming && displayText && displayText.length > this._lastRenderedLength) {
            const renderedResponse = this.renderMarkdown(displayText, true);
            container.innerHTML = renderedResponse;
            this._lastRenderedLength = displayText.length;
        } else if (!isStreaming) {
            const renderedResponse = this.renderMarkdown(displayText || '');
            container.innerHTML = renderedResponse;
            this._lastRenderedLength = 0;
        }

        if (this.shouldAnimateResponse) {
            this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
        }
    }

    renderModeIndicator() {
        return html`
            <div class="mode-indicator">
                <button
                    class="mode-tab ${!this._translationMode ? 'active' : ''}"
                    @click=${() => { this._translationMode = false; }}>
                    Assistant <span class="mode-key">A</span>
                </button>
                <button
                    class="mode-tab ${this._translationMode ? 'active' : ''}"
                    @click=${() => { this._translationMode = true; }}>
                    Translation <span class="mode-key">T</span>
                </button>
                ${this._translationMode ? html`
                    <button
                        class="peek-toggle ${this._peekAssistantEnabled ? 'active' : ''}"
                        @click=${() => { this._peekAssistantEnabled = !this._peekAssistantEnabled; }}>
                        Peek <span class="mode-key">P</span>
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderPeekAssistant() {
        const latestResponse = this.getCurrentResponse();
        // Truncate for the peek view
        const truncated = latestResponse.length > 300 ? latestResponse.substring(0, 300) + '...' : latestResponse;
        return html`
            <div class="peek-overlay">
                <div class="peek-header">
                    <span>Assistant</span>
                    <button class="peek-close" @click=${() => { this._peekAssistantEnabled = false; }}>x</button>
                </div>
                <div class="peek-content">${truncated}</div>
            </div>
        `;
    }

    renderTranslationMode() {
        return html`
            ${this.renderModeIndicator()}
            <div class="translation-wrapper">
                <div class="translation-container">
                    ${this._translationEntries.length === 0
                        ? html`<div class="translation-empty">Listening for speech to translate...</div>`
                        : this._translationEntries.map(entry => html`
                            <div class="translation-entry">
                                ${entry.speaker ? html`<span class="translation-speaker">${entry.speaker}</span>` : ''}
                                <div class="translation-original">${entry.original}</div>
                                <div class="translation-translated ${entry.error ? 'error' : ''}">${entry.translated}</div>
                            </div>
                        `)
                    }
                </div>
                ${this._peekAssistantEnabled ? this.renderPeekAssistant() : ''}
            </div>
        `;
    }

    renderAssistantMode() {
        const responseCounter = this.getResponseCounter();
        const inProgress = this._isRequestInProgress();

        return html`
            ${this.translationEnabled ? this.renderModeIndicator() : ''}

            <div class="response-wrapper">
                <button class="copy-btn" @click=${this.handleCopyResponse}>
                    ${this._copyFeedback ? 'Copied!' : 'Copy'}
                </button>
                <div class="response-container" id="responseContainer"></div>
            </div>

            ${inProgress ? html`
                <div class="request-status-container">
                    <request-status
                        .state=${this.requestState}
                        .elapsedTime=${this.elapsedTime}
                        @cancel=${this._handleCancelRequest}
                    ></request-status>
                </div>
            ` : ''}

            <div class="text-input-container">
                <button class="nav-button" @click=${this.navigateToPreviousResponse} ?disabled=${this.currentResponseIndex <= 0}>
                    <svg width="24px" height="24px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>

                ${this.responses.length > 0 ? html`<span class="response-counter">${responseCounter}</span>` : ''}

                <button class="nav-button" @click=${this.navigateToNextResponse} ?disabled=${this.currentResponseIndex >= this.responses.length - 1}>
                    <svg width="24px" height="24px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>

                <input
                    type="text"
                    id="textInput"
                    placeholder="${inProgress ? 'Processing...' : 'Type a message to the AI...'}"
                    @keydown=${this.handleTextKeydown}
                    ?disabled=${inProgress}
                    class="${inProgress ? 'input-disabled' : ''}"
                />

                <button class="screen-answer-btn" @click=${this.handleScreenAnswer} ?disabled=${inProgress}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                    </svg>
                    <span>${inProgress ? 'Processing...' : 'Analyze screen'}</span>
                </button>
            </div>
        `;
    }

    render() {
        if (!this.translationEnabled) {
            return this.renderAssistantMode();
        }

        if (this._translationMode) {
            return this.renderTranslationMode();
        }

        return this.renderAssistantMode();
    }
}

customElements.define('assistant-view', AssistantView);
