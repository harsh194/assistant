import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class ScreenAnalysisView extends LitElement {
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

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            flex-shrink: 0;
        }

        .header-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-color);
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .search-input {
            background: var(--bg-tertiary);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            width: 200px;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--text-color);
        }

        .clear-btn {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            padding: 4px 12px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .clear-btn:hover {
            background: var(--hover-background);
            color: var(--text-color);
        }

        .analysis-container {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            scroll-behavior: smooth;
        }

        .analysis-container::-webkit-scrollbar {
            width: 8px;
        }

        .analysis-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .analysis-container::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        .analysis-container::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-muted);
            font-size: 14px;
            text-align: center;
            padding: 40px 20px;
        }

        .empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.5;
        }

        .analysis-entry {
            margin-bottom: 16px;
            padding: 12px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }

        .analysis-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .analysis-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: var(--text-muted);
        }

        .analysis-icon {
            font-size: 14px;
        }

        .analysis-time {
            font-family: 'SF Mono', Monaco, monospace;
        }

        .analysis-model {
            padding: 2px 6px;
            background: var(--bg-tertiary);
            border-radius: 2px;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .analysis-text {
            font-size: 13px;
            color: var(--text-color);
            line-height: 1.5;
            margin-bottom: 8px;
            user-select: text;
            cursor: text;
            white-space: pre-wrap;
        }

        .analysis-thumbnail {
            width: 100%;
            max-width: 300px;
            border-radius: 3px;
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: opacity 0.1s ease;
        }

        .analysis-thumbnail:hover {
            opacity: 0.9;
        }

        .no-results {
            text-align: center;
            color: var(--text-muted);
            font-size: 13px;
            padding: 40px 20px;
        }
    `;

    static properties = {
        screenAnalyses: { type: Array },
        _searchQuery: { state: true },
    };

    constructor() {
        super();
        this.screenAnalyses = [];
        this._searchQuery = '';
    }

    handleSearch(e) {
        this._searchQuery = e.target.value.toLowerCase();
    }

    handleClear() {
        if (confirm('Clear all screen analysis history? This cannot be undone.')) {
            this.dispatchEvent(new CustomEvent('clear-screen-history', {
                bubbles: true,
                composed: true,
            }));
        }
    }

    getFilteredAnalyses() {
        if (!this._searchQuery) {
            return this.screenAnalyses;
        }

        return this.screenAnalyses.filter(analysis => {
            const searchText = analysis.response.toLowerCase();
            return searchText.includes(this._searchQuery);
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.analysis-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('screenAnalyses')) {
            this.scrollToBottom();
        }
    }

    render() {
        const filteredAnalyses = this.getFilteredAnalyses();
        const hasAnalyses = this.screenAnalyses.length > 0;

        return html`
            ${hasAnalyses ? html`
                <div class="header">
                    <span class="header-title">${this.screenAnalyses.length} screen analyses</span>
                    <div class="header-actions">
                        <input
                            type="text"
                            class="search-input"
                            placeholder="Search analyses..."
                            @input=${this.handleSearch}
                            value=${this._searchQuery}
                        />
                        <button class="clear-btn" @click=${this.handleClear}>
                            Clear All
                        </button>
                    </div>
                </div>
            ` : ''}

            <div class="analysis-container">
                ${!hasAnalyses ? html`
                    <div class="empty-state">
                        <div class="empty-icon">📸</div>
                        <div>No screen analyses yet</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">
                            Enable auto-capture in settings to see AI screen analysis
                        </div>
                    </div>
                ` : filteredAnalyses.length === 0 ? html`
                    <div class="no-results">
                        No analyses match "${this._searchQuery}"
                    </div>
                ` : filteredAnalyses.map(analysis => html`
                    <div class="analysis-entry">
                        <div class="analysis-header">
                            <div class="analysis-meta">
                                <span class="analysis-icon">📸</span>
                                <span class="analysis-time">${this.formatTime(analysis.timestamp)}</span>
                                <span class="analysis-model">${analysis.model}</span>
                            </div>
                        </div>
                        <div class="analysis-text">${analysis.response}</div>
                        ${analysis.imageData ? html`
                            <img
                                class="analysis-thumbnail"
                                src="data:image/jpeg;base64,${analysis.imageData}"
                                alt="Screenshot"
                            />
                        ` : ''}
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('screen-analysis-view', ScreenAnalysisView);
