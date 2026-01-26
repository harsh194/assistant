---
description: Guide for adding a new IPC channel between main and renderer
---

# Add IPC Channel

Step-by-step guide to add a new IPC communication channel.

## Steps

### 1. Define the Handler (Main Process)

In `src/index.js`, add to the appropriate setup function:

```javascript
ipcMain.handle('category:action-name', async (event, arg1, arg2) => {
  try {
    const result = await doSomething(arg1, arg2)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error in category:action-name:', error)
    return { success: false, error: error.message }
  }
})
```

### 2. Expose in Preload Script

In `src/preload.js`, add to `contextBridge.exposeInMainWorld`:

```javascript
actionName: (arg1, arg2) => ipcRenderer.invoke('category:action-name', arg1, arg2)
```

### 3. Use in Renderer

In your Lit component:

```javascript
async _performAction() {
  const result = await window.electronAPI.actionName(this.arg1, this.arg2)

  if (result.success) {
    this.data = result.data
  } else {
    this._showError(result.error)
  }
}
```

## Channel Naming Convention

Use format: `category:action-name`

Examples:
- `storage:get-config`
- `storage:set-preferences`
- `gemini:send-message`
- `window:minimize`

## Response Format

Always return consistent format:

```javascript
// Success
{ success: true, data: result }

// Error
{ success: false, error: 'User-friendly message' }
```

## Testing

1. Add console.log in handler to verify it's called
2. Check DevTools Network tab for IPC traffic
3. Test error cases (invalid input, network failure)
