import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class SkeletonLoader extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .skeleton-line {
            height: 12px;
            background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 3px;
            margin-bottom: 8px;
        }

        .skeleton-line:last-child {
            width: 60%;
        }

        .skeleton-list-item {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
        }

        .skeleton-list-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }

        .skeleton-list-header .skeleton-line {
            margin-bottom: 0;
        }

        .skeleton-list-header .skeleton-line:first-child {
            width: 40%;
        }

        .skeleton-list-header .skeleton-line:last-child {
            width: 20%;
        }

        .skeleton-list-preview {
            height: 10px;
            width: 70%;
            background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 3px;
        }

        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;

    static properties = {
        lines: { type: Number },
        variant: { type: String },
    };

    constructor() {
        super();
        this.lines = 3;
        this.variant = 'text';
    }

    render() {
        if (this.variant === 'list-item') {
            return html`
                <div class="skeleton-list-item">
                    <div class="skeleton-list-header">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                    </div>
                    <div class="skeleton-list-preview"></div>
                </div>
            `;
        }

        return html`
            ${Array.from({ length: this.lines }, () => html`<div class="skeleton-line"></div>`)}
        `;
    }
}

customElements.define('skeleton-loader', SkeletonLoader);
