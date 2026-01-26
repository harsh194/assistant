---
description: Build distributable packages for the assistant app
---

# Build Application

Create distributable packages for the assistant app.

## Commands

### Package (no installer)

```bash
npm run package
```

Creates an executable without installer in `out/` directory.

### Make (with installer)

```bash
npm run make
```

Creates platform-specific installers:
- **Windows**: Squirrel installer (.exe)
- **macOS**: DMG file
- **Linux**: DEB, RPM, or AppImage

## Build Targets

Configured makers in `forge.config.js`:
- `@electron-forge/maker-squirrel` - Windows
- `@electron-forge/maker-dmg` - macOS
- `@electron-forge/maker-deb` - Debian/Ubuntu
- `@electron-forge/maker-rpm` - Fedora/RHEL
- `@reforged/maker-appimage` - AppImage

## Pre-Build Checklist

- [ ] Remove all `console.log` statements
- [ ] Update version in `package.json`
- [ ] Test on target platform
- [ ] Verify API key handling
- [ ] Check all assets are included

## Output Locations

- Packaged app: `out/assistant-{platform}-{arch}/`
- Installers: `out/make/`
