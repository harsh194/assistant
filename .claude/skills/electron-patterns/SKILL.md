---
name: electron-patterns
description: Electron desktop app development patterns, window management, and cross-platform best practices.
---

# Electron Development Patterns

Best practices for building robust Electron desktop applications.

## Window Management

### Creating Windows

```javascript
const { BrowserWindow } = require('electron')
const path = require('path')

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Show when ready to prevent flash
  win.once('ready-to-show', () => {
    win.show()
  })

  win.loadFile('index.html')
  return win
}
```

### Frameless Window with Custom Title Bar

```javascript
const win = new BrowserWindow({
  frame: false,
  titleBarStyle: 'hidden',
  trafficLightPosition: { x: 10, y: 10 }, // macOS
  webPreferences: { ... }
})

// Enable drag on title bar element
// In CSS: -webkit-app-region: drag;
// For buttons: -webkit-app-region: no-drag;
```

### Always on Top

```javascript
win.setAlwaysOnTop(true, 'floating')
win.setVisibleOnAllWorkspaces(true)
```

## App Lifecycle

### Ready Event

```javascript
app.whenReady().then(() => {
  createMainWindow()

  // macOS: Re-create window when dock icon clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})
```

### Window All Closed

```javascript
app.on('window-all-closed', () => {
  // Quit on all platforms except macOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

### Before Quit Cleanup

```javascript
app.on('before-quit', () => {
  // Cleanup resources
  stopBackgroundTasks()
  saveState()
})
```

## Global Shortcuts

```javascript
const { globalShortcut } = require('electron')

app.whenReady().then(() => {
  // Register shortcut
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    win.isVisible() ? win.hide() : win.show()
  })
})

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll()
})
```

## Tray Icon

```javascript
const { Tray, Menu } = require('electron')

let tray = null

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Quit', click: () => app.quit() }
  ])

  tray.setToolTip('My App')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })
})
```

## Storage Patterns

### User Data Directory

```javascript
const { app } = require('electron')
const path = require('path')
const fs = require('fs')

const userDataPath = app.getPath('userData')
const configPath = path.join(userDataPath, 'config.json')

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'))
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
  return getDefaultConfig()
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}
```

### Secure Credential Storage

```javascript
const { safeStorage } = require('electron')

function encryptCredential(value) {
  if (safeStorage.isEncryptionAvailable()) {
    return safeStorage.encryptString(value)
  }
  return Buffer.from(value)
}

function decryptCredential(buffer) {
  if (safeStorage.isEncryptionAvailable()) {
    return safeStorage.decryptString(buffer)
  }
  return buffer.toString()
}
```

## Cross-Platform Considerations

### Platform Detection

```javascript
const isMac = process.platform === 'darwin'
const isWindows = process.platform === 'win32'
const isLinux = process.platform === 'linux'
```

### Platform-Specific Paths

```javascript
// Use path.join for cross-platform paths
const iconPath = path.join(__dirname, 'assets', 'icon.png')

// Platform-specific icons
const icon = isMac
  ? path.join(__dirname, 'assets', 'icon.icns')
  : path.join(__dirname, 'assets', 'icon.png')
```

### Keyboard Shortcuts

```javascript
// Use CommandOrControl for cross-platform shortcuts
const accelerator = 'CommandOrControl+S' // Cmd+S on Mac, Ctrl+S elsewhere
```

## Error Handling

### Uncaught Exceptions

```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  // Log to file, show dialog, etc.
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})
```

### Renderer Crash Handling

```javascript
win.webContents.on('crashed', () => {
  const choice = dialog.showMessageBoxSync({
    type: 'error',
    title: 'Process Crashed',
    message: 'The window has crashed. Would you like to reload?',
    buttons: ['Reload', 'Close']
  })

  if (choice === 0) {
    win.reload()
  } else {
    win.close()
  }
})
```

## Performance Tips

1. **Lazy Loading**: Load heavy modules only when needed
2. **Background Throttling**: Disable for background tasks
3. **Hardware Acceleration**: Disable if causing issues
4. **DevTools**: Remove in production builds
5. **Preload Caching**: Cache frequently used data

```javascript
// Disable background throttling
win.webContents.setBackgroundThrottling(false)

// Disable hardware acceleration if needed
app.disableHardwareAcceleration()
```
