import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AppHeader extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
        }

        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: var(--header-padding);
            background: var(--header-background);
            border-bottom: 1px solid var(--border-color);
        }

        .header-title {
            flex: 1;
            font-size: var(--header-font-size);
            font-weight: 500;
            color: var(--text-color);
            -webkit-app-region: drag;
        }

        .header-actions {
            display: flex;
            gap: var(--header-gap);
            align-items: center;
            -webkit-app-region: no-drag;
        }

        .header-actions span {
            font-size: var(--header-font-size-small);
            color: var(--text-secondary);
        }

        .button {
            background: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: var(--header-button-padding);
            border-radius: 3px;
            font-size: var(--header-font-size-small);
            font-weight: 500;
            transition: background 0.1s ease;
        }

        .button:hover {
            background: var(--hover-background);
        }

        .icon-button {
            background: transparent;
            color: var(--text-secondary);
            border: none;
            padding: var(--header-icon-padding);
            border-radius: 3px;
            font-size: var(--header-font-size-small);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s ease;
        }

        .icon-button svg {
            width: var(--icon-size);
            height: var(--icon-size);
        }

        .icon-button:hover {
            background: var(--hover-background);
            color: var(--text-color);
        }

        :host([isclickthrough]) .button:hover,
        :host([isclickthrough]) .icon-button:hover {
            background: transparent;
        }

        .key {
            background: var(--key-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .click-through-indicator {
            font-size: 10px;
            color: var(--text-muted);
            background: var(--key-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, monospace;
        }

    `;

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        onCustomizeClick: { type: Function },
        onHelpClick: { type: Function },
        onHistoryClick: { type: Function },
        onCloseClick: { type: Function },
        onBackClick: { type: Function },
        onHideToggleClick: { type: Function },
        isClickThrough: { type: Boolean, reflect: true },
        updateAvailable: { type: Boolean },
        toggleVisibilityKeybind: { type: String },
    };

    constructor() {
        super();
        this.currentView = 'main';
        this.statusText = '';
        this.startTime = null;
        this.onCustomizeClick = () => { };
        this.onHelpClick = () => { };
        this.onHistoryClick = () => { };
        this.onCloseClick = () => { };
        this.onBackClick = () => { };
        this.onHideToggleClick = () => { };
        this.isClickThrough = false;
        this.updateAvailable = false;
        this.toggleVisibilityKeybind = assistant.isMacOS ? 'Cmd+\\' : 'Ctrl+\\';
        this._timerInterval = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        this._startTimer();
        this._checkForUpdates();
        await this._loadKeybinds();
        this._setupKeybindListener();
    }

    _setupKeybindListener() {
        // Listen for keybind updates from settings
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('keybinds-updated', async () => {
                await this._loadKeybinds();
            });
        }
    }

    async _loadKeybinds() {
        try {
            const result = await assistant.storage.getKeybinds();
            if (result && result.toggleVisibility) {
                this.toggleVisibilityKeybind = result.toggleVisibility;
            }
        } catch (error) {
            console.error('Failed to load keybinds:', error);
        }
    }

    _parseKeybind(keybind) {
        // Parse keybind string like "Cmd+\\" or "Ctrl+Alt+K" into array of keys
        if (!keybind) return [];
        return keybind.split('+').map(key => key.trim());
    }

    _renderKeybind(keybind) {
        const keys = this._parseKeybind(keybind);
        return keys.map((key, index) => html`
            ${index > 0 ? html`&nbsp;&nbsp;` : ''}
            <span class="key" style="pointer-events: none;">${key}</span>
        `);
    }

    async _checkForUpdates() {
        try {
            const currentVersion = await assistant.getVersion();
            const response = await fetch('https://raw.githubusercontent.com/sohzm/cheating-daddy/refs/heads/master/package.json');
            if (!response.ok) return;

            const remotePackage = await response.json();
            const remoteVersion = remotePackage.version;

            if (this._isNewerVersion(remoteVersion, currentVersion)) {
                this.updateAvailable = true;
            }
        } catch (err) {
            console.log('Update check failed:', err.message);
        }
    }

    _isNewerVersion(remote, current) {
        const remoteParts = remote.split('.').map(Number);
        const currentParts = current.split('.').map(Number);

        for (let i = 0; i < Math.max(remoteParts.length, currentParts.length); i++) {
            const r = remoteParts[i] || 0;
            const c = currentParts[i] || 0;
            if (r > c) return true;
            if (r < c) return false;
        }
        return false;
    }

    async _openUpdatePage() {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('open-external', 'https://cheatingdaddy.com');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopTimer();
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Start/stop timer based on view change
        if (changedProperties.has('currentView')) {
            if (this.currentView === 'assistant' && this.startTime) {
                this._startTimer();
            } else {
                this._stopTimer();
            }
        }

        // Start timer when startTime is set
        if (changedProperties.has('startTime')) {
            if (this.startTime && this.currentView === 'assistant') {
                this._startTimer();
            } else if (!this.startTime) {
                this._stopTimer();
            }
        }
    }

    _startTimer() {
        // Clear any existing timer
        this._stopTimer();

        // Only start timer if we're in assistant view and have a start time
        if (this.currentView === 'assistant' && this.startTime) {
            this._timerInterval = setInterval(() => {
                // Trigger a re-render by requesting an update
                this.requestUpdate();
            }, 1000); // Update every second
        }
    }

    _stopTimer() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    getViewTitle() {
        const titles = {
            onboarding: 'Welcome to Assistant',
            main: 'Assistant',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            history: 'Conversation History',
            advanced: 'Advanced Tools',
            assistant: 'Assistant',
            'session-prep': 'Session Prep',
            'session-summary': 'Session Summary',
        };
        return titles[this.currentView] || 'Assistant';
    }

    getElapsedTime() {
        if (this.currentView === 'assistant' && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            if (elapsed >= 60) {
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                return `${minutes}m ${seconds}s`;
            }
            return `${elapsed}s`;
        }
        return '';
    }

    isNavigationView() {
        const navigationViews = ['customize', 'help', 'history', 'advanced', 'session-prep', 'session-summary'];
        return navigationViews.includes(this.currentView);
    }

    render() {
        const elapsedTime = this.getElapsedTime();

        return html`
            <div class="header">
                <div class="header-title">${this.getViewTitle()}</div>
                <div class="header-actions">
                    ${this.currentView === 'assistant'
                ? html`
                              <span>${elapsedTime}</span>
                              <span>${this.statusText}</span>
                              ${this.isClickThrough ? html`<span class="click-through-indicator">click-through</span>` : ''}
                              <button class="icon-button" @click=${this.onHistoryClick} title="History">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${this.onCustomizeClick} title="Settings">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${this.onHelpClick} title="Help">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                          `
                : ''}
                    ${this.currentView === 'main'
                ? html`
                              ${this.updateAvailable ? html`
                                  <button class="update-button" @click=${this._openUpdatePage}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                          <path fill-rule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clip-rule="evenodd" />
                                      </svg>
                                      Update available
                                  </button>
                              ` : ''}
                              <button class="icon-button" @click=${this.onHistoryClick} title="History">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${this.onCustomizeClick} title="Settings">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${this.onHelpClick} title="Help">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                          `
                : ''}
                    ${this.currentView === 'assistant'
                ? html`
                              <button @click=${this.onHideToggleClick} class="button">
                                  Hide&nbsp;&nbsp;${this._renderKeybind(this.toggleVisibilityKeybind)}
                              </button>
                              <button @click=${this.onCloseClick} class="icon-button window-close" title="End Session">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                  </svg>
                              </button>
                          `
                : this.isNavigationView()
                ? html`
                              <button @click=${this.onBackClick} class="icon-button" title="Back to Home">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
                                  </svg>
                              </button>
                              <button @click=${this.onCloseClick} class="icon-button window-close" title="Quit App">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                  </svg>
                              </button>
                          `
                : html`
                              <button @click=${this.onCloseClick} class="icon-button window-close" title="Quit App">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                  </svg>
                              </button>
                          `}
                </div>
            </div>
        `;
    }
}

customElements.define('app-header', AppHeader);
