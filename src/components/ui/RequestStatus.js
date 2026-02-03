import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';
import { RequestState, getStatusText } from '../../utils/requestState.js';
import './LoadingSpinner.js';

/**
 * Request status display component with spinner, status text, and action buttons
 */
export class RequestStatus extends LitElement {
  static properties = {
    state: { type: String },
    elapsedTime: { type: Number },
    errorMessage: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--bg-secondary, rgba(37, 37, 38, 0.8));
      font-size: 13px;
      color: var(--text-color, #e5e5e5);
    }

    .status-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-text {
      font-weight: 500;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 6px;
      background: rgba(241, 76, 76, 0.1);
      border: 1px solid rgba(241, 76, 76, 0.3);
    }

    .error-message {
      color: var(--error-color, #f14c4c);
      font-size: 13px;
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    button:hover {
      opacity: 0.8;
    }

    .cancel-button {
      background: var(--bg-tertiary, rgba(45, 45, 45, 0.8));
      color: var(--text-color, #e5e5e5);
    }

    .retry-button {
      background: var(--start-button-background, #ffffff);
      color: var(--start-button-color, #1e1e1e);
    }

    .icon {
      font-size: 16px;
    }
  `;

  constructor() {
    super();
    this.state = RequestState.IDLE;
    this.elapsedTime = 0;
    this.errorMessage = '';
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  _handleRetry() {
    this.dispatchEvent(new CustomEvent('retry', { bubbles: true, composed: true }));
  }

  _showCancelButton() {
    return [
      RequestState.VALIDATING_KEY,
      RequestState.SENDING,
      RequestState.THINKING,
      RequestState.STREAMING
    ].includes(this.state);
  }

  _showRetryButton() {
    return this.state === RequestState.ERROR;
  }

  render() {
    if (this.state === RequestState.IDLE || this.state === RequestState.DONE) {
      return html``;
    }

    if (this.state === RequestState.ERROR) {
      return html`
        <div class="error-container">
          <div class="error-message">${this.errorMessage || 'An error occurred'}</div>
          ${this._showRetryButton() ? html`
            <div class="button-group">
              <button class="retry-button" @click=${this._handleRetry}>
                Retry
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (this.state === RequestState.CANCELLED) {
      return html`
        <div class="status-container">
          <div class="status-content">
            <span class="status-text">Cancelled</span>
          </div>
        </div>
      `;
    }

    const statusText = getStatusText(this.state, this.elapsedTime);

    return html`
      <div class="status-container">
        <div class="status-content">
          <loading-spinner size="16"></loading-spinner>
          <span class="status-text">${statusText}</span>
        </div>
        ${this._showCancelButton() ? html`
          <button class="cancel-button" @click=${this._handleCancel}>
            Cancel
          </button>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('request-status', RequestStatus);
