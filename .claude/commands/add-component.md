---
description: Guide for creating a new Lit web component
---

# Add Lit Component

Template and guide for creating a new Lit web component.

## Component Template

Create new file in appropriate directory:
- `src/components/app/` - App-level components
- `src/components/views/` - View/page components

```javascript
import { LitElement, html, css } from '../assets/lit-all-2.7.4.min.js'

export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .container {
      padding: 16px;
    }
  `

  static properties = {
    // Public properties (reflected to attributes)
    title: { type: String },

    // Internal state (not reflected)
    _loading: { type: Boolean, state: true },
    _data: { type: Object, state: true }
  }

  constructor() {
    super()
    this.title = ''
    this._loading = false
    this._data = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._loadData()
  }

  async _loadData() {
    this._loading = true
    try {
      // Load data via IPC
      const result = await window.electronAPI.getData()
      if (result.success) {
        this._data = result.data
      }
    } finally {
      this._loading = false
    }
  }

  render() {
    if (this._loading) {
      return html`<div class="loading">Loading...</div>`
    }

    return html`
      <div class="container">
        <h1>${this.title}</h1>
        <!-- Component content -->
      </div>
    `
  }
}

customElements.define('my-component', MyComponent)
```

## Registration

Add to `src/components/index.js`:

```javascript
import './app/MyComponent.js'
// or
import './views/MyComponent.js'
```

## Usage

In parent component or HTML:

```html
<my-component title="Hello"></my-component>
```

## Checklist

- [ ] Define all properties with types
- [ ] Initialize properties in constructor
- [ ] Handle loading and error states
- [ ] Use `state: true` for internal properties
- [ ] Register with `customElements.define`
- [ ] Export from `components/index.js`
- [ ] Add CSS for `:host` display property
