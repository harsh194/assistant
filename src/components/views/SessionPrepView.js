import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class SessionPrepView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            height: 100%;
            overflow-y: auto;
        }

        :host::-webkit-scrollbar { width: 8px; }
        :host::-webkit-scrollbar-track { background: transparent; }
        :host::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }

        .content-header {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 16px;
            padding: 0 16px 12px 16px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .header-btn {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--border-color);
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .header-btn:hover {
            color: var(--text-color);
            background: var(--hover-background);
        }

        .header-btn.danger:hover {
            color: var(--error-color);
            background: rgba(241, 76, 76, 0.1);
        }

        .draft-indicator {
            font-size: 10px;
            color: var(--success-color);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .draft-indicator.visible {
            opacity: 1;
        }

        .form-grid {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 12px 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .form-label {
            font-weight: 500;
            font-size: 12px;
            color: var(--text-color);
        }

        .form-description {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.4;
        }

        .form-control {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 8px 10px;
            border-radius: 3px;
            font-size: 12px;
            transition: border-color 0.1s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--border-default);
        }

        textarea.form-control {
            resize: vertical;
            min-height: 50px;
            line-height: 1.4;
            font-family: inherit;
        }

        textarea.form-control::placeholder {
            color: var(--placeholder-color);
        }

        .form-control::placeholder {
            color: var(--placeholder-color);
        }

        .topics-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 4px;
        }

        .topic-chip {
            display: flex;
            align-items: center;
            gap: 4px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 11px;
            color: var(--text-color);
        }

        .topic-chip button {
            background: none;
            border: none;
            color: var(--text-muted);
            padding: 0;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
        }

        .topic-chip button:hover {
            color: var(--error-color);
        }

        .topic-input-row {
            display: flex;
            gap: 6px;
        }

        .topic-input-row input {
            flex: 1;
        }

        .add-button {
            background: var(--bg-tertiary);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 6px 12px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
        }

        .add-button:hover {
            background: var(--hover-background);
        }

        .docs-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 4px;
        }

        .doc-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 6px 10px;
            font-size: 11px;
        }

        .doc-item .doc-info {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-color);
            overflow: hidden;
        }

        .doc-item .doc-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .doc-item .doc-size {
            color: var(--text-muted);
            white-space: nowrap;
        }

        .doc-item button {
            background: none;
            border: none;
            color: var(--text-muted);
            padding: 0 2px;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            flex-shrink: 0;
        }

        .doc-item button:hover {
            color: var(--error-color);
        }

        .upload-button {
            background: transparent;
            color: var(--text-color);
            border: 1px dashed var(--border-color);
            padding: 10px;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            text-align: center;
            transition: all 0.1s ease;
        }

        .upload-button:hover {
            background: var(--hover-background);
            border-color: var(--border-default);
        }

        .upload-button.loading {
            opacity: 0.5;
            pointer-events: none;
        }

        .start-button {
            background: var(--start-button-background);
            color: var(--start-button-color);
            border: none;
            padding: 10px 16px;
            border-radius: 3px;
            font-size: 13px;
            font-weight: 500;
            width: 100%;
            cursor: pointer;
            transition: background 0.1s ease;
            margin-top: 4px;
        }

        .start-button:hover {
            background: var(--start-button-hover-background);
        }

        .shortcut-hint {
            font-size: 11px;
            color: var(--text-muted);
            font-family: 'SF Mono', Monaco, monospace;
        }

        .section-divider {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 4px 0;
        }

        .save-template-row {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .save-template-row input {
            flex: 1;
        }

        .template-saved-msg {
            font-size: 10px;
            color: var(--success-color);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .template-saved-msg.visible {
            opacity: 1;
        }

        select.form-control {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 8px 10px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
        }

        select.form-control:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }

        .checkbox-row input[type="checkbox"] {
            cursor: pointer;
            accent-color: var(--btn-primary-bg);
        }

        .checkbox-row label {
            font-size: 12px;
            color: var(--text-color);
            cursor: pointer;
        }
    `;

    static properties = {
        onStartSession: { type: Function },
        prepData: { type: Object },
        _topicInput: { state: true },
        _isUploading: { state: true },
        _uploadStage: { state: true },
        _draftSaved: { state: true },
        _templateName: { state: true },
        _templateSaved: { state: true },
    };

    constructor() {
        super();
        this.onStartSession = () => {};
        this.prepData = {
            goal: '',
            desiredOutcome: '',
            successCriteria: '',
            decisionOwner: '',
            keyTopics: [],
            referenceDocuments: [],
            customNotes: '',
            translationEnabled: false,
            translationSourceLanguage: '',
            translationTargetLanguage: '',
        };
        this._topicInput = '';
        this._isUploading = false;
        this._uploadStage = null;
        this._cleanupUploadProgress = null;
        this._draftSaved = false;
        this._draftSaveTimer = null;
        this._templateName = '';
        this._templateSaved = false;
        this._loadFromStorage();
    }

    async _loadFromStorage() {
        try {
            const data = await assistant.storage.getCoPilotPrep();
            this.prepData = { ...this.prepData, ...data };
            this.requestUpdate();
        } catch (error) {
            console.error('Error loading co-pilot prep:', error);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        resizeLayout();
        if (window.electronAPI) {
            this._cleanupUploadProgress = window.electronAPI.on('document-upload-progress', (data) => {
                this._uploadStage = data.stage;
                if (data.stage === 'done' || data.stage === 'error') {
                    setTimeout(() => { this._uploadStage = null; }, 2000);
                }
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._cleanupUploadProgress) {
            this._cleanupUploadProgress();
            this._cleanupUploadProgress = null;
        }
        if (this._draftSaveTimer) {
            clearTimeout(this._draftSaveTimer);
        }
    }

    async _saveField(key, value) {
        this.prepData = { ...this.prepData, [key]: value };
        await assistant.storage.updateCoPilotPrep(key, value);
        this._showDraftSaved();
    }

    _showDraftSaved() {
        this._draftSaved = true;
        if (this._draftSaveTimer) {
            clearTimeout(this._draftSaveTimer);
        }
        this._draftSaveTimer = setTimeout(() => {
            this._draftSaved = false;
        }, 1500);
    }

    handleInput(key, e) {
        this._saveField(key, e.target.value);
    }

    handleTopicInputKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this._addTopic();
        }
    }

    _addTopic() {
        const text = this._topicInput.trim();
        if (!text) return;

        const newTopics = [...this.prepData.keyTopics, { text, covered: false }];
        this._saveField('keyTopics', newTopics);
        this._topicInput = '';
        this.requestUpdate();
    }

    _removeTopic(index) {
        const newTopics = this.prepData.keyTopics.filter((_, i) => i !== index);
        this._saveField('keyTopics', newTopics);
    }

    async _handleUploadClick() {
        if (this._isUploading) return;
        this._isUploading = true;
        this.requestUpdate();

        try {
            const result = await assistant.openFileDialog();
            if (result.success) {
                const newDocs = [...this.prepData.referenceDocuments, result.data];
                await this._saveField('referenceDocuments', newDocs);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
        } finally {
            this._isUploading = false;
            this.requestUpdate();
        }
    }

    _removeDocument(index) {
        const doc = this.prepData.referenceDocuments[index];
        if (doc && doc.docId) {
            assistant.deleteDocumentEmbeddings(doc.docId).catch(err =>
                console.warn('Failed to delete embeddings:', err)
            );
        }
        const newDocs = this.prepData.referenceDocuments.filter((_, i) => i !== index);
        this._saveField('referenceDocuments', newDocs);
    }

    _formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    _handleStartSession() {
        this.onStartSession(this.prepData);
    }

    async _clearDraft() {
        await assistant.storage.clearCoPilotPrep();
        this.prepData = {
            goal: '',
            desiredOutcome: '',
            successCriteria: '',
            decisionOwner: '',
            keyTopics: [],
            referenceDocuments: [],
            customNotes: '',
            translationEnabled: false,
            translationSourceLanguage: '',
            translationTargetLanguage: '',
        };
        this.requestUpdate();
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

    async _saveAsTemplate() {
        const name = this._templateName.trim();
        if (!name) return;

        const template = {
            id: String(Date.now()),
            name,
            profile: null,
            prepData: {
                goal: this.prepData.goal,
                desiredOutcome: this.prepData.desiredOutcome,
                successCriteria: this.prepData.successCriteria,
                decisionOwner: this.prepData.decisionOwner,
                keyTopics: this.prepData.keyTopics.map(t => ({ text: t.text, covered: false })),
                customNotes: this.prepData.customNotes,
            },
            createdAt: Date.now(),
        };

        await assistant.storage.saveTemplate(template);
        this._templateName = '';
        this._templateSaved = true;
        setTimeout(() => { this._templateSaved = false; }, 2000);
    }

    render() {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? 'Cmd+Enter' : 'Ctrl+Enter';
        const hasContent = !!(this.prepData.goal || this.prepData.desiredOutcome
            || this.prepData.keyTopics.length > 0 || this.prepData.customNotes);

        return html`
            <div class="content-header">
                <span>Session Preparation</span>
                <div class="header-actions">
                    <span class="draft-indicator ${this._draftSaved ? 'visible' : ''}">Saved</span>
                    ${hasContent ? html`
                        <button class="header-btn danger" @click=${() => this._clearDraft()}>Clear</button>
                    ` : ''}
                </div>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Goal</label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="What do you want to achieve?"
                        .value=${this.prepData.goal}
                        @input=${e => this.handleInput('goal', e)}
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Desired Outcome</label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="What specific result are you looking for?"
                        .value=${this.prepData.desiredOutcome}
                        @input=${e => this.handleInput('desiredOutcome', e)}
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Success Criteria</label>
                    <textarea
                        class="form-control"
                        placeholder="How will you measure success?"
                        .value=${this.prepData.successCriteria}
                        @input=${e => this.handleInput('successCriteria', e)}
                    ></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Decision Owner</label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Who has authority to decide?"
                        .value=${this.prepData.decisionOwner}
                        @input=${e => this.handleInput('decisionOwner', e)}
                    />
                </div>

                <hr class="section-divider" />

                <div class="form-group">
                    <label class="form-label">Key Topics</label>
                    <div class="topic-input-row">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Add a topic..."
                            .value=${this._topicInput}
                            @input=${e => { this._topicInput = e.target.value; }}
                            @keydown=${this.handleTopicInputKeydown}
                        />
                        <button class="add-button" @click=${() => this._addTopic()}>Add</button>
                    </div>
                    ${this.prepData.keyTopics.length > 0 ? html`
                        <div class="topics-container">
                            ${this.prepData.keyTopics.map((topic, i) => html`
                                <span class="topic-chip">
                                    ${topic.text}
                                    <button @click=${() => this._removeTopic(i)}>x</button>
                                </span>
                            `)}
                        </div>
                    ` : ''}
                </div>

                <hr class="section-divider" />

                <div class="form-group">
                    <label class="form-label">Reference Documents</label>
                    <div class="form-description">Upload agendas, briefs, proposals, resumes, contracts, or notes</div>
                    ${this.prepData.referenceDocuments.length > 0 ? html`
                        <div class="docs-list">
                            ${this.prepData.referenceDocuments.map((doc, i) => html`
                                <div class="doc-item">
                                    <div class="doc-info">
                                        <span class="doc-name">${doc.name}</span>
                                        <span class="doc-size">${this._formatFileSize(doc.size)}</span>
                                    </div>
                                    <button @click=${() => this._removeDocument(i)}>x</button>
                                </div>
                            `)}
                        </div>
                    ` : ''}
                    <button
                        class="upload-button ${this._isUploading ? 'loading' : ''}"
                        @click=${() => this._handleUploadClick()}
                    >
                        ${this._isUploading
                            ? (this._uploadStage === 'embedding' ? 'Generating embeddings...'
                                : this._uploadStage === 'parsing' ? 'Parsing document...'
                                : 'Processing...')
                            : '+ Upload Document'}
                    </button>
                </div>

                <hr class="section-divider" />

                <div class="form-group">
                    <label class="form-label">Additional Notes</label>
                    <textarea
                        class="form-control"
                        placeholder="Any additional context, constraints, or instructions..."
                        .value=${this.prepData.customNotes}
                        @input=${e => this.handleInput('customNotes', e)}
                        style="min-height: 60px;"
                    ></textarea>
                </div>

                <hr class="section-divider" />

                <div class="form-group">
                    <label class="form-label">Real-Time Translation</label>
                    <div class="form-description">Translate conversation speech during the session</div>
                    <div class="checkbox-row">
                        <input
                            type="checkbox"
                            id="translationEnabled"
                            .checked=${this.prepData.translationEnabled}
                            @change=${e => this._saveField('translationEnabled', e.target.checked)}
                        />
                        <label for="translationEnabled">Enable translation mode</label>
                    </div>
                </div>

                ${this.prepData.translationEnabled ? html`
                    <div class="form-group">
                        <label class="form-label">Source Language</label>
                        <div class="form-description">Language spoken by others</div>
                        <select class="form-control"
                            .value=${this.prepData.translationSourceLanguage}
                            @change=${e => this._saveField('translationSourceLanguage', e.target.value)}>
                            <option value="">Auto-detect</option>
                            ${this._getLanguageOptions().map(lang => html`
                                <option value=${lang.code} ?selected=${this.prepData.translationSourceLanguage === lang.code}>
                                    ${lang.name}
                                </option>
                            `)}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Target Language</label>
                        <div class="form-description">Your language (translation output)</div>
                        <select class="form-control"
                            .value=${this.prepData.translationTargetLanguage}
                            @change=${e => this._saveField('translationTargetLanguage', e.target.value)}>
                            <option value="">Select target language</option>
                            ${this._getLanguageOptions().map(lang => html`
                                <option value=${lang.code} ?selected=${this.prepData.translationTargetLanguage === lang.code}>
                                    ${lang.name}
                                </option>
                            `)}
                        </select>
                    </div>
                ` : ''}

                ${hasContent ? html`
                    <hr class="section-divider" />
                    <div class="form-group">
                        <label class="form-label">Save as Template</label>
                        <div class="save-template-row">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Template name..."
                                .value=${this._templateName}
                                @input=${e => { this._templateName = e.target.value; }}
                                @keydown=${e => { if (e.key === 'Enter') { e.preventDefault(); this._saveAsTemplate(); } }}
                            />
                            <button class="add-button" @click=${() => this._saveAsTemplate()}>Save</button>
                        </div>
                        <span class="template-saved-msg ${this._templateSaved ? 'visible' : ''}">Template saved</span>
                    </div>
                ` : ''}

                <button class="start-button" @click=${() => this._handleStartSession()}>
                    Start Session <span class="shortcut-hint">${shortcut}</span>
                </button>
            </div>
        `;
    }
}

customElements.define('session-prep-view', SessionPrepView);
