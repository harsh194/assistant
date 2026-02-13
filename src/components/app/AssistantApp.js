import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { AppHeader } from './AppHeader.js';
import { MainView } from '../views/MainView.js';
import { CustomizeView } from '../views/CustomizeView.js';
import { HelpView } from '../views/HelpView.js';
import { HistoryView } from '../views/HistoryView.js';
import { AssistantView } from '../views/AssistantView.js';
import { OnboardingView } from '../views/OnboardingView.js';
import { SessionPrepView } from '../views/SessionPrepView.js';
import { SessionSummaryView } from '../views/SessionSummaryView.js';

export class AssistantApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0px;
            padding: 0px;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: var(--background-transparent);
            color: var(--text-color);
        }

        .window-container {
            height: 100vh;
            overflow: hidden;
            background: var(--bg-primary);
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .main-content {
            flex: 1;
            padding: var(--main-content-padding);
            overflow-y: auto;
            background: var(--main-content-background);
        }

        .main-content.with-border {
            border-top: none;
        }

        .main-content.assistant-view {
            padding: 12px;
        }

        .main-content.onboarding-view {
            padding: 0;
            background: transparent;
        }

        .main-content.settings-view,
        .main-content.help-view,
        .main-content.history-view {
            padding: 0;
        }

        .view-container {
            opacity: 1;
            height: 100%;
        }

        .view-container.entering {
            opacity: 0;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }
    `;

    static properties = {
        currentView: { type: String },
        previousView: { type: String, state: true },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        windowWidth: { type: Number },
        windowHeight: { type: Number },
        _viewInstances: { type: Object, state: true },
        _isClickThrough: { state: true },
        _awaitingNewResponse: { state: true },
        shouldAnimateResponse: { type: Boolean },
        _storageLoaded: { state: true },
        copilotActive: { type: Boolean },
        copilotPrep: { type: Object },
        accumulatedNotes: { type: Object },
        translationEnabled: { type: Boolean },
    };

    constructor() {
        super();
        // Set defaults - will be overwritten by storage
        this.currentView = 'main'; // Will check onboarding after storage loads
        this.previousView = 'main';
        this.statusText = '';
        this.startTime = null;
        this.isRecording = false;
        this.sessionActive = false;
        this.selectedProfile = 'interview';
        this.selectedLanguage = 'en-US';
        this.selectedScreenshotInterval = '5';
        this.selectedImageQuality = 'medium';
        this.layoutMode = 'normal';
        this.windowWidth = 500;
        this.windowHeight = 600;
        this.responses = [];
        this.currentResponseIndex = -1;
        this._viewInstances = new Map();
        this._isClickThrough = false;
        this._awaitingNewResponse = false;
        this._currentResponseIsComplete = true;
        this.shouldAnimateResponse = false;
        this._storageLoaded = false;
        this.copilotActive = false;
        this.copilotPrep = null;
        this.accumulatedNotes = { keyPoints: [], decisions: [], openQuestions: [], actionItems: [], nextSteps: [] };
        this._copilotSessionId = null;
        this.translationEnabled = false;

        // Load from storage
        this._loadFromStorage();
    }

    async _loadFromStorage() {
        try {
            const [config, prefs] = await Promise.all([
                assistant.storage.getConfig(),
                assistant.storage.getPreferences()
            ]);

            // Check onboarding status
            this.currentView = config.onboarded ? 'main' : 'onboarding';

            // Apply background appearance (color + transparency)
            this.applyBackgroundAppearance(
                prefs.backgroundColor ?? '#1e1e1e',
                prefs.backgroundTransparency ?? 0.8
            );

            // Load preferences
            this.selectedProfile = prefs.selectedProfile || 'interview';
            this.selectedLanguage = prefs.selectedLanguage || 'en-US';
            this.selectedScreenshotInterval = prefs.selectedScreenshotInterval || '5';
            this.selectedImageQuality = prefs.selectedImageQuality || 'medium';
            this.layoutMode = config.layout || 'normal';
            this.windowWidth = prefs.windowWidth || 500;
            this.windowHeight = prefs.windowHeight || 600;

            this._storageLoaded = true;
            this.updateLayoutMode();
            this.requestUpdate();
        } catch (error) {
            console.error('Error loading from storage:', error);
            this._storageLoaded = true;
            this.requestUpdate();
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 30, g: 30, b: 30 };
    }

    lightenColor(rgb, amount) {
        return {
            r: Math.min(255, rgb.r + amount),
            g: Math.min(255, rgb.g + amount),
            b: Math.min(255, rgb.b + amount)
        };
    }

    applyBackgroundAppearance(backgroundColor, alpha) {
        const root = document.documentElement;
        const baseRgb = this.hexToRgb(backgroundColor);

        // Generate color variants based on the base color
        const secondary = this.lightenColor(baseRgb, 7);
        const tertiary = this.lightenColor(baseRgb, 15);
        const hover = this.lightenColor(baseRgb, 20);

        root.style.setProperty('--header-background', `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`);
        root.style.setProperty('--main-content-background', `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`);
        root.style.setProperty('--bg-primary', `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`);
        root.style.setProperty('--bg-secondary', `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${alpha})`);
        root.style.setProperty('--bg-tertiary', `rgba(${tertiary.r}, ${tertiary.g}, ${tertiary.b}, ${alpha})`);
        root.style.setProperty('--bg-hover', `rgba(${hover.r}, ${hover.g}, ${hover.b}, ${alpha})`);
        root.style.setProperty('--input-background', `rgba(${tertiary.r}, ${tertiary.g}, ${tertiary.b}, ${alpha})`);
        root.style.setProperty('--input-focus-background', `rgba(${tertiary.r}, ${tertiary.g}, ${tertiary.b}, ${alpha})`);
        root.style.setProperty('--hover-background', `rgba(${hover.r}, ${hover.g}, ${hover.b}, ${alpha})`);
        root.style.setProperty('--scrollbar-background', `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`);
    }

    // Keep old function name for backwards compatibility
    applyBackgroundTransparency(alpha) {
        this.applyBackgroundAppearance('#1e1e1e', alpha);
    }

    connectedCallback() {
        super.connectedCallback();

        // Apply layout mode to document root
        this.updateLayoutMode();

        // Set up IPC listeners
        if (window.electronAPI) {
            this._cleanups = [];
            this._cleanups.push(window.electronAPI.on('new-response', (response) => {
                this.addNewResponse(response);
            }));
            this._cleanups.push(window.electronAPI.on('update-response', (response) => {
                this.updateCurrentResponse(response);
            }));
            this._cleanups.push(window.electronAPI.on('update-status', (status) => {
                this.setStatus(status);
            }));
            this._cleanups.push(window.electronAPI.on('click-through-toggled', (isEnabled) => {
                this._isClickThrough = isEnabled;
            }));
            this._cleanups.push(window.electronAPI.on('reconnect-failed', (data) => {
                this.addNewResponse(data.message);
            }));
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._cleanups) {
            this._cleanups.forEach(cleanup => cleanup && cleanup());
            this._cleanups = [];
        }
    }

    setStatus(text) {
        this.statusText = text;

        // Mark response as complete when we get certain status messages
        if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
            this._currentResponseIsComplete = true;
        }
    }

    addNewResponse(response) {
        this.responses = [...this.responses, response];
        this.currentResponseIndex = this.responses.length - 1;
        this._awaitingNewResponse = false;
        this.requestUpdate();
    }

    updateCurrentResponse(response) {
        if (this.responses.length > 0) {
            this.responses[this.responses.length - 1] = response;
            this.responses = [...this.responses];
        } else {
            this.addNewResponse(response);
        }
    }

    // Header event handlers
    handleCustomizeClick() {
        this.previousView = this.currentView;
        this.currentView = 'customize';
        this.requestUpdate();
    }

    handleHelpClick() {
        this.previousView = this.currentView;
        this.currentView = 'help';
        this.requestUpdate();
    }

    handleHistoryClick() {
        this.previousView = this.currentView;
        this.currentView = 'history';
        this.requestUpdate();
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || this.currentView === 'history') {
            this.currentView = 'main';
        } else if (this.currentView === 'assistant') {
            // Grab accumulated notes from the assistant view before closing
            const assistantView = this.shadowRoot.querySelector('assistant-view');
            if (assistantView && this.copilotActive) {
                this.accumulatedNotes = assistantView.getSessionNotes();
            }

            assistant.stopCapture();

            // Disable translation
            if (this.translationEnabled) {
                this.translationEnabled = false;
                window.electronAPI.invoke('translation:set-config', { enabled: false }).catch(() => {});
            }

            // Close the session and save co-pilot data if active
            if (window.electronAPI) {
                // Save co-pilot data to the session before closing
                if (this.copilotActive) {
                    const sessionData = await window.electronAPI.invoke('get-current-session');
                    if (sessionData.success && sessionData.data.sessionId) {
                        this._copilotSessionId = sessionData.data.sessionId;
                        await assistant.storage.saveSession(sessionData.data.sessionId, {
                            copilotPrep: this.copilotPrep,
                            sessionNotes: this.accumulatedNotes,
                        });
                    }
                }

                await window.electronAPI.invoke('close-session');
            }
            this.sessionActive = false;

            // Navigate to summary view for co-pilot sessions, otherwise back to main
            if (this.copilotActive) {
                this.currentView = 'session-summary';
            } else {
                this.currentView = 'main';
            }
            console.log('Session closed');
        } else if (this.currentView === 'session-summary') {
            // Save summary to session history before leaving
            const summaryView = this.shadowRoot.querySelector('session-summary-view');
            if (summaryView && this._copilotSessionId && summaryView._summary) {
                await assistant.storage.saveSession(this._copilotSessionId, {
                    summary: summaryView._summary,
                });
            }

            // Done viewing summary, reset co-pilot state and go to main
            this.copilotActive = false;
            this.copilotPrep = null;
            this.accumulatedNotes = { keyPoints: [], decisions: [], openQuestions: [], actionItems: [], nextSteps: [] };
            this._copilotSessionId = null;
            this.currentView = 'main';
        } else {
            // Quit the entire application
            if (window.electronAPI) {
                await window.electronAPI.invoke('quit-application');
            }
        }
    }

    async handleHideToggle() {
        if (window.electronAPI) {
            await window.electronAPI.invoke('toggle-window-visibility');
        }
    }

    // Main view event handlers
    async handleStart() {
        // check if api key is empty do nothing
        const apiKey = await assistant.storage.getApiKey();
        if (!apiKey || apiKey === '') {
            // Trigger the red blink animation on the API key input
            const mainView = this.shadowRoot.querySelector('main-view');
            if (mainView && mainView.triggerApiKeyError) {
                mainView.triggerApiKeyError();
            }
            return;
        }

        // Check translation config from preferences
        const translationPrefs = await assistant.storage.getTranslationConfig();
        if (translationPrefs.enabled && translationPrefs.targetLanguage) {
            this.translationEnabled = true;
            await window.electronAPI.invoke('translation:set-config', {
                enabled: true,
                sourceLanguage: translationPrefs.sourceLanguage || '',
                targetLanguage: translationPrefs.targetLanguage,
            });
        } else {
            this.translationEnabled = false;
        }

        await assistant.initializeGemini(this.selectedProfile, this.selectedLanguage);
        // Pass the screenshot interval as string (including 'manual' option)
        assistant.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        this.responses = [];
        this.currentResponseIndex = -1;
        this.startTime = Date.now();
        this.currentView = 'assistant';
    }

    handlePrepareClick() {
        this.previousView = this.currentView;
        this.currentView = 'session-prep';
        this.requestUpdate();
    }

    async handleUseTemplate(template) {
        // Apply template prep data to co-pilot prep storage, then navigate to session-prep
        if (template && template.prepData) {
            await assistant.storage.setCoPilotPrep(template.prepData);
        }
        this.currentView = 'session-prep';
        this.requestUpdate();
    }

    async handleStartSession(prepData) {
        const apiKey = await assistant.storage.getApiKey();
        if (!apiKey) {
            this.currentView = 'main';
            return;
        }

        this.copilotActive = true;
        this.copilotPrep = prepData;
        this.accumulatedNotes = { keyPoints: [], decisions: [], openQuestions: [], actionItems: [], nextSteps: [] };

        // Configure translation if enabled in prep data
        if (prepData.translationEnabled && prepData.translationTargetLanguage) {
            this.translationEnabled = true;
            await window.electronAPI.invoke('translation:set-config', {
                enabled: true,
                sourceLanguage: prepData.translationSourceLanguage || '',
                targetLanguage: prepData.translationTargetLanguage,
            });
        } else {
            this.translationEnabled = false;
        }

        await assistant.initializeGemini(this.selectedProfile, this.selectedLanguage, prepData);
        assistant.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        this.responses = [];
        this.currentResponseIndex = -1;
        this.startTime = Date.now();
        this.currentView = 'assistant';

        // Clear the draft so next prep starts fresh
        assistant.storage.clearCoPilotPrep().catch(err =>
            console.warn('Failed to clear co-pilot prep:', err)
        );
    }

    async handleAPIKeyHelp() {
        if (window.electronAPI) {
            await window.electronAPI.invoke('open-external', 'https://assistant.ai/help/api-key');
        }
    }

    // Customize view event handlers
    async handleProfileChange(profile) {
        this.selectedProfile = profile;
        await assistant.storage.updatePreference('selectedProfile', profile);
    }

    async handleLanguageChange(language) {
        this.selectedLanguage = language;
        await assistant.storage.updatePreference('selectedLanguage', language);
    }

    async handleScreenshotIntervalChange(interval) {
        this.selectedScreenshotInterval = interval;
        await assistant.storage.updatePreference('selectedScreenshotInterval', interval);
    }

    async handleImageQualityChange(quality) {
        this.selectedImageQuality = quality;
        await assistant.storage.updatePreference('selectedImageQuality', quality);
    }

    handleBackClick() {
        // Return to previous view, or default to main if no previous view
        this.currentView = this.previousView || 'main';
        this.previousView = 'main'; // Reset to main for next time
        this.requestUpdate();
    }

    // Help view event handlers
    async handleExternalLinkClick(url) {
        if (window.electronAPI) {
            await window.electronAPI.invoke('open-external', url);
        }
    }

    // Assistant view event handlers
    async handleSendText(message) {
        const result = await window.assistant.sendTextMessage(message);

        if (!result.success) {
            console.error('Failed to send message:', result.error);
            this.setStatus('Error sending message: ' + result.error);
        } else {
            this.setStatus('Message sent...');
            this._awaitingNewResponse = true;
        }
    }

    handleResponseIndexChanged(e) {
        this.currentResponseIndex = e.detail.index;
        this.shouldAnimateResponse = false;
        this.requestUpdate();
    }

    // Onboarding event handlers
    handleOnboardingComplete() {
        this.currentView = 'main';
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Only notify main process of view change if the view actually changed
        if (changedProperties.has('currentView') && window.electronAPI) {
            window.electronAPI.send('view-changed', this.currentView);

            // Add a small delay to smooth out the transition
            const viewContainer = this.shadowRoot?.querySelector('.view-container');
            if (viewContainer) {
                viewContainer.classList.add('entering');
                requestAnimationFrame(() => {
                    viewContainer.classList.remove('entering');
                });
            }
        }

        if (changedProperties.has('layoutMode')) {
            this.updateLayoutMode();
        }
    }

    renderCurrentView() {
        // Only re-render the view if it hasn't been cached or if critical properties changed
        const viewKey = `${this.currentView}-${this.selectedProfile}-${this.selectedLanguage}`;

        switch (this.currentView) {
            case 'onboarding':
                return html`
                    <onboarding-view .onComplete=${() => this.handleOnboardingComplete()} .onClose=${() => this.handleClose()}></onboarding-view>
                `;

            case 'main':
                return html`
                    <main-view
                        .onStart=${() => this.handleStart()}
                        .onPrepare=${() => this.handlePrepareClick()}
                        .onUseTemplate=${template => this.handleUseTemplate(template)}
                        .onAPIKeyHelp=${() => this.handleAPIKeyHelp()}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                    ></main-view>
                `;

            case 'session-prep':
                return html`
                    <session-prep-view
                        .onStartSession=${prepData => this.handleStartSession(prepData)}
                    ></session-prep-view>
                `;

            case 'customize':
                return html`
                    <customize-view
                        .selectedProfile=${this.selectedProfile}
                        .selectedLanguage=${this.selectedLanguage}
                        .selectedScreenshotInterval=${this.selectedScreenshotInterval}
                        .selectedImageQuality=${this.selectedImageQuality}
                        .layoutMode=${this.layoutMode}
                        .windowWidth=${this.windowWidth}
                        .windowHeight=${this.windowHeight}
                        .onProfileChange=${profile => this.handleProfileChange(profile)}
                        .onLanguageChange=${language => this.handleLanguageChange(language)}
                        .onScreenshotIntervalChange=${interval => this.handleScreenshotIntervalChange(interval)}
                        .onImageQualityChange=${quality => this.handleImageQualityChange(quality)}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                        .onWindowWidthChange=${width => this.handleWindowWidthChange(width)}
                        .onWindowHeightChange=${height => this.handleWindowHeightChange(height)}
                    ></customize-view>
                `;

            case 'help':
                return html` <help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view> `;

            case 'history':
                return html` <history-view></history-view> `;

            case 'assistant':
                return html`
                    <assistant-view
                        .responses=${this.responses}
                        .currentResponseIndex=${this.currentResponseIndex}
                        .selectedProfile=${this.selectedProfile}
                        .onSendText=${message => this.handleSendText(message)}
                        .shouldAnimateResponse=${this.shouldAnimateResponse}
                        .copilotActive=${this.copilotActive}
                        .copilotPrep=${this.copilotPrep}
                        .translationEnabled=${this.translationEnabled}
                        @response-index-changed=${this.handleResponseIndexChanged}
                        @notes-updated=${(e) => {
                        this.accumulatedNotes = e.detail.notes;
                    }}
                        @response-animation-complete=${() => {
                        this.shouldAnimateResponse = false;
                        this._currentResponseIsComplete = true;
                        console.log('[response-animation-complete] Marked current response as complete');
                        this.requestUpdate();
                    }}
                    ></assistant-view>
                `;

            case 'session-summary':
                return html`
                    <session-summary-view
                        .accumulatedNotes=${this.accumulatedNotes}
                        .copilotPrep=${this.copilotPrep}
                        .responses=${this.responses}
                        .selectedProfile=${this.selectedProfile}
                        .onDone=${() => this.handleClose()}
                    ></session-summary-view>
                `;

            default:
                return html`<div>Unknown view: ${this.currentView}</div>`;
        }
    }

    render() {
        const viewClassMap = {
            'assistant': 'assistant-view',
            'onboarding': 'onboarding-view',
            'customize': 'settings-view',
            'help': 'help-view',
            'history': 'history-view',
            'session-prep': 'settings-view',
            'session-summary': 'settings-view',
        };
        const mainContentClass = `main-content ${viewClassMap[this.currentView] || 'with-border'}`;

        return html`
            <div class="window-container">
                <div class="container">
                    <app-header
                        .currentView=${this.currentView}
                        .statusText=${this.statusText}
                        .startTime=${this.startTime}
                        .onCustomizeClick=${() => this.handleCustomizeClick()}
                        .onHelpClick=${() => this.handleHelpClick()}
                        .onHistoryClick=${() => this.handleHistoryClick()}
                        .onCloseClick=${() => this.handleClose()}
                        .onBackClick=${() => this.handleBackClick()}
                        .onHideToggleClick=${() => this.handleHideToggle()}
                        ?isClickThrough=${this._isClickThrough}
                    ></app-header>
                    <div class="${mainContentClass}">
                        <div class="view-container">${this.renderCurrentView()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLayoutMode() {
        // Apply or remove compact layout class to document root
        if (this.layoutMode === 'compact') {
            document.documentElement.classList.add('compact-layout');
        } else {
            document.documentElement.classList.remove('compact-layout');
        }
    }

    async handleLayoutModeChange(layoutMode) {
        this.layoutMode = layoutMode;
        await assistant.storage.updateConfig('layout', layoutMode);
        this.updateLayoutMode();

        // Notify main process about layout change for window resizing
        if (window.electronAPI) {
            try {
                await window.electronAPI.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }

        this.requestUpdate();
    }

    async handleWindowWidthChange(width) {
        this.windowWidth = width;
        await assistant.storage.updatePreference('windowWidth', width);

        // Notify main process about width change for window resizing
        if (window.electronAPI) {
            try {
                await window.electronAPI.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }

        this.requestUpdate();
    }

    async handleWindowHeightChange(height) {
        this.windowHeight = height;
        await assistant.storage.updatePreference('windowHeight', height);

        // Notify main process about height change for window resizing
        if (window.electronAPI) {
            try {
                await window.electronAPI.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }

        this.requestUpdate();
    }
}

customElements.define('assistant-app', AssistantApp);
