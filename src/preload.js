const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_RECEIVE_CHANNELS = [
    'new-response', 'update-response', 'update-status',
    'navigate-previous-response', 'navigate-next-response',
    'scroll-response-up', 'scroll-response-down',
    'click-through-toggled', 'reconnect-failed',
    'response-complete', 'request-cancelled',
    'save-conversation-turn', 'save-session-context', 'save-screen-analysis',
    'clear-sensitive-data', 'session-initializing',
    'document-upload-progress',
    'native-theme-changed',
    'translation-result',
];

contextBridge.exposeInMainWorld('electronAPI', {
    // Storage
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

    // IPC event listeners (main -> renderer)
    on: (channel, callback) => {
        if (ALLOWED_RECEIVE_CHANNELS.includes(channel)) {
            const subscription = (event, ...args) => callback(...args);
            ipcRenderer.on(channel, subscription);
            return () => ipcRenderer.removeListener(channel, subscription);
        }
    },

    removeAllListeners: (channel) => {
        if (ALLOWED_RECEIVE_CHANNELS.includes(channel)) {
            ipcRenderer.removeAllListeners(channel);
        }
    },

    // IPC send (fire-and-forget)
    send: (channel, ...args) => {
        const allowedSendChannels = ['update-keybinds', 'view-changed', 'log-message'];
        if (allowedSendChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        }
    },

    // Platform info
    platform: process.platform,
});
