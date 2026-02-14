if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain, dialog, nativeTheme } = require('electron');
const path = require('path');
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer, generateSessionSummary } = require('./utils/gemini');
const { parseDocument, getFileDialogFilters } = require('./utils/documentParser');
const { exportNotesToDocx } = require('./utils/notesExporter');
const { chunkText } = require('./utils/chunker');
const { generateEmbeddings } = require('./utils/embeddings');
const storage = require('./storage');

const geminiSessionRef = { current: null };
let mainWindow = null;

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef);
    return mainWindow;
}

app.whenReady().then(async () => {
    // Initialize storage (checks version, resets if needed)
    storage.initializeStorage();

    createMainWindow();
    setupGeminiIpcHandlers(geminiSessionRef);
    setupStorageIpcHandlers();
    setupGeneralIpcHandlers();

    // System theme detection - notify renderer when OS theme changes
    nativeTheme.on('updated', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('native-theme-changed', nativeTheme.shouldUseDarkColors);
        }
    });
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupStorageIpcHandlers() {
    // ============ CONFIG ============
    ipcMain.handle('storage:get-config', async () => {
        try {
            return { success: true, data: storage.getConfig() };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-config', async (event, config) => {
        try {
            storage.setConfig(config);
            return { success: true };
        } catch (error) {
            console.error('Error setting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:update-config', async (event, key, value) => {
        try {
            storage.updateConfig(key, value);
            return { success: true };
        } catch (error) {
            console.error('Error updating config:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CREDENTIALS ============
    ipcMain.handle('storage:get-credentials', async () => {
        try {
            return { success: true, data: storage.getCredentials() };
        } catch (error) {
            console.error('Error getting credentials:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-credentials', async (event, credentials) => {
        try {
            storage.setCredentials(credentials);
            return { success: true };
        } catch (error) {
            console.error('Error setting credentials:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:get-api-key', async () => {
        try {
            return { success: true, data: storage.getApiKey() };
        } catch (error) {
            console.error('Error getting API key:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-api-key', async (event, apiKey) => {
        try {
            storage.setApiKey(apiKey);
            return { success: true };
        } catch (error) {
            console.error('Error setting API key:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ PREFERENCES ============
    ipcMain.handle('storage:get-preferences', async () => {
        try {
            return { success: true, data: storage.getPreferences() };
        } catch (error) {
            console.error('Error getting preferences:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-preferences', async (event, preferences) => {
        try {
            storage.setPreferences(preferences);
            return { success: true };
        } catch (error) {
            console.error('Error setting preferences:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:update-preference', async (event, key, value) => {
        try {
            storage.updatePreference(key, value);
            return { success: true };
        } catch (error) {
            console.error('Error updating preference:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ KEYBINDS ============
    ipcMain.handle('storage:get-keybinds', async () => {
        try {
            return { success: true, data: storage.getKeybinds() };
        } catch (error) {
            console.error('Error getting keybinds:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-keybinds', async (event, keybinds) => {
        try {
            storage.setKeybinds(keybinds);
            return { success: true };
        } catch (error) {
            console.error('Error setting keybinds:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ HISTORY ============
    ipcMain.handle('storage:get-all-sessions', async () => {
        try {
            return { success: true, data: storage.getAllSessions() };
        } catch (error) {
            console.error('Error getting sessions:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:get-session', async (event, sessionId) => {
        try {
            return { success: true, data: storage.getSession(sessionId) };
        } catch (error) {
            console.error('Error getting session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:save-session', async (event, sessionId, data) => {
        try {
            storage.saveSession(sessionId, data);
            return { success: true };
        } catch (error) {
            console.error('Error saving session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-session', async (event, sessionId) => {
        try {
            storage.deleteSession(sessionId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-all-sessions', async () => {
        try {
            storage.deleteAllSessions();
            return { success: true };
        } catch (error) {
            console.error('Error deleting all sessions:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ LIMITS ============
    ipcMain.handle('storage:get-today-limits', async () => {
        try {
            return { success: true, data: storage.getTodayLimits() };
        } catch (error) {
            console.error('Error getting today limits:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CO-PILOT PREP ============
    ipcMain.handle('storage:get-copilot-prep', async () => {
        try {
            return { success: true, data: storage.getCoPilotPrep() };
        } catch (error) {
            console.error('Error getting co-pilot prep:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-copilot-prep', async (event, data) => {
        try {
            storage.setCoPilotPrep(data);
            return { success: true };
        } catch (error) {
            console.error('Error setting co-pilot prep:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:update-copilot-prep', async (event, key, value) => {
        try {
            storage.updateCoPilotPrepField(key, value);
            return { success: true };
        } catch (error) {
            console.error('Error updating co-pilot prep:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:clear-copilot-prep', async () => {
        try {
            storage.clearCoPilotPrep();
            return { success: true };
        } catch (error) {
            console.error('Error clearing co-pilot prep:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ TEMPLATES ============
    ipcMain.handle('storage:get-templates', async () => {
        try {
            return { success: true, data: storage.getTemplates() };
        } catch (error) {
            console.error('Error getting templates:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:save-template', async (event, template) => {
        try {
            storage.saveTemplate(template);
            return { success: true };
        } catch (error) {
            console.error('Error saving template:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-template', async (event, templateId) => {
        try {
            storage.deleteTemplate(templateId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting template:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CUSTOM PROFILES ============
    ipcMain.handle('storage:get-custom-profiles', async () => {
        try {
            return { success: true, data: storage.getCustomProfiles() };
        } catch (error) {
            console.error('Error getting custom profiles:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:save-custom-profile', async (event, profile) => {
        try {
            storage.saveCustomProfile(profile);
            return { success: true };
        } catch (error) {
            console.error('Error saving custom profile:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-custom-profile', async (event, profileId) => {
        try {
            storage.deleteCustomProfile(profileId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting custom profile:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CLEAR ALL ============
    ipcMain.handle('storage:clear-all', async () => {
        try {
            storage.clearAllData();
            return { success: true };
        } catch (error) {
            console.error('Error clearing all data:', error);
            return { success: false, error: error.message };
        }
    });
}

function setupGeneralIpcHandlers() {
    ipcMain.handle('get-app-version', async () => {
        return app.getVersion();
    });

    ipcMain.handle('get-native-theme', async () => {
        return { success: true, data: { shouldUseDarkColors: nativeTheme.shouldUseDarkColors } };
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            // Also save to storage
            storage.setKeybinds(newKeybinds);
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
            // Notify renderer components that keybinds have been updated
            mainWindow.webContents.send('keybinds-updated', newKeybinds);
        }
    });

    // Debug logging from renderer
    ipcMain.on('log-message', (event, msg) => {
        console.log(msg);
    });

    // ============ CO-PILOT DOCUMENT HANDLERS ============
    ipcMain.handle('copilot:open-file-dialog', async () => {
        try {
            const result = await dialog.showOpenDialog(mainWindow, {
                properties: ['openFile'],
                filters: getFileDialogFilters(),
            });

            if (result.canceled || result.filePaths.length === 0) {
                return { success: false, error: 'No file selected' };
            }

            const filePath = result.filePaths[0];
            const fileName = path.basename(filePath);
            const fs = require('fs');
            const stats = fs.statSync(filePath);

            // Parse document
            if (mainWindow) mainWindow.webContents.send('document-upload-progress', { stage: 'parsing' });
            const parsed = await parseDocument(filePath);
            if (!parsed.success) {
                return { success: false, error: parsed.error };
            }

            // Generate docId for embedding storage
            const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const docId = `${Date.now()}-${sanitizedName}`;

            // Chunk and embed in background (non-blocking for the return value)
            let embeddingSuccess = false;
            let embeddingError = null;
            try {
                if (mainWindow) mainWindow.webContents.send('document-upload-progress', { stage: 'embedding' });
                const apiKey = storage.getApiKey();
                if (apiKey && parsed.text.length > 0) {
                    const chunks = chunkText(parsed.text, docId);
                    if (chunks.length > 0) {
                        const chunkTexts = chunks.map(c => c.text);
                        const embeddings = await generateEmbeddings(apiKey, chunkTexts);

                        // Attach embeddings to chunks
                        const embeddedChunks = chunks.map((chunk, i) => ({
                            ...chunk,
                            embedding: embeddings[i] || null,
                        }));

                        storage.saveEmbeddings(docId, {
                            docId,
                            docName: fileName,
                            chunks: embeddedChunks,
                            createdAt: Date.now(),
                        });
                        embeddingSuccess = true;
                        console.log(`Embedded ${embeddedChunks.length} chunks for ${fileName}`);
                    }
                }
            } catch (embError) {
                embeddingError = embError.message;
                console.warn('Embedding generation failed (document still usable):', embError.message);
            }

            if (mainWindow) mainWindow.webContents.send('document-upload-progress', { stage: 'done' });

            return {
                success: true,
                data: {
                    name: fileName,
                    path: filePath,
                    extractedText: parsed.text,
                    size: stats.size,
                    mimeType: path.extname(filePath).toLowerCase(),
                    docId,
                    hasEmbeddings: embeddingSuccess,
                    embeddingError,
                }
            };
        } catch (error) {
            console.error('Error opening file dialog:', error);
            if (mainWindow) mainWindow.webContents.send('document-upload-progress', { stage: 'error' });
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('copilot:parse-document', async (event, filePath) => {
        try {
            const parsed = await parseDocument(filePath);
            if (!parsed.success) {
                return { success: false, error: parsed.error };
            }

            const fileName = path.basename(filePath);
            const fs = require('fs');
            const stats = fs.statSync(filePath);

            return {
                success: true,
                data: {
                    name: fileName,
                    path: filePath,
                    extractedText: parsed.text,
                    size: stats.size,
                    mimeType: path.extname(filePath).toLowerCase(),
                }
            };
        } catch (error) {
            console.error('Error parsing document:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('copilot:delete-document-embeddings', async (event, docId) => {
        try {
            const success = storage.deleteEmbeddings(docId);
            return { success };
        } catch (error) {
            console.error('Error deleting embeddings:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('copilot:get-all-embeddings', async () => {
        try {
            const embeddings = storage.getAllEmbeddings();
            return { success: true, data: embeddings };
        } catch (error) {
            console.error('Error getting embeddings:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('copilot:generate-summary', async (event, { prepData, notes, responses, profile }) => {
        try {
            const result = await generateSessionSummary({ prepData, notes, responses, profile });
            return result;
        } catch (error) {
            console.error('Error generating summary:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('copilot:export-notes', async (event, { summary, prepData, notes, profile }) => {
        try {
            const buffer = await exportNotesToDocx({ summary, prepData, notes, profile });
            if (!buffer || buffer.length === 0) {
                return { success: false, error: 'Failed to generate document' };
            }

            const result = await dialog.showSaveDialog(mainWindow, {
                title: 'Save Session Notes',
                defaultPath: `session-notes-${new Date().toISOString().slice(0, 10)}.docx`,
                filters: [{ name: 'Word Document', extensions: ['docx'] }],
            });

            if (result.canceled || !result.filePath) {
                return { success: false, error: 'Save cancelled' };
            }

            const fs = require('fs').promises;
            await fs.writeFile(result.filePath, buffer);
            return { success: true, data: { filePath: result.filePath } };
        } catch (error) {
            console.error('Error exporting notes:', error);
            return { success: false, error: error.message };
        }
    });
}
