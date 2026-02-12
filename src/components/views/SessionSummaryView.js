import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';
import '../ui/SkeletonLoader.js';

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

        :host::-webkit-scrollbar { width: 8px; }
        :host::-webkit-scrollbar-track { background: transparent; }
        :host::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }
        :host::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }

        /* ---- Header ---- */
        .header {
            margin-bottom: 16px;
        }

        .header-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 10px;
        }

        .goal-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .goal-label {
            font-weight: 600;
            color: var(--text-color);
            white-space: nowrap;
        }

        .goal-value {
            color: var(--text-secondary);
        }

        /* ---- Cards ---- */
        .card {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 12px;
        }

        .card-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            margin-bottom: 10px;
        }

        /* ---- Actions ---- */
        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 7px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease;
        }

        .btn:hover {
            background: var(--hover-background);
            border-color: var(--text-muted);
        }

        .btn-primary {
            background: var(--start-button-background);
            color: var(--start-button-color);
            border: 1px solid transparent;
        }

        .btn-primary:hover {
            background: var(--start-button-hover-background);
            border-color: transparent;
        }

        .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .btn:disabled:hover {
            background: transparent;
            border-color: var(--border-color);
        }

        .btn-icon {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        /* ---- Summary markdown content ---- */
        .summary-content {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.7;
            user-select: text;
            cursor: text;
        }

        .summary-content * {
            user-select: text;
            cursor: text;
        }

        .summary-content h1,
        .summary-content h2,
        .summary-content h3,
        .summary-content h4 {
            margin: 0.8em 0 0.4em 0;
            color: var(--text-color);
            font-weight: 600;
        }

        .summary-content h1 { font-size: 1.3em; }
        .summary-content h2 { font-size: 1.15em; }
        .summary-content h3 { font-size: 1.05em; }
        .summary-content h4 { font-size: 1em; }

        .summary-content p {
            margin: 0.5em 0;
            color: var(--text-secondary);
        }

        .summary-content ul,
        .summary-content ol {
            margin: 0.5em 0;
            padding-left: 1.4em;
            color: var(--text-secondary);
        }

        .summary-content li {
            margin: 0.25em 0;
        }

        .summary-content strong,
        .summary-content b {
            font-weight: 600;
            color: var(--text-color);
        }

        .summary-content blockquote {
            margin: 0.6em 0;
            padding: 0.4em 0.8em;
            border-left: 2px solid var(--border-default);
            background: var(--bg-secondary);
            border-radius: 0 4px 4px 0;
        }

        .summary-content code {
            background: var(--bg-secondary);
            padding: 0.1em 0.35em;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.85em;
        }

        .summary-content pre {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 10px;
            overflow-x: auto;
            margin: 0.6em 0;
        }

        .summary-content pre code {
            background: none;
            padding: 0;
        }

        .summary-content a {
            color: var(--text-color);
            text-decoration: underline;
            cursor: pointer;
        }

        .summary-content hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 1em 0;
        }

        /* ---- Notes ---- */
        .notes-category {
            margin-bottom: 12px;
        }

        .notes-category:last-child {
            margin-bottom: 0;
        }

        .notes-category-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 6px;
        }

        .notes-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .notes-list li {
            font-size: 12px;
            color: var(--text-secondary);
            padding: 5px 0 5px 18px;
            position: relative;
            line-height: 1.5;
            user-select: text;
            cursor: text;
            border-bottom: 1px solid rgba(128, 128, 128, 0.08);
        }

        .notes-list li:last-child {
            border-bottom: none;
        }

        .notes-list li::before {
            content: '';
            position: absolute;
            left: 4px;
            top: 11px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--text-muted);
        }

        /* ---- Topics ---- */
        .topics-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .topic-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            border: 1px solid;
        }

        .topic-covered {
            background: rgba(76, 175, 80, 0.08);
            border-color: rgba(76, 175, 80, 0.25);
            color: #4caf50;
        }

        .topic-missed {
            background: rgba(241, 76, 76, 0.08);
            border-color: rgba(241, 76, 76, 0.25);
            color: #f14c4c;
        }

        .topic-icon {
            font-size: 10px;
        }

        .topic-text {
            color: var(--text-secondary);
            font-size: 12px;
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
        _copiedSummary: { state: true },
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
        this._copiedSummary = false;
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

    async _handleCopySummary() {
        try {
            await navigator.clipboard.writeText(this._summary);
            this._copiedSummary = true;
            setTimeout(() => { this._copiedSummary = false; }, 1500);
        } catch (err) {
            console.error('Failed to copy summary:', err);
        }
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

    updated(changedProperties) {
        super.updated(changedProperties);
        if ((changedProperties.has('_summary') || changedProperties.has('_isGenerating'))
            && !this._isGenerating && this._summary) {
            const container = this.renderRoot.querySelector('.summary-content');
            if (container && typeof window !== 'undefined' && window.marked) {
                try {
                    let rendered = window.marked.parse(this._summary);
                    rendered = rendered.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    container.innerHTML = rendered;
                } catch (e) {
                    container.textContent = this._summary;
                }
            } else if (container) {
                container.textContent = this._summary;
            }
        }
    }

    _renderNotesCategory(items, label) {
        if (!items || items.length === 0) return '';
        return html`
            <div class="notes-category">
                <div class="notes-category-label">${label}</div>
                <ul class="notes-list">
                    ${items.map(item => html`<li>${item}</li>`)}
                </ul>
            </div>
        `;
    }

    _svgCopy() {
        return html`<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    }

    _svgCheck() {
        return html`<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }

    _svgSave() {
        return html`<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
    }

    _svgNotes() {
        return html`<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
    }

    render() {
        const hasNotes = this._hasNotes();
        const n = this.accumulatedNotes || {};

        return html`
            <!-- Header with goal info -->
            ${this.copilotPrep?.goal ? html`
                <div class="header">
                    <div class="header-title">Session Complete</div>
                    <div class="goal-row">
                        <span class="goal-label">Goal:</span>
                        <span class="goal-value">${this.copilotPrep.goal}</span>
                    </div>
                    ${this.copilotPrep.desiredOutcome ? html`
                        <div class="goal-row">
                            <span class="goal-label">Outcome:</span>
                            <span class="goal-value">${this.copilotPrep.desiredOutcome}</span>
                        </div>
                    ` : ''}
                </div>
            ` : html`
                <div class="header">
                    <div class="header-title">Session Complete</div>
                </div>
            `}

            <!-- Actions -->
            <div class="actions">
                <button class="btn" @click=${this._toggleNotes} ?disabled=${!hasNotes}>
                    ${this._svgNotes()}
                    ${this._showNotes ? 'Hide Notes' : 'View Notes'}
                </button>
                <button class="btn" @click=${this._handleCopySummary} ?disabled=${this._isGenerating || !this._summary}>
                    ${this._copiedSummary ? this._svgCheck() : this._svgCopy()}
                    ${this._copiedSummary ? 'Copied' : 'Copy'}
                </button>
                <button class="btn" @click=${this._handleSaveNotes} ?disabled=${this._isSaving || this._isGenerating}>
                    ${this._svgSave()}
                    ${this._isSaving ? 'Saving...' : 'Export .docx'}
                </button>
                <button class="btn btn-primary" @click=${() => this.onDone()}>
                    Done
                </button>
            </div>

            <!-- Summary card -->
            <div class="card">
                <div class="card-title">Summary</div>
                ${this._isGenerating
                    ? html`<skeleton-loader lines="5"></skeleton-loader>`
                    : html`<div class="summary-content"></div>`
                }
            </div>

            <!-- Notes card -->
            ${this._showNotes && hasNotes ? html`
                <div class="card">
                    <div class="card-title">Session Notes</div>
                    ${this._renderNotesCategory(n.keyPoints, 'Key Points')}
                    ${this._renderNotesCategory(n.decisions, 'Decisions')}
                    ${this._renderNotesCategory(n.actionItems, 'Action Items')}
                    ${this._renderNotesCategory(n.openQuestions, 'Open Questions')}
                    ${this._renderNotesCategory(n.nextSteps, 'Next Steps')}
                </div>
            ` : ''}

            <!-- Topic coverage card -->
            ${this.copilotPrep?.keyTopics?.length > 0 ? html`
                <div class="card">
                    <div class="card-title">Topic Coverage</div>
                    <div class="topics-grid">
                        ${this.copilotPrep.keyTopics.map(topic => html`
                            <span class="topic-pill ${topic.covered ? 'topic-covered' : 'topic-missed'}">
                                <span class="topic-icon">${topic.covered ? '\u2713' : '\u2717'}</span>
                                <span class="topic-text">${topic.text}</span>
                            </span>
                        `)}
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('session-summary-view', SessionSummaryView);
