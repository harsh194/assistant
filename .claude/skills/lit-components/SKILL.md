---
name: lit-components
description: Lit web component patterns for building reactive UI in Electron renderer.
---

# Lit Web Component Patterns

Best practices for building Lit components in Electron renderer process.

## Component Structure

### Basic Component

```javascript
import { LitElement, html, css } from 'lit'

export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
  `

  static properties = {
    title: { type: String },
    loading: { type: Boolean }
  }

  constructor() {
    super()
    this.title = ''
    this.loading = false
  }

  render() {
    return html`
      <div class="container">
        <h1>${this.title}</h1>
        ${this.loading ? html`<span>Loading...</span>` : null}
      </div>
    `
  }
}

customElements.define('my-component', MyComponent)
```

## State Management

### Internal State

```javascript
static properties = {
  // Reflected to attribute
  name: { type: String, reflect: true },

  // Internal only (no attribute)
  _items: { type: Array, state: true },

  // Custom attribute name
  itemCount: { type: Number, attribute: 'item-count' }
}
```

### Computed Properties

```javascript
get filteredItems() {
  return this._items.filter(item => item.active)
}

get totalCount() {
  return this._items.length
}

render() {
  return html`
    <p>Showing ${this.filteredItems.length} of ${this.totalCount}</p>
  `
}
```

## Event Handling

### DOM Events

```javascript
render() {
  return html`
    <button @click=${this._onClick}>Click</button>
    <input @input=${this._onInput} @keydown=${this._onKeyDown} />
  `
}

_onClick(e) {
  console.log('Clicked:', e.target)
}

_onInput(e) {
  this.value = e.target.value
}

_onKeyDown(e) {
  if (e.key === 'Enter') {
    this._submit()
  }
}
```

### Custom Events

```javascript
_notifyChange() {
  this.dispatchEvent(new CustomEvent('value-changed', {
    detail: { value: this.value },
    bubbles: true,
    composed: true // Crosses shadow DOM boundary
  }))
}

// Parent component listens:
// <child-component @value-changed=${this._handleChange}></child-component>
```

## Conditional Rendering

### If/Else

```javascript
render() {
  return html`
    ${this.loading
      ? html`<loading-spinner></loading-spinner>`
      : html`<main-content></main-content>`
    }
  `
}
```

### Guard Directive

```javascript
import { guard } from 'lit/directives/guard.js'

render() {
  return html`
    ${guard([this.items], () => html`
      <expensive-component .items=${this.items}></expensive-component>
    `)}
  `
}
```

### Cache Directive

```javascript
import { cache } from 'lit/directives/cache.js'

render() {
  return html`
    ${cache(this.showDetail
      ? html`<detail-view></detail-view>`
      : html`<list-view></list-view>`
    )}
  `
}
```

## List Rendering

### Basic List

```javascript
render() {
  return html`
    <ul>
      ${this.items.map(item => html`
        <li>${item.name}</li>
      `)}
    </ul>
  `
}
```

### Keyed List (for performance)

```javascript
import { repeat } from 'lit/directives/repeat.js'

render() {
  return html`
    <ul>
      ${repeat(
        this.items,
        item => item.id, // Key function
        item => html`<li>${item.name}</li>`
      )}
    </ul>
  `
}
```

## Async Data Loading

### Pattern with Loading State

```javascript
static properties = {
  data: { type: Object, state: true },
  loading: { type: Boolean, state: true },
  error: { type: String, state: true }
}

constructor() {
  super()
  this.data = null
  this.loading = false
  this.error = null
}

async connectedCallback() {
  super.connectedCallback()
  await this._loadData()
}

async _loadData() {
  this.loading = true
  this.error = null

  try {
    const result = await window.electronAPI.getData()
    if (result.success) {
      this.data = result.data
    } else {
      this.error = result.error
    }
  } catch (e) {
    this.error = e.message
  } finally {
    this.loading = false
  }
}

render() {
  if (this.loading) {
    return html`<loading-spinner></loading-spinner>`
  }

  if (this.error) {
    return html`<error-message message=${this.error}></error-message>`
  }

  return html`<data-display .data=${this.data}></data-display>`
}
```

## Styling Patterns

### CSS Custom Properties (Theming)

```javascript
static styles = css`
  :host {
    --primary-color: #007bff;
    --background-color: #ffffff;
    --text-color: #333333;
  }

  .button {
    background: var(--primary-color);
    color: white;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --background-color: #1a1a1a;
      --text-color: #ffffff;
    }
  }
`
```

### Shared Styles

```javascript
// styles/shared.js
import { css } from 'lit'

export const buttonStyles = css`
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  .btn-primary {
    background: var(--primary-color);
    color: white;
  }
`

// In component
import { buttonStyles } from './styles/shared.js'

static styles = [
  buttonStyles,
  css`
    /* Component-specific styles */
  `
]
```

## Electron Integration

### IPC Bridge Access

```javascript
async _savePreferences() {
  const result = await window.electronAPI.setPreferences(this.preferences)

  if (result.success) {
    this._showSuccess('Preferences saved')
  } else {
    this._showError(result.error)
  }
}

async _loadSessions() {
  const result = await window.electronAPI.getAllSessions()

  if (result.success) {
    this.sessions = result.data
  }
}
```

### External Links

```javascript
_openLink(url) {
  window.electronAPI.openExternal(url)
}

render() {
  return html`
    <a href="#" @click=${() => this._openLink('https://example.com')}>
      Open in Browser
    </a>
  `
}
```

## Performance Optimization

1. **Use `state: true`** for internal properties (no attribute reflection)
2. **Use `repeat` directive** for large lists with stable keys
3. **Use `guard` directive** for expensive computations
4. **Debounce** rapid updates
5. **Lazy load** heavy child components
