import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';
import '../ui/SkeletonLoader.js';

export class HistoryView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
        }

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .history-container {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .sessions-list {
            flex: 1;
            overflow-y: auto;
        }

        .session-item {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background 0.1s ease;
        }

        .session-item:hover {
            background: var(--hover-background);
        }

        .session-item.selected {
            background: var(--bg-secondary);
        }

        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .session-date {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color);
        }

        .session-time {
            font-size: 11px;
            color: var(--text-muted);
            font-family: 'SF Mono', Monaco, monospace;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .session-duration {
            color: var(--text-muted);
            font-size: 10px;
            opacity: 0.7;
        }

        .session-preview {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.3;
        }

        .conversation-view {
            flex: 1;
            overflow-y: auto;
            background: var(--bg-primary);
            padding: 12px 0;
            user-select: text;
            cursor: text;
        }

        .message {
            margin-bottom: 8px;
            padding: 8px 12px;
            border-left: 2px solid transparent;
            font-size: 12px;
            line-height: 1.4;
            background: var(--bg-secondary);
            user-select: text;
            cursor: text;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .message.user {
            border-left-color: #3b82f6;
        }

        .message.ai {
            border-left-color: #ef4444;
        }

        .back-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 12px 12px 12px 12px;
            border-bottom: 1px solid var(--border-color);
        }

        .back-button {
            background: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 6px 12px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.1s ease;
        }

        .back-button:hover {
            background: var(--hover-background);
        }

        .legend {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            color: var(--text-muted);
        }

        .legend-dot {
            width: 8px;
            height: 2px;
        }

        .legend-dot.user {
            background-color: #3b82f6;
        }

        .legend-dot.ai {
            background-color: #ef4444;
        }

        .legend-dot.screen {
            background-color: #22c55e;
        }

        .session-context {
            padding: 8px 12px;
            margin-bottom: 8px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            font-size: 11px;
        }

        .session-context-row {
            display: flex;
            gap: 8px;
            margin-bottom: 4px;
        }

        .session-context-row:last-child {
            margin-bottom: 0;
        }

        .context-label {
            color: var(--text-muted);
            min-width: 80px;
        }

        .context-value {
            color: var(--text-color);
            font-weight: 500;
        }

        .custom-prompt-value {
            color: var(--text-secondary);
            font-style: italic;
            word-break: break-word;
            white-space: pre-wrap;
        }

        .view-tabs {
            display: flex;
            gap: 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 8px;
        }

        .view-tab {
            background: transparent;
            color: var(--text-muted);
            border: none;
            padding: 8px 16px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
            transition: color 0.1s ease;
        }

        .view-tab:hover {
            color: var(--text-color);
        }

        .view-tab.active {
            color: var(--text-color);
            border-bottom-color: var(--text-color);
        }

        .message.screen {
            border-left-color: #22c55e;
        }

        .analysis-meta {
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 4px;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .empty-state {
            text-align: center;
            color: var(--text-muted);
            font-size: 12px;
            margin-top: 32px;
        }

        .empty-state-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
            color: var(--text-secondary);
        }

        .loading {
            text-align: center;
            color: var(--text-muted);
            font-size: 12px;
            margin-top: 32px;
        }

        .sessions-list::-webkit-scrollbar,
        .conversation-view::-webkit-scrollbar {
            width: 8px;
        }

        .sessions-list::-webkit-scrollbar-track,
        .conversation-view::-webkit-scrollbar-track {
            background: transparent;
        }

        .sessions-list::-webkit-scrollbar-thumb,
        .conversation-view::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        .sessions-list::-webkit-scrollbar-thumb:hover,
        .conversation-view::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        .tabs-container {
            display: flex;
            gap: 0;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .tab {
            background: transparent;
            color: var(--text-muted);
            border: none;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: color 0.1s ease;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }

        .tab:hover {
            color: var(--text-color);
        }

        .tab.active {
            color: var(--text-color);
            border-bottom-color: var(--text-color);
        }

        .saved-response-item {
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .saved-response-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
        }

        .saved-response-profile {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            text-transform: capitalize;
        }

        .saved-response-date {
            font-size: 10px;
            color: var(--text-muted);
            font-family: 'SF Mono', Monaco, monospace;
        }

        .saved-response-content {
            font-size: 12px;
            color: var(--text-color);
            line-height: 1.4;
            user-select: text;
            cursor: text;
        }

        .delete-button {
            background: transparent;
            color: var(--text-muted);
            border: none;
            padding: 4px;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .delete-button:hover {
            background: rgba(241, 76, 76, 0.1);
            color: var(--error-color);
        }

        .search-controls {
            padding: 8px 12px;
            border-bottom: 1px solid var(--border-color);
        }

        .search-input {
            width: 100%;
            background: var(--bg-secondary);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 6px 8px;
            border-radius: 3px;
            font-size: 12px;
            box-sizing: border-box;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .search-input::placeholder {
            color: var(--text-muted);
        }

        .filter-row {
            display: flex;
            gap: 6px;
            margin-top: 6px;
        }

        .filter-select {
            flex: 1;
            background: var(--bg-secondary);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 4px 6px;
            border-radius: 3px;
            font-size: 11px;
        }

        .filter-select:focus {
            outline: none;
            border-color: var(--border-default);
        }

        .session-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .session-delete-btn {
            background: transparent;
            border: none;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            color: var(--text-muted);
            cursor: pointer;
            opacity: 0;
            transition: all 0.1s ease;
        }

        .session-item:hover .session-delete-btn {
            opacity: 1;
        }

        .session-delete-btn:hover {
            color: var(--error-color, #f14c4c);
            background: rgba(241, 76, 76, 0.1);
        }

        .session-delete-btn.confirm {
            opacity: 1;
            color: var(--error-color, #f14c4c);
            background: rgba(241, 76, 76, 0.15);
        }

        .no-results {
            text-align: center;
            color: var(--text-muted);
            font-size: 12px;
            margin-top: 32px;
        }
    `;

    static properties = {
        sessions: { type: Array },
        selectedSession: { type: Object },
        loading: { type: Boolean },
        activeTab: { type: String },
        searchQuery: { type: String },
        filterProfile: { type: String },
        filterDateRange: { type: String },
        filterCopilot: { type: String },
        deleteConfirmId: { type: String },
        _customProfiles: { state: true },
    };

    constructor() {
        super();
        this.sessions = [];
        this.selectedSession = null;
        this.loading = true;
        this.activeTab = 'conversation';
        this.searchQuery = '';
        this.filterProfile = 'all';
        this.filterDateRange = 'all';
        this.filterCopilot = 'all';
        this.deleteConfirmId = null;
        this._customProfiles = [];
        this.loadSessions();
        this._loadCustomProfiles();
    }

    async _loadCustomProfiles() {
        try {
            this._customProfiles = await assistant.storage.getCustomProfiles();
        } catch (error) {
            console.error('Error loading custom profiles:', error);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        // Resize window for this view
        resizeLayout();
    }

    async loadSessions() {
        try {
            this.loading = true;
            const sessions = await assistant.storage.getAllSessions();
            this.sessions = sessions; // Assign to this.sessions after fetching
        } catch (error) {
            console.error('Error loading conversation sessions:', error);
            this.sessions = [];
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    async loadSelectedSession(sessionId) {
        try {
            const session = await assistant.storage.getSession(sessionId); // Corrected to getSession
            if (session) {
                this.selectedSession = session;
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    formatDuration(createdAt, lastUpdated) {
        if (!createdAt || !lastUpdated) return '';
        const durationMs = lastUpdated - createdAt;
        const minutes = Math.floor(durationMs / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        }
        if (minutes > 0) return `${minutes}m`;
        return '<1m';
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    getSessionPreview(session) {
        const parts = [];
        if (session.hasCopilot) {
            parts.push('Co-Pilot');
        }
        if (session.goal) {
            parts.push(session.goal.length > 40 ? session.goal.substring(0, 40) + '...' : session.goal);
        } else if (session.firstMessage) {
            parts.push(session.firstMessage.length > 40 ? session.firstMessage.substring(0, 40) + '...' : session.firstMessage);
        }
        if (session.messageCount > 0) {
            parts.push(`${session.messageCount} messages`);
        }
        if (session.screenAnalysisCount > 0) {
            parts.push(`${session.screenAnalysisCount} screen analysis`);
        }
        if (session.profile) {
            const profileNames = this.getProfileNames();
            parts.push(profileNames[session.profile] || session.profile);
        }
        return parts.length > 0 ? parts.join(' • ') : 'Empty session';
    }

    handleSessionClick(session) {
        this.loadSelectedSession(session.sessionId);
    }

    handleBackClick() {
        this.selectedSession = null;
        this.activeTab = 'conversation';
    }

    handleTabClick(tab) {
        this.activeTab = tab;
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            study: 'Study Coach',
        };
    }

    getFilteredSessions() {
        let filtered = [...this.sessions];

        if (this.filterProfile !== 'all') {
            filtered = filtered.filter(s => s.profile === this.filterProfile);
        }

        if (this.filterDateRange !== 'all') {
            const now = Date.now();
            const ranges = { today: 86400000, week: 604800000, month: 2592000000 };
            const cutoff = now - ranges[this.filterDateRange];
            filtered = filtered.filter(s => s.createdAt >= cutoff);
        }

        if (this.filterCopilot !== 'all') {
            if (this.filterCopilot === 'copilot') {
                filtered = filtered.filter(s => s.hasCopilot);
            } else if (this.filterCopilot === 'free') {
                filtered = filtered.filter(s => !s.hasCopilot);
            }
        }

        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            const profileNames = this.getProfileNames();
            filtered = filtered.filter(s => {
                const profileName = (profileNames[s.profile] || s.profile || '').toLowerCase();
                const dateStr = this.formatDate(s.createdAt).toLowerCase();
                const goal = (s.goal || '').toLowerCase();
                const firstMessage = (s.firstMessage || '').toLowerCase();
                const customPrompt = (s.customPrompt || '').toLowerCase();
                return profileName.includes(query)
                    || dateStr.includes(query)
                    || goal.includes(query)
                    || firstMessage.includes(query)
                    || customPrompt.includes(query);
            });
        }

        filtered.sort((a, b) => b.createdAt - a.createdAt);
        return filtered;
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    handleFilterProfile(e) {
        this.filterProfile = e.target.value;
    }

    handleFilterDateRange(e) {
        this.filterDateRange = e.target.value;
    }

    handleFilterCopilot(e) {
        this.filterCopilot = e.target.value;
    }

    async handleDeleteSession(sessionId, e) {
        e.stopPropagation();
        if (this.deleteConfirmId === sessionId) {
            await assistant.storage.deleteSession(sessionId);
            this.sessions = this.sessions.filter(s => s.sessionId !== sessionId);
            this.deleteConfirmId = null;
        } else {
            this.deleteConfirmId = sessionId;
            setTimeout(() => {
                if (this.deleteConfirmId === sessionId) {
                    this.deleteConfirmId = null;
                    this.requestUpdate();
                }
            }, 3000);
        }
        this.requestUpdate();
    }

    renderSearchControls() {
        return html`
            <div class="search-controls">
                <input type="text" class="search-input"
                    placeholder="Search by goal, content, profile..."
                    .value=${this.searchQuery}
                    @input=${this.handleSearchInput} />
                <div class="filter-row">
                    <select class="filter-select" .value=${this.filterProfile}
                        @change=${this.handleFilterProfile}>
                        <option value="all">All Profiles</option>
                        <option value="interview">Interview</option>
                        <option value="sales">Sales</option>
                        <option value="meeting">Meeting</option>
                        <option value="presentation">Presentation</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="study">Study</option>
                        ${(this._customProfiles || []).map(p => html`
                            <option value="custom-${p.id}">${p.name}</option>
                        `)}
                    </select>
                    <select class="filter-select" .value=${this.filterDateRange}
                        @change=${this.handleFilterDateRange}>
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    <select class="filter-select" .value=${this.filterCopilot}
                        @change=${this.handleFilterCopilot}>
                        <option value="all">All Types</option>
                        <option value="copilot">Co-Pilot</option>
                        <option value="free">Free Session</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderSessionsList() {
        if (this.loading) {
            return html`
                <div class="sessions-list">
                    ${[1, 2, 3, 4].map(() => html`<skeleton-loader variant="list-item"></skeleton-loader>`)}
                </div>
            `;
        }

        if (this.sessions.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-state-title">No conversations yet</div>
                    <div>Start a session to see your conversation history here</div>
                </div>
            `;
        }

        const filtered = this.getFilteredSessions();

        return html`
            ${this.renderSearchControls()}
            <div class="sessions-list">
                ${filtered.length === 0
                    ? html`<div class="no-results">No sessions match your filters</div>`
                    : filtered.map(session => html`
                        <div class="session-item" @click=${() => this.handleSessionClick(session)}>
                            <div class="session-header">
                                <div class="session-date">${this.formatDate(session.createdAt)}</div>
                                <div class="session-time">
                                    ${this.formatTime(session.createdAt)}
                                    ${session.lastUpdated ? html`
                                        <span class="session-duration">${this.formatDuration(session.createdAt, session.lastUpdated)}</span>
                                    ` : ''}
                                    <button class="session-delete-btn ${this.deleteConfirmId === session.sessionId ? 'confirm' : ''}"
                                        @click=${(e) => this.handleDeleteSession(session.sessionId, e)}
                                        title="${this.deleteConfirmId === session.sessionId ? 'Click again to confirm' : 'Delete'}">
                                        ${this.deleteConfirmId === session.sessionId ? 'Confirm?' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                            <div class="session-preview">${this.getSessionPreview(session)}</div>
                        </div>
                    `)
                }
            </div>
        `;
    }

    renderContextContent() {
        const { profile, customPrompt } = this.selectedSession;
        const profileNames = this.getProfileNames();

        if (!profile && !customPrompt) {
            return html`<div class="empty-state">No profile context available</div>`;
        }

        return html`
            <div class="session-context">
                ${profile ? html`
                    <div class="session-context-row">
                        <span class="context-label">Profile:</span>
                        <span class="context-value">${profileNames[profile] || profile}</span>
                    </div>
                ` : ''}
                ${customPrompt ? html`
                    <div class="session-context-row">
                        <span class="context-label">Custom Prompt:</span>
                        <span class="custom-prompt-value">${customPrompt}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderConversationContent() {
        const { conversationHistory } = this.selectedSession;

        // Flatten the conversation turns into individual messages
        const messages = [];
        if (conversationHistory) {
            conversationHistory.forEach(turn => {
                if (turn.transcription) {
                    messages.push({
                        type: 'user',
                        content: turn.transcription,
                        timestamp: turn.timestamp,
                    });
                }
                if (turn.ai_response) {
                    messages.push({
                        type: 'ai',
                        content: turn.ai_response,
                        timestamp: turn.timestamp,
                    });
                }
            });
        }

        if (messages.length === 0) {
            return html`<div class="empty-state">No conversation data available</div>`;
        }

        return messages.map(message => html`<div class="message ${message.type}">${message.content}</div>`);
    }

    renderScreenAnalysisContent() {
        const { screenAnalysisHistory } = this.selectedSession;

        if (!screenAnalysisHistory || screenAnalysisHistory.length === 0) {
            return html`<div class="empty-state">No screen analysis data available</div>`;
        }

        return screenAnalysisHistory.map(analysis => html`
            <div class="message screen"><div class="analysis-meta">${this.formatTimestamp(analysis.timestamp)} • ${analysis.model || 'unknown model'}</div>${analysis.response}</div>
        `);
    }

    renderNotesContent() {
        const { sessionNotes, summary, copilotPrep } = this.selectedSession;
        const hasNotes = sessionNotes && (
            sessionNotes.keyPoints?.length > 0 ||
            sessionNotes.decisions?.length > 0 ||
            sessionNotes.actionItems?.length > 0 ||
            sessionNotes.openQuestions?.length > 0 ||
            sessionNotes.nextSteps?.length > 0
        );

        if (!hasNotes && !summary) {
            return html`<div class="empty-state">No notes or summary available for this session</div>`;
        }

        const renderList = (items, label) => {
            if (!items || items.length === 0) return '';
            return html`
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; font-weight: 500; color: var(--text-color); margin-bottom: 4px;">${label}</div>
                    ${items.map(item => html`<div class="message screen">${item}</div>`)}
                </div>
            `;
        };

        return html`
            ${copilotPrep?.goal ? html`
                <div class="session-context">
                    <div class="session-context-row">
                        <span class="context-label">Goal:</span>
                        <span class="context-value">${copilotPrep.goal}</span>
                    </div>
                    ${copilotPrep.desiredOutcome ? html`
                        <div class="session-context-row">
                            <span class="context-label">Outcome:</span>
                            <span class="context-value">${copilotPrep.desiredOutcome}</span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            ${summary ? html`
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; font-weight: 500; color: var(--text-color); margin-bottom: 4px;">Summary</div>
                    <div class="message ai" style="white-space: pre-wrap;">${summary}</div>
                </div>
            ` : ''}
            ${hasNotes ? html`
                ${renderList(sessionNotes.keyPoints, 'Key Points')}
                ${renderList(sessionNotes.decisions, 'Decisions')}
                ${renderList(sessionNotes.actionItems, 'Action Items')}
                ${renderList(sessionNotes.openQuestions, 'Open Questions')}
                ${renderList(sessionNotes.nextSteps, 'Next Steps')}
            ` : ''}
        `;
    }

    renderConversationView() {
        if (!this.selectedSession) return html``;

        const { conversationHistory, screenAnalysisHistory, profile, customPrompt, copilotPrep, sessionNotes, summary } = this.selectedSession;
        const hasConversation = conversationHistory && conversationHistory.length > 0;
        const hasScreenAnalysis = screenAnalysisHistory && screenAnalysisHistory.length > 0;
        const hasContext = profile || customPrompt;
        const hasCopilotData = copilotPrep || sessionNotes || summary;

        return html`
            <div class="back-header">
                <button class="back-button" @click=${this.handleBackClick}>
                    <svg
                        width="16px"
                        height="16px"
                        stroke-width="1.7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="currentColor"
                    >
                        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    Back to Sessions
                </button>
                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-dot user"></div>
                        <span>Them</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot ai"></div>
                        <span>Suggestion</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot screen"></div>
                        <span>Screen</span>
                    </div>
                </div>
            </div>
            <div class="view-tabs">
                <button
                    class="view-tab ${this.activeTab === 'conversation' ? 'active' : ''}"
                    @click=${() => this.handleTabClick('conversation')}
                >
                    Conversation ${hasConversation ? `(${conversationHistory.length})` : ''}
                </button>
                <button
                    class="view-tab ${this.activeTab === 'screen' ? 'active' : ''}"
                    @click=${() => this.handleTabClick('screen')}
                >
                    Screen ${hasScreenAnalysis ? `(${screenAnalysisHistory.length})` : ''}
                </button>
                ${hasCopilotData ? html`
                    <button
                        class="view-tab ${this.activeTab === 'notes' ? 'active' : ''}"
                        @click=${() => this.handleTabClick('notes')}
                    >
                        Notes
                    </button>
                ` : ''}
                <button
                    class="view-tab ${this.activeTab === 'context' ? 'active' : ''}"
                    @click=${() => this.handleTabClick('context')}
                >
                    Context ${hasContext ? '' : '(empty)'}
                </button>
            </div>
            <div class="conversation-view">
                ${this.activeTab === 'conversation'
                ? this.renderConversationContent()
                : this.activeTab === 'screen'
                    ? this.renderScreenAnalysisContent()
                    : this.activeTab === 'notes'
                        ? this.renderNotesContent()
                        : this.renderContextContent()}
            </div>
        `;
    }

    render() {
        if (this.selectedSession) {
            return html`<div class="history-container">${this.renderConversationView()}</div>`;
        }

        return html`
            <div class="history-container">
                ${this.renderSessionsList()}
            </div>
        `;
    }
}

customElements.define('history-view', HistoryView);
