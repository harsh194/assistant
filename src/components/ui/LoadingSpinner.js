import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';

/**
 * Simple CSS-based loading spinner
 */
export class LoadingSpinner extends LitElement {
  static properties = {
    size: { type: Number },
    color: { type: String }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner {
      display: inline-block;
      border-radius: 50%;
      border-style: solid;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  constructor() {
    super();
    this.size = 20;
    this.color = 'var(--text-color, #e5e5e5)';
  }

  render() {
    const spinnerStyle = `
      width: ${this.size}px;
      height: ${this.size}px;
      border-width: ${Math.max(2, this.size / 8)}px;
      border-color: ${this.color} transparent transparent transparent;
    `;

    return html`
      <div
        class="spinner"
        style="${spinnerStyle}"
        role="status"
        aria-label="Loading"
      ></div>
    `;
  }
}

customElements.define('loading-spinner', LoadingSpinner);
