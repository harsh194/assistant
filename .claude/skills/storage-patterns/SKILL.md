---
name: storage-patterns
description: JSON file-based storage patterns for Electron apps - persistence, versioning, and migration.
---

# Storage Patterns for Electron

Best practices for file-based data persistence in Electron applications.

## Storage Architecture

### User Data Directory

```javascript
const { app } = require('electron')
const path = require('path')
const fs = require('fs')

// Standard paths
const userDataPath = app.getPath('userData')
const configPath = path.join(userDataPath, 'config.json')
const credentialsPath = path.join(userDataPath, 'credentials.json')
const preferencesPath = path.join(userDataPath, 'preferences.json')
const sessionsDir = path.join(userDataPath, 'sessions')
```

### Storage Manager Class

```javascript
class Storage {
  constructor(filePath, defaults = {}) {
    this.filePath = filePath
    this.defaults = defaults
    this.data = this._load()
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8')
        return { ...this.defaults, ...JSON.parse(content) }
      }
    } catch (error) {
      console.error('Failed to load storage:', error)
    }
    return { ...this.defaults }
  }

  _save() {
    try {
      const dir = path.dirname(this.filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error('Failed to save storage:', error)
    }
  }

  get(key) {
    return this.data[key]
  }

  set(key, value) {
    this.data[key] = value
    this._save()
  }

  getAll() {
    return { ...this.data }
  }

  setAll(data) {
    this.data = { ...this.defaults, ...data }
    this._save()
  }

  clear() {
    this.data = { ...this.defaults }
    this._save()
  }
}
```

## Version Management

### Schema Versioning

```javascript
const CURRENT_VERSION = '0.5.0'

function initializeStorage() {
  const config = loadConfig()

  if (!config.version || config.version !== CURRENT_VERSION) {
    migrateStorage(config.version, CURRENT_VERSION)
    saveConfig({ ...config, version: CURRENT_VERSION })
  }
}

function migrateStorage(fromVersion, toVersion) {
  console.log(`Migrating storage from ${fromVersion} to ${toVersion}`)

  // Version-specific migrations
  if (!fromVersion || fromVersion < '0.3.0') {
    migrateToV030()
  }
  if (fromVersion < '0.5.0') {
    migrateToV050()
  }
}

function migrateToV030() {
  // Example: Rename fields, restructure data
  const oldPrefs = loadFile('user-preferences.json')
  if (oldPrefs) {
    saveFile('preferences.json', oldPrefs)
    deleteFile('user-preferences.json')
  }
}
```

## Session Storage

### Session Management

```javascript
// Get all sessions (metadata only)
function getAllSessions() {
  const sessions = []

  if (!fs.existsSync(sessionsDir)) {
    return sessions
  }

  const files = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.json'))

  for (const file of files) {
    try {
      const content = fs.readFileSync(
        path.join(sessionsDir, file),
        'utf8'
      )
      const session = JSON.parse(content)
      sessions.push({
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messages?.length || 0
      })
    } catch (error) {
      console.error('Failed to load session:', file, error)
    }
  }

  return sessions.sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )
}

// Get single session with full data
function getSession(sessionId) {
  const filePath = path.join(sessionsDir, `${sessionId}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(content)
}

// Save session
function saveSession(sessionId, data) {
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true })
  }

  const filePath = path.join(sessionsDir, `${sessionId}.json`)
  const session = {
    ...data,
    id: sessionId,
    updatedAt: new Date().toISOString()
  }

  if (!session.createdAt) {
    session.createdAt = session.updatedAt
  }

  fs.writeFileSync(filePath, JSON.stringify(session, null, 2))
}

// Delete session
function deleteSession(sessionId) {
  const filePath = path.join(sessionsDir, `${sessionId}.json`)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

// Delete all sessions
function deleteAllSessions() {
  if (fs.existsSync(sessionsDir)) {
    const files = fs.readdirSync(sessionsDir)
    for (const file of files) {
      fs.unlinkSync(path.join(sessionsDir, file))
    }
  }
}
```

## Credential Storage

### Secure API Key Storage

```javascript
const { safeStorage } = require('electron')

function saveCredentials(credentials) {
  const toSave = { ...credentials }

  // Encrypt sensitive fields if available
  if (safeStorage.isEncryptionAvailable() && credentials.apiKey) {
    toSave.apiKey = safeStorage
      .encryptString(credentials.apiKey)
      .toString('base64')
    toSave.encrypted = true
  }

  fs.writeFileSync(credentialsPath, JSON.stringify(toSave, null, 2))
}

function loadCredentials() {
  if (!fs.existsSync(credentialsPath)) {
    return { apiKey: '' }
  }

  const content = fs.readFileSync(credentialsPath, 'utf8')
  const credentials = JSON.parse(content)

  // Decrypt if encrypted
  if (credentials.encrypted && safeStorage.isEncryptionAvailable()) {
    const buffer = Buffer.from(credentials.apiKey, 'base64')
    credentials.apiKey = safeStorage.decryptString(buffer)
    delete credentials.encrypted
  }

  return credentials
}
```

## Default Values

### Configuration Defaults

```javascript
const DEFAULT_CONFIG = {
  version: '0.5.0',
  firstRun: true,
  onboardingComplete: false
}

const DEFAULT_PREFERENCES = {
  theme: 'system', // 'light' | 'dark' | 'system'
  fontSize: 14,
  showTimestamps: true,
  soundEnabled: true,
  startMinimized: false,
  startOnLogin: false
}

const DEFAULT_KEYBINDS = {
  toggleWindow: 'CommandOrControl+Shift+Space',
  newSession: 'CommandOrControl+N',
  clearChat: 'CommandOrControl+L'
}
```

## Error Handling

### Safe File Operations

```javascript
function safeReadJson(filePath, defaults = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Failed to read JSON:', filePath, error)
  }
  return defaults
}

function safeWriteJson(filePath, data) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write to temp file first, then rename (atomic write)
    const tempPath = `${filePath}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2))
    fs.renameSync(tempPath, filePath)

    return true
  } catch (error) {
    console.error('Failed to write JSON:', filePath, error)
    return false
  }
}
```

## Usage Limits

### Daily Limit Tracking

```javascript
function getTodayLimits() {
  const today = new Date().toISOString().split('T')[0]
  const limits = safeReadJson(limitsPath, {})

  if (limits.date !== today) {
    return {
      date: today,
      apiCalls: 0,
      tokensUsed: 0
    }
  }

  return limits
}

function incrementUsage(apiCalls = 1, tokens = 0) {
  const limits = getTodayLimits()

  limits.apiCalls += apiCalls
  limits.tokensUsed += tokens

  safeWriteJson(limitsPath, limits)
  return limits
}
```

## Best Practices

1. **Atomic Writes**: Use temp file + rename to prevent corruption
2. **Default Values**: Always provide sensible defaults
3. **Version Migration**: Handle schema changes gracefully
4. **Encryption**: Use safeStorage for sensitive data
5. **Error Recovery**: Handle corrupted files gracefully
6. **Directory Creation**: Always ensure directories exist before writing
