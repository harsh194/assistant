import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }

        :host {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .container {
            width: 100%;
            max-width: 380px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0 16px;
        }

        .heading {
            font-size: 22px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 6px;
            text-align: center;
            letter-spacing: -0.3px;
        }

        .subtitle {
            font-size: 13px;
            color: var(--text-secondary);
            text-align: center;
            margin-bottom: 28px;
            line-height: 1.4;
        }

        .api-key-label {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 10px 12px;
            width: 100%;
            border-radius: var(--border-radius);
            font-size: 13px;
            transition: border-color 0.15s ease;
        }

        input:focus {
            outline: none;
            border-color: var(--border-default);
        }

        input::placeholder {
            color: var(--placeholder-color);
        }

        input.api-key-error {
            animation: blink-red 0.6s ease-in-out;
            border-color: var(--error-color);
        }

        @keyframes blink-red {
            0%, 100% {
                border-color: var(--border-color);
            }
            50% {
                border-color: var(--error-color);
                background: rgba(241, 76, 76, 0.1);
            }
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 24px;
        }

        .action-card {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            padding: 14px 16px;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.15s ease;
            width: 100%;
        }

        .action-card .action-title {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-card .action-desc {
            font-size: 11px;
            line-height: 1.4;
        }

        .action-card.primary {
            background: var(--start-button-background);
            border: none;
        }

        .action-card.primary .action-title {
            color: var(--start-button-color);
        }

        .action-card.primary .action-desc {
            color: var(--start-button-color);
            opacity: 0.6;
        }

        .action-card.primary:hover {
            background: var(--start-button-hover-background);
        }

        .action-card.primary.initializing {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .action-card.primary.initializing:hover {
            background: var(--start-button-background);
        }

        .action-card.secondary {
            background: transparent;
            border: 1px solid var(--border-color);
        }

        .action-card.secondary .action-title {
            color: var(--text-color);
        }

        .action-card.secondary .action-desc {
            color: var(--text-secondary);
        }

        .action-card.secondary:hover {
            background: var(--hover-background);
            border-color: var(--border-default);
        }

        .draft-badge {
            font-size: 9px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: 3px;
            background: var(--btn-primary-bg);
            color: var(--btn-primary-text);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .template-section {
            margin-top: 6px;
        }

        .template-select {
            width: 100%;
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 8px 10px;
            border-radius: var(--border-radius);
            font-size: 12px;
            cursor: pointer;
        }

        .template-select:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .shortcut-hint {
            font-size: 10px;
            color: var(--text-muted);
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            text-align: center;
            margin-top: 16px;
        }

        .feature-picker {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 20px;
        }

        .feature-picker-label {
            font-size: 10px;
            font-weight: 500;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .feature-card {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 10px 12px;
            transition: all 0.15s ease;
        }

        .feature-card.active {
            border-color: var(--btn-primary-bg);
        }

        .feature-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .feature-toggle input[type="checkbox"] {
            width: auto;
            padding: 0;
            cursor: pointer;
            accent-color: var(--btn-primary-bg);
        }

        .feature-toggle input[type="checkbox"]:disabled {
            cursor: not-allowed;
            opacity: 0.4;
        }

        .feature-toggle label {
            font-size: 12px;
            color: var(--text-color);
            font-weight: 500;
            cursor: pointer;
            flex: 1;
        }

        .feature-desc {
            font-size: 10px;
            color: var(--text-muted);
            margin-left: 24px;
            margin-top: 2px;
        }

        .feature-expand {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color);
        }

        .feature-expand .lang-group {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin-bottom: 8px;
        }

        .feature-expand .lang-label {
            font-size: 10px;
            font-weight: 500;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .feature-expand select {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 6px 8px;
            border-radius: var(--border-radius);
            font-size: 12px;
            cursor: pointer;
            width: 100%;
        }

        .feature-expand select:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .feature-expand .cloud-key-section {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color);
        }

        .feature-expand .cloud-key-label {
            font-size: 10px;
            font-weight: 500;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 3px;
        }

        .feature-expand .cloud-key-hint {
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 6px;
            line-height: 1.4;
        }

        .feature-expand .cloud-key-input {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 6px 8px;
            width: 100%;
            border-radius: var(--border-radius);
            font-size: 12px;
        }

        .feature-expand .cloud-key-input:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .feature-expand .cloud-key-input::placeholder {
            color: var(--placeholder-color);
        }

        .feature-expand .cloud-key-status {
            font-size: 10px;
            margin-top: 4px;
        }

        .feature-expand .cloud-key-status.connected {
            color: var(--success-color, #4caf50);
        }

        .feature-expand .cloud-key-status.empty {
            color: var(--text-muted);
        }

        .feature-expand .screen-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
        }

        .feature-expand .screen-group input[type="checkbox"] {
            width: auto;
            padding: 0;
            cursor: pointer;
            accent-color: var(--btn-primary-bg);
        }

        .feature-expand .screen-group label {
            font-size: 11px;
            color: var(--text-color);
            cursor: pointer;
        }

        .feature-expand .screen-group select {
            width: auto;
            min-width: 70px;
        }
    `;

    static properties = {
        onStart: { type: Function },
        onPrepare: { type: Function },
        onUseTemplate: { type: Function },
        onAPIKeyHelp: { type: Function },
        isInitializing: { type: Boolean },
        onLayoutModeChange: { type: Function },
        showApiKeyError: { type: Boolean },
        _hasDraft: { state: true },
        _templates: { state: true },
        _featureAssistant: { state: true },
        _featureTranslation: { state: true },
        _featureScreenAnalysis: { state: true },
        _translationSourceLang: { state: true },
        _translationTargetLang: { state: true },
        _googleTranslationKey: { state: true },
        _screenAutoCapture: { state: true },
        _screenInterval: { state: true },
    };

    constructor() {
        super();
        this.onStart = () => { };
        this.onPrepare = () => { };
        this.onUseTemplate = () => { };
        this.onAPIKeyHelp = () => { };
        this.isInitializing = false;
        this.onLayoutModeChange = () => { };
        this.showApiKeyError = false;
        this.boundKeydownHandler = this.handleKeydown.bind(this);
        this.apiKey = '';
        this._hasDraft = false;
        this._templates = [];
        this._featureAssistant = true;
        this._featureTranslation = false;
        this._featureScreenAnalysis = false;
        this._translationSourceLang = '';
        this._translationTargetLang = '';
        this._googleTranslationKey = '';
        this._screenAutoCapture = false;
        this._screenInterval = '5';
        this._loadApiKey();
        this._loadFeatureConfig();
    }

    async _loadApiKey() {
        this.apiKey = await assistant.storage.getApiKey();
        this.requestUpdate();
    }

    async _loadFeatureConfig() {
        try {
            const prefs = await assistant.storage.getPreferences();
            // Load last-used features
            const lastFeatures = prefs.lastFeatures;
            if (lastFeatures) {
                this._featureAssistant = lastFeatures.assistant !== false;
                this._featureTranslation = !!lastFeatures.translation;
                this._featureScreenAnalysis = !!lastFeatures.screenAnalysis;
            }
            // Load translation config
            this._translationSourceLang = prefs.translationSourceLanguage || '';
            this._translationTargetLang = prefs.translationTargetLanguage || '';
            const gtKey = await assistant.storage.getGoogleTranslationApiKey();
            this._googleTranslationKey = gtKey || '';
            // Load screen analysis config
            this._screenAutoCapture = prefs.screenCaptureEnabled || false;
            this._screenInterval = String(prefs.screenCaptureInterval || '5');
        } catch (error) {
            // Use defaults
        }
    }

    async _saveTranslationConfig() {
        await assistant.storage.setTranslationConfig({
            enabled: this._featureTranslation,
            sourceLanguage: this._translationSourceLang,
            targetLanguage: this._translationTargetLang,
        });
    }

    _getSelectedFeatures() {
        return {
            assistant: this._featureAssistant,
            translation: this._featureTranslation,
            screenAnalysis: this._featureScreenAnalysis,
        };
    }

    _getActiveFeatureCount() {
        return [this._featureAssistant, this._featureTranslation, this._featureScreenAnalysis].filter(Boolean).length;
    }

    _toggleFeature(feature) {
        const current = this[`_feature${feature}`];
        if (current && this._getActiveFeatureCount() <= 1) {
            return; // Cannot deselect the last active feature
        }
        this[`_feature${feature}`] = !current;
    }

    _getLanguageOptions() {
        return [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'ru', name: 'Russian' },
            { code: 'zh', name: 'Chinese (Mandarin)' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'ar', name: 'Arabic' },
            { code: 'hi', name: 'Hindi' },
            { code: 'tr', name: 'Turkish' },
            { code: 'nl', name: 'Dutch' },
            { code: 'pl', name: 'Polish' },
            { code: 'sv', name: 'Swedish' },
            { code: 'da', name: 'Danish' },
            { code: 'fi', name: 'Finnish' },
            { code: 'no', name: 'Norwegian' },
            { code: 'th', name: 'Thai' },
            { code: 'vi', name: 'Vietnamese' },
            { code: 'id', name: 'Indonesian' },
            { code: 'ms', name: 'Malay' },
            { code: 'uk', name: 'Ukrainian' },
            { code: 'cs', name: 'Czech' },
            { code: 'ro', name: 'Romanian' },
            { code: 'el', name: 'Greek' },
            { code: 'he', name: 'Hebrew' },
        ];
    }

    async _checkDraft() {
        try {
            const draft = await assistant.storage.getCoPilotPrep();
            this._hasDraft = !!(draft.goal || (draft.keyTopics && draft.keyTopics.length > 0)
                || draft.desiredOutcome || draft.customNotes);
        } catch (error) {
            this._hasDraft = false;
        }
    }

    async _loadTemplates() {
        try {
            this._templates = await assistant.storage.getTemplates();
        } catch (error) {
            this._templates = [];
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (window.electronAPI) {
            this._cleanupInitializing = window.electronAPI.on('session-initializing', (isInitializing) => {
                this.isInitializing = isInitializing;
            });
        }

        document.addEventListener('keydown', this.boundKeydownHandler);
        resizeLayout();
        this._checkDraft();
        this._loadTemplates();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._cleanupInitializing) {
            this._cleanupInitializing();
            this._cleanupInitializing = null;
        }
        document.removeEventListener('keydown', this.boundKeydownHandler);
    }

    handleKeydown(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isStartShortcut = isMac ? e.metaKey && e.key === 'Enter' : e.ctrlKey && e.key === 'Enter';

        if (isStartShortcut) {
            e.preventDefault();
            this.handleStartClick();
        }
    }

    async handleInput(e) {
        this.apiKey = e.target.value;
        await assistant.storage.setApiKey(e.target.value);
        if (this.showApiKeyError) {
            this.showApiKeyError = false;
        }
    }

    async handleStartClick() {
        if (this.isInitializing) {
            return;
        }
        const features = this._getSelectedFeatures();
        // Validate translation has target language
        if (features.translation && !this._translationTargetLang) {
            return;
        }
        // Save last-used features and screen config
        await assistant.storage.updatePreference('lastFeatures', features);
        if (features.screenAnalysis) {
            await assistant.storage.updatePreference('screenCaptureEnabled', this._screenAutoCapture);
            await assistant.storage.updatePreference('screenCaptureInterval', parseInt(this._screenInterval) || 5);
        }
        if (features.translation) {
            await this._saveTranslationConfig();
        }
        this.onStart(features);
    }

    handleAPIKeyHelpClick() {
        this.onAPIKeyHelp();
    }

    triggerApiKeyError() {
        this.showApiKeyError = true;
        setTimeout(() => {
            this.showApiKeyError = false;
        }, 1000);
    }

    _handleTemplateSelect(e) {
        const templateId = e.target.value;
        if (!templateId) return;

        const template = this._templates.find(t => t.id === templateId);
        if (template) {
            this.onUseTemplate(template);
        }
        // Reset select to placeholder
        e.target.value = '';
    }

    render() {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? 'Cmd + Enter' : 'Ctrl + Enter';

        return html`
            <div class="container">
                <div class="heading">Welcome to Assistant</div>
                <div class="subtitle">Your AI-powered desktop companion</div>

                <div class="api-key-label">API Key</div>
                <input
                    type="password"
                    placeholder="Enter your Gemini API key"
                    .value=${this.apiKey}
                    @input=${this.handleInput}
                    class="${this.showApiKeyError ? 'api-key-error' : ''}"
                />

                <div class="feature-picker">
                    <div class="feature-picker-label">Features</div>

                    <div class="feature-card ${this._featureAssistant ? 'active' : ''}">
                        <div class="feature-toggle">
                            <input
                                type="checkbox"
                                id="featureAssistant"
                                .checked=${this._featureAssistant}
                                ?disabled=${this._featureAssistant && this._getActiveFeatureCount() <= 1}
                                @change=${() => this._toggleFeature('Assistant')}
                            />
                            <label for="featureAssistant">AI Assistant</label>
                        </div>
                        <div class="feature-desc">Real-time AI responses and coaching</div>
                    </div>

                    <div class="feature-card ${this._featureTranslation ? 'active' : ''}">
                        <div class="feature-toggle">
                            <input
                                type="checkbox"
                                id="featureTranslation"
                                .checked=${this._featureTranslation}
                                ?disabled=${this._featureTranslation && this._getActiveFeatureCount() <= 1}
                                @change=${() => this._toggleFeature('Translation')}
                            />
                            <label for="featureTranslation">Live Translation</label>
                        </div>
                        <div class="feature-desc">Real-time speech translation</div>
                        ${this._featureTranslation ? html`
                            <div class="feature-expand">
                                <div class="lang-group">
                                    <span class="lang-label">Source (spoken by others)</span>
                                    <select
                                        .value=${this._translationSourceLang}
                                        @change=${e => { this._translationSourceLang = e.target.value; }}>
                                        <option value="">Auto-detect</option>
                                        ${this._getLanguageOptions().map(lang => html`
                                            <option value=${lang.code} ?selected=${this._translationSourceLang === lang.code}>
                                                ${lang.name}
                                            </option>
                                        `)}
                                    </select>
                                </div>
                                <div class="lang-group">
                                    <span class="lang-label">Target (your language)</span>
                                    <select
                                        .value=${this._translationTargetLang}
                                        @change=${e => { this._translationTargetLang = e.target.value; }}>
                                        <option value="">Select language</option>
                                        ${this._getLanguageOptions().map(lang => html`
                                            <option value=${lang.code} ?selected=${this._translationTargetLang === lang.code}>
                                                ${lang.name}
                                            </option>
                                        `)}
                                    </select>
                                </div>
                                <div class="cloud-key-section">
                                    <div class="cloud-key-label">Cloud Translation API Key</div>
                                    <div class="cloud-key-hint">Optional — enables fast live translations</div>
                                    <input
                                        type="password"
                                        class="cloud-key-input"
                                        placeholder="Enter Google Cloud Translation key"
                                        .value=${this._googleTranslationKey}
                                        @change=${async e => {
                                            this._googleTranslationKey = e.target.value;
                                            await assistant.storage.setGoogleTranslationApiKey(e.target.value);
                                            this.requestUpdate();
                                        }}
                                    />
                                    ${this._googleTranslationKey
                                        ? html`<div class="cloud-key-status connected">Active</div>`
                                        : html`<div class="cloud-key-status empty">Uses Gemini when not set</div>`
                                    }
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="feature-card ${this._featureScreenAnalysis ? 'active' : ''}">
                        <div class="feature-toggle">
                            <input
                                type="checkbox"
                                id="featureScreen"
                                .checked=${this._featureScreenAnalysis}
                                ?disabled=${this._featureScreenAnalysis && this._getActiveFeatureCount() <= 1}
                                @change=${() => this._toggleFeature('ScreenAnalysis')}
                            />
                            <label for="featureScreen">Screen Analysis</label>
                        </div>
                        <div class="feature-desc">AI-powered screenshot analysis</div>
                        ${this._featureScreenAnalysis ? html`
                            <div class="feature-expand">
                                <div class="screen-group">
                                    <input
                                        type="checkbox"
                                        id="screenAutoCapture"
                                        .checked=${this._screenAutoCapture}
                                        @change=${e => { this._screenAutoCapture = e.target.checked; }}
                                    />
                                    <label for="screenAutoCapture">Auto-capture every</label>
                                    <select
                                        .value=${this._screenInterval}
                                        @change=${e => { this._screenInterval = e.target.value; }}>
                                        <option value="3">3s</option>
                                        <option value="5">5s</option>
                                        <option value="10">10s</option>
                                        <option value="15">15s</option>
                                        <option value="30">30s</option>
                                        <option value="60">60s</option>
                                        <option value="300">5m</option>
                                    </select>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="actions">
                    <button
                        @click=${this.handleStartClick}
                        class="action-card primary ${this.isInitializing ? 'initializing' : ''}"
                    >
                        <span class="action-title">Start Session</span>
                        <span class="action-desc">Jump straight into a free conversation</span>
                    </button>

                    <button
                        @click=${() => this.onPrepare()}
                        class="action-card secondary"
                    >
                        <span class="action-title">
                            Prepare Session
                            ${this._hasDraft ? html`<span class="draft-badge">Draft</span>` : ''}
                        </span>
                        <span class="action-desc">${this._hasDraft
                            ? 'Continue your saved session preparation'
                            : 'Define goals, upload context, and start a guided session'
                        }</span>
                    </button>

                    ${this._templates.length > 0 ? html`
                        <div class="template-section">
                            <select class="template-select" @change=${this._handleTemplateSelect}>
                                <option value="">Use a template...</option>
                                ${this._templates.map(t => html`
                                    <option value="${t.id}">${t.name}</option>
                                `)}
                            </select>
                        </div>
                    ` : ''}
                </div>

                <div class="shortcut-hint">${shortcut} to start</div>
            </div>
        `;
    }
}

customElements.define('main-view', MainView);
