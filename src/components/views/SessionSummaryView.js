import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class SessionSummaryView extends LitElement {
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
            padding: 16px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
        }

        .section-content {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
            user-select: text;
            cursor: text;
        }

        .section-content * {
            user-select: text;
            cursor: text;
        }

        .notes-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .notes-list li {
            font-size: 13px;
            color: var(--text-secondary);
            padding: 4px 0;
            padding-left: 16px;
            position: relative;
            line-height: 1.5;
            user-select: text;
            cursor: text;
        }

        .notes-list li::before {
            content: '-';
            position: absolute;
            left: 4px;
            color: var(--text-muted);
        }

        .empty-state {
            font-size: 13px;
            color: var(--text-muted);
            font-style: italic;
        }

        .actions {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
        }

        .btn {
            background: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 8px 16px;
            border-radius: 3px;
            font-size: 13px;
            font-weight: 500;
            transition: background 0.1s ease;
        }

        .btn:hover {
            background: var(--hover-background);
        }

        .btn-primary {
            background: var(--start-button-background);
            color: var(--start-button-color);
            border: none;
        }

        .btn-primary:hover {
            background: var(--start-button-hover-background);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn:disabled:hover {
            background: transparent;
        }

        .summary-text {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
            white-space: pre-wrap;
            user-select: text;
            cursor: text;
        }

        .loading {
            font-size: 13px;
            color: var(--text-muted);
        }

        .goal-info {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }

        .goal-label {
            font-weight: 500;
            color: var(--text-color);
        }

        .divider {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 16px 0;
        }

        .topic-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 3px 0;
            font-size: 13px;
            color: var(--text-secondary);
        }

        .topic-status {
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 3px;
            font-weight: 500;
        }

        .topic-covered {
            background: rgba(76, 175, 80, 0.15);
            color: #4caf50;
        }

        .topic-missed {
            background: rgba(241, 76, 76, 0.15);
            color: #f14c4c;
        }

        ::-webkit-scrollbar {
            width: 8px;
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
        accumulatedNotes: { type: Object },
        copilotPrep: { type: Object },
        responses: { type: Array },
        selectedProfile: { type: String },
        onDone: { type: Function },
        _summary: { state: true },
        _isGenerating: { state: true },
        _isSaving: { state: true },
        _showNotes: { state: true },
    };

    constructor() {
        super();
        this.accumulatedNotes = {};
        this.copilotPrep = null;
        this.responses = [];
        this.selectedProfile = 'interview';
        this.onDone = () => {};
        this._summary = '';
        this._isGenerating = false;
        this._isSaving = false;
        this._showNotes = false;
    }

    connectedCallback() {
        super.connectedCallback();
        resizeLayout();
        this._generateSummary();
    }

    async _generateSummary() {
        this._isGenerating = true;
        try {
            const result = await assistant.generateSummary({
                prepData: this.copilotPrep,
                notes: this.accumulatedNotes,
                responses: this.responses,
                profile: this.selectedProfile,
            });
            if (result.success) {
                this._summary = result.summary;
            } else {
                this._summary = 'Unable to generate summary: ' + (result.error || 'Unknown error');
            }
        } catch (error) {
            this._summary = 'Unable to generate summary: ' + error.message;
        }
        this._isGenerating = false;
    }

    async _handleSaveNotes() {
        this._isSaving = true;
        try {
            await assistant.exportNotes({
                summary: this._summary,
                prepData: this.copilotPrep,
                notes: this.accumulatedNotes,
                profile: this.selectedProfile,
            });
        } catch (error) {
            console.error('Error saving notes:', error);
        }
        this._isSaving = false;
    }

    _toggleNotes() {
        this._showNotes = !this._showNotes;
    }

    _hasNotes() {
        const n = this.accumulatedNotes;
        if (!n) return false;
        return (n.keyPoints?.length > 0) ||
               (n.decisions?.length > 0) ||
               (n.openQuestions?.length > 0) ||
               (n.actionItems?.length > 0) ||
               (n.nextSteps?.length > 0);
    }

    _renderNotesList(items, label) {
        if (!items || items.length === 0) return '';
        return html`
            <div class="section">
                <div class="section-title">${label}</div>
                <ul class="notes-list">
                    ${items.map(item => html`<li>${item}</li>`)}
                </ul>
            </div>
        `;
    }

    render() {
        const hasNotes = this._hasNotes();
        const n = this.accumulatedNotes || {};

        return html`
            <!-- Goal info -->
            ${this.copilotPrep?.goal ? html`
                <div class="section">
                    <div class="goal-info"><span class="goal-label">Goal:</span> ${this.copilotPrep.goal}</div>
                    ${this.copilotPrep.desiredOutcome ? html`
                        <div class="goal-info"><span class="goal-label">Desired Outcome:</span> ${this.copilotPrep.desiredOutcome}</div>
                    ` : ''}
                </div>
            ` : ''}

            <!-- Action buttons -->
            <div class="actions">
                <button class="btn" @click=${this._toggleNotes} ?disabled=${!hasNotes}>
                    ${this._showNotes ? 'Hide Notes' : 'View Notes'}
                </button>
                <button class="btn" @click=${this._handleSaveNotes} ?disabled=${this._isSaving || this._isGenerating}>
                    ${this._isSaving ? 'Saving...' : 'Save as Document'}
                </button>
                <button class="btn-primary btn" @click=${() => this.onDone()}>
                    Done
                </button>
            </div>

            <hr class="divider" />

            <!-- Summary -->
            <div class="section">
                <div class="section-title">Summary</div>
                ${this._isGenerating
                    ? html`<div class="loading">Generating summary...</div>`
                    : html`<div class="summary-text">${this._summary}</div>`
                }
            </div>

            <!-- Expanded notes section -->
            ${this._showNotes && hasNotes ? html`
                <hr class="divider" />
                ${this._renderNotesList(n.keyPoints, 'Key Points')}
                ${this._renderNotesList(n.decisions, 'Decisions')}
                ${this._renderNotesList(n.actionItems, 'Action Items')}
                ${this._renderNotesList(n.openQuestions, 'Open Questions')}
                ${this._renderNotesList(n.nextSteps, 'Next Steps')}
            ` : ''}

            <!-- Topic coverage -->
            ${this.copilotPrep?.keyTopics?.length > 0 ? html`
                <hr class="divider" />
                <div class="section">
                    <div class="section-title">Topic Coverage</div>
                    ${this.copilotPrep.keyTopics.map(topic => html`
                        <div class="topic-item">
                            <span class="topic-status ${topic.covered ? 'topic-covered' : 'topic-missed'}">
                                ${topic.covered ? 'Covered' : 'Missed'}
                            </span>
                            ${topic.text}
                        </div>
                    `)}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('session-summary-view', SessionSummaryView);
