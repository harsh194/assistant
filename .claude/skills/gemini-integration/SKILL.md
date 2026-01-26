---
name: gemini-integration
description: Google Gemini API integration patterns for AI-powered features.
---

# Gemini API Integration Patterns

Best practices for integrating Google Gemini AI into Electron applications.

## Setup and Configuration

### API Client Setup

```javascript
const { GoogleGenerativeAI } = require('@google/genai')

// Initialize with API key
const genAI = new GoogleGenerativeAI(apiKey)

// Get model instance
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // or 'gemini-1.5-pro'
})
```

### Model Options

```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    topK: 40
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
})
```

## Basic Generation

### Single Prompt

```javascript
async function generate(prompt) {
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

### With System Instruction

```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are a helpful AI assistant.
    Be concise and helpful.
    Format responses with markdown.`
})
```

## Streaming Responses

### Basic Streaming

```javascript
async function streamGenerate(prompt, onChunk) {
  const result = await model.generateContentStream(prompt)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    onChunk(text)
  }
}

// Usage
await streamGenerate('Explain quantum computing', (chunk) => {
  appendToDisplay(chunk)
})
```

### With Progress Tracking

```javascript
async function streamWithProgress(prompt, callbacks) {
  const { onStart, onChunk, onComplete, onError } = callbacks

  try {
    onStart?.()
    const result = await model.generateContentStream(prompt)

    let fullText = ''
    for await (const chunk of result.stream) {
      const text = chunk.text()
      fullText += text
      onChunk?.(text, fullText)
    }

    onComplete?.(fullText)
    return fullText
  } catch (error) {
    onError?.(error)
    throw error
  }
}
```

## Chat Conversations

### Maintaining History

```javascript
class ChatSession {
  constructor(model) {
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000
      }
    })
    this.history = []
  }

  async sendMessage(message) {
    const result = await this.chat.sendMessage(message)
    const response = result.response.text()

    this.history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response }] }
    )

    return response
  }

  getHistory() {
    return this.history
  }

  clearHistory() {
    this.history = []
    this.chat = model.startChat({ history: [] })
  }
}
```

### Context Management

```javascript
// Limit history to prevent token overflow
function trimHistory(history, maxMessages = 20) {
  if (history.length <= maxMessages) {
    return history
  }

  // Keep system message + recent messages
  const systemMessage = history.find(m => m.role === 'system')
  const recentMessages = history.slice(-maxMessages)

  return systemMessage
    ? [systemMessage, ...recentMessages]
    : recentMessages
}
```

## Error Handling

### Comprehensive Error Handler

```javascript
async function safeGenerate(prompt) {
  try {
    const result = await model.generateContent(prompt)
    return {
      success: true,
      data: result.response.text()
    }
  } catch (error) {
    return handleGeminiError(error)
  }
}

function handleGeminiError(error) {
  const message = error.message || ''

  // API key issues
  if (message.includes('API_KEY') || message.includes('401')) {
    return {
      success: false,
      error: 'Invalid API key. Please check your settings.',
      code: 'INVALID_API_KEY'
    }
  }

  // Rate limiting
  if (message.includes('quota') || message.includes('429')) {
    return {
      success: false,
      error: 'API rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT'
    }
  }

  // Safety filters
  if (message.includes('SAFETY') || message.includes('blocked')) {
    return {
      success: false,
      error: 'Response blocked by safety filters.',
      code: 'SAFETY_BLOCK'
    }
  }

  // Content too long
  if (message.includes('token') || message.includes('length')) {
    return {
      success: false,
      error: 'Content too long. Please shorten your input.',
      code: 'TOKEN_LIMIT'
    }
  }

  // Network issues
  if (message.includes('network') || message.includes('ENOTFOUND')) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR'
    }
  }

  // Generic error
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR'
  }
}
```

### Retry Logic

```javascript
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.generateContent(prompt)
    } catch (error) {
      lastError = error

      // Don't retry on certain errors
      if (error.message.includes('API_KEY')) throw error
      if (error.message.includes('SAFETY')) throw error

      // Exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      }
    }
  }

  throw lastError
}
```

## IPC Integration

### Main Process Handler

```javascript
// src/utils/gemini.js
const { ipcMain } = require('electron')

let geminiSession = null

function setupGeminiIpcHandlers(sessionRef) {
  ipcMain.handle('gemini:generate', async (event, prompt) => {
    try {
      if (!sessionRef.current) {
        return { success: false, error: 'Gemini not initialized' }
      }

      const response = await sessionRef.current.sendMessage(prompt)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('gemini:initialize', async (event, apiKey) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      sessionRef.current = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
      }).startChat()

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
```

### Preload Exposure

```javascript
// src/preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  geminiGenerate: (prompt) => ipcRenderer.invoke('gemini:generate', prompt),
  geminiInitialize: (apiKey) => ipcRenderer.invoke('gemini:initialize', apiKey)
})
```

### Renderer Usage

```javascript
// In Lit component
async _sendMessage() {
  this.loading = true

  const result = await window.electronAPI.geminiGenerate(this.inputText)

  if (result.success) {
    this._addMessage('assistant', result.data)
  } else {
    this._showError(result.error)
  }

  this.loading = false
}
```

## Prompt Engineering

### Structured Prompts

```javascript
function createAssistantPrompt(userInput, context) {
  return `You are a helpful AI assistant.

Context:
${context}

User's question:
${userInput}

Please provide a helpful, concise response.`
}
```

### Few-Shot Examples

```javascript
function createFewShotPrompt(task, examples, input) {
  const exampleText = examples
    .map(ex => `Input: ${ex.input}\nOutput: ${ex.output}`)
    .join('\n\n')

  return `Task: ${task}

Examples:
${exampleText}

Input: ${input}
Output:`
}
```

## Best Practices

1. **API Key Security**: Never expose in renderer, use IPC
2. **Streaming UX**: Use streaming for better perceived performance
3. **Error Messages**: Show user-friendly errors, log technical details
4. **Context Limits**: Trim history to stay within token limits
5. **Retry Transient Failures**: Network issues, rate limits
6. **Graceful Degradation**: Handle API unavailability
