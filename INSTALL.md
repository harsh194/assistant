# Installation Guide

## Windows

1. Download `Assistant-0.5.0.Setup.exe` from [Releases](https://github.com/harsh194/assistant/releases/latest)
2. Run the installer
3. Follow the setup wizard
4. Launch Assistant from Start Menu

---

## macOS (Apple Silicon - M1/M2/M3)

### Step 1: Download
Download `Assistant-0.5.0-arm64.dmg` from [Releases](https://github.com/harsh194/assistant/releases/latest)

### Step 2: Install
1. Double-click the `.dmg` file to mount it
2. Drag `Assistant.app` to your **Applications** folder

### Step 3: Fix "App is damaged" Error

Since the app is not code-signed, macOS Gatekeeper will block it. You'll see:

> "Assistant" is damaged and can't be opened. You should move it to the Trash.

**To fix this, open Terminal and run:**

```bash
xattr -cr /Applications/Assistant.app
```

### Step 4: Launch
Double-click `Assistant.app` in your Applications folder.

---

### Alternative Method (No Terminal)

If you prefer not to use Terminal:

1. **Right-click** (or Control+click) on `Assistant.app`
2. Select **"Open"** from the context menu
3. Click **"Open"** in the security dialog that appears

This tells macOS you trust the app.

---

## First-Time Setup

After launching Assistant:

1. Get a free [Gemini API key](https://aistudio.google.com/apikey)
2. Enter your API key in the app settings
3. Start using Assistant!

---

## Troubleshooting

### "App is damaged" error
Run in Terminal:
```bash
xattr -cr /Applications/Assistant.app
```

### App won't open after fix
Try restarting your Mac, then run the `xattr` command again.

### Need Intel Mac version?
Currently only Apple Silicon (M1/M2/M3) is supported. Intel Mac support coming soon.

---

## Uninstall

### macOS
Drag `Assistant.app` from Applications to Trash.

### Windows
Use "Add or Remove Programs" in Windows Settings.
