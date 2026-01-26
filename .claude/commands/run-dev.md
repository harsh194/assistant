---
description: Start the Electron app in development mode
---

# Run Development Server

Start the assistant app in development mode with hot reload.

## Command

```bash
npm start
```

## What This Does

1. Starts Electron Forge development server
2. Opens the app window
3. Enables DevTools for debugging
4. Watches for file changes

## Debugging Tips

- Press `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open DevTools
- Check main process logs in the terminal
- Check renderer logs in DevTools console

## Common Issues

**App doesn't start:**
- Check if another instance is running
- Verify `npm install` was run
- Check for syntax errors in main process

**White screen:**
- Check DevTools for JavaScript errors
- Verify preload script path is correct
- Check for missing dependencies
