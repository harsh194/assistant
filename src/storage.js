const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_VERSION = 1;

// Default values
const DEFAULT_CONFIG = {
    configVersion: CONFIG_VERSION,
    onboarded: false,
    layout: 'normal'
};

const DEFAULT_CREDENTIALS = {
    apiKey: '',
    googleTranslationApiKey: ''
};

const DEFAULT_PREFERENCES = {
    customPrompt: '',
    selectedProfile: 'interview',
    selectedLanguage: 'en-US',
    selectedScreenshotInterval: '5',
    selectedImageQuality: 'medium',
    advancedMode: false,
    audioMode: 'speaker_only',
    fontSize: 'medium',
    backgroundTransparency: 0.8,
    googleSearchEnabled: false,
    windowWidth: 500,
    windowHeight: 600,
    translationEnabled: false,
    translationSourceLanguage: '',
    translationTargetLanguage: ''
};

const DEFAULT_COPILOT_PREP = {
    goal: '',
    desiredOutcome: '',
    successCriteria: '',
    decisionOwner: '',
    keyTopics: [],
    referenceDocuments: [],
    customNotes: ''
};

const DEFAULT_KEYBINDS = null; // null means use system defaults

const DEFAULT_LIMITS = {
    data: [] // Array of { date: 'YYYY-MM-DD', flash: { count: 0 }, flashLite: { count: 0 } }
};

// Get the config directory path based on OS
function getConfigDir() {
    const platform = os.platform();
    let configDir;

    if (platform === 'win32') {
        configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'assistant-config');
    } else if (platform === 'darwin') {
        configDir = path.join(os.homedir(), 'Library', 'Application Support', 'assistant-config');
    } else {
        configDir = path.join(os.homedir(), '.config', 'assistant-config');
    }

    console.log('[STORAGE DEBUG] Config directory:', configDir);
    console.log('[STORAGE DEBUG] Platform:', platform);
    console.log('[STORAGE DEBUG] Home directory:', os.homedir());
    return configDir;
}

// File paths
function getConfigPath() {
    return path.join(getConfigDir(), 'config.json');
}

function getCredentialsPath() {
    return path.join(getConfigDir(), 'credentials.json');
}

function getPreferencesPath() {
    return path.join(getConfigDir(), 'preferences.json');
}

function getKeybindsPath() {
    return path.join(getConfigDir(), 'keybinds.json');
}

function getLimitsPath() {
    return path.join(getConfigDir(), 'limits.json');
}

function getHistoryDir() {
    return path.join(getConfigDir(), 'history');
}

function getEmbeddingsDir() {
    return path.join(getConfigDir(), 'embeddings');
}

function getCoPilotPrepPath() {
    return path.join(getConfigDir(), 'copilot-prep.json');
}

// Helper to read JSON file safely
function readJsonFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn(`Error reading ${filePath}:`, error.message);
    }
    return defaultValue;
}

// Helper to write JSON file safely
function writeJsonFile(filePath, data) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
        return false;
    }
}

// Check if we need to reset (no configVersion or wrong version)
function needsReset() {
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) {
        return true;
    }

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return !config.configVersion || config.configVersion !== CONFIG_VERSION;
    } catch {
        return true;
    }
}

// Wipe and reinitialize the config directory
function resetConfigDir() {
    const configDir = getConfigDir();

    console.log('Resetting config directory...');

    // Remove existing directory if it exists
    if (fs.existsSync(configDir)) {
        fs.rmSync(configDir, { recursive: true, force: true });
    }

    // Create fresh directory structure
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(getHistoryDir(), { recursive: true });
    fs.mkdirSync(getEmbeddingsDir(), { recursive: true });

    // Initialize with defaults
    writeJsonFile(getConfigPath(), DEFAULT_CONFIG);
    writeJsonFile(getCredentialsPath(), DEFAULT_CREDENTIALS);
    writeJsonFile(getPreferencesPath(), DEFAULT_PREFERENCES);

    console.log('Config directory initialized with defaults');
}

// Initialize storage - call this on app startup
function initializeStorage() {
    if (needsReset()) {
        resetConfigDir();
    } else {
        // Ensure history and embeddings directories exist
        const historyDir = getHistoryDir();
        if (!fs.existsSync(historyDir)) {
            fs.mkdirSync(historyDir, { recursive: true });
        }
        const embeddingsDir = getEmbeddingsDir();
        if (!fs.existsSync(embeddingsDir)) {
            fs.mkdirSync(embeddingsDir, { recursive: true });
        }
    }
}

// ============ CONFIG ============

function getConfig() {
    return readJsonFile(getConfigPath(), DEFAULT_CONFIG);
}

function setConfig(config) {
    const current = getConfig();
    const updated = { ...current, ...config, configVersion: CONFIG_VERSION };
    return writeJsonFile(getConfigPath(), updated);
}

function updateConfig(key, value) {
    const config = getConfig();
    config[key] = value;
    return writeJsonFile(getConfigPath(), config);
}

// ============ CREDENTIALS ============

function getCredentials() {
    return readJsonFile(getCredentialsPath(), DEFAULT_CREDENTIALS);
}

function setCredentials(credentials) {
    const current = getCredentials();
    const updated = { ...current, ...credentials };
    return writeJsonFile(getCredentialsPath(), updated);
}

function getApiKey() {
    return getCredentials().apiKey || '';
}

function setApiKey(apiKey) {
    return setCredentials({ apiKey });
}

function getGoogleTranslationApiKey() {
    const credentials = getCredentials();
    const key = credentials.googleTranslationApiKey || '';
    console.log('[TRANSLATION DEBUG] getGoogleTranslationApiKey called');
    console.log('[TRANSLATION DEBUG] Credentials file path:', getCredentialsPath());
    console.log('[TRANSLATION DEBUG] Key exists in credentials:', !!key);
    console.log('[TRANSLATION DEBUG] Key length:', key.length);
    return key;
}

function setGoogleTranslationApiKey(googleTranslationApiKey) {
    console.log('[TRANSLATION DEBUG] setGoogleTranslationApiKey called');
    console.log('[TRANSLATION DEBUG] Setting key, length:', googleTranslationApiKey ? googleTranslationApiKey.length : 0);
    console.log('[TRANSLATION DEBUG] Credentials path:', getCredentialsPath());
    const result = setCredentials({ googleTranslationApiKey });
    console.log('[TRANSLATION DEBUG] setCredentials result:', result);
    return result;
}

// ============ PREFERENCES ============

function getPreferences() {
    const saved = readJsonFile(getPreferencesPath(), {});
    return { ...DEFAULT_PREFERENCES, ...saved };
}

function setPreferences(preferences) {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    return writeJsonFile(getPreferencesPath(), updated);
}

function updatePreference(key, value) {
    const preferences = getPreferences();
    preferences[key] = value;
    return writeJsonFile(getPreferencesPath(), preferences);
}

// ============ KEYBINDS ============

function getKeybinds() {
    return readJsonFile(getKeybindsPath(), DEFAULT_KEYBINDS);
}

function setKeybinds(keybinds) {
    return writeJsonFile(getKeybindsPath(), keybinds);
}

// ============ LIMITS (Rate Limiting) ============

function getLimits() {
    return readJsonFile(getLimitsPath(), DEFAULT_LIMITS);
}

function setLimits(limits) {
    return writeJsonFile(getLimitsPath(), limits);
}

function getTodayDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getTodayLimits() {
    const limits = getLimits();
    const today = getTodayDateString();

    // Find today's entry
    const todayEntry = limits.data.find(entry => entry.date === today);

    if (todayEntry) {
        return todayEntry;
    }

    // No entry for today - clear old entries and create new one
    limits.data = [];
    const newEntry = {
        date: today,
        flash: { count: 0 },
        flashLite: { count: 0 }
    };
    limits.data.push(newEntry);
    setLimits(limits);

    return newEntry;
}

function incrementLimitCount(model) {
    const limits = getLimits();
    const today = getTodayDateString();

    // Find or create today's entry
    let todayEntry = limits.data.find(entry => entry.date === today);

    if (!todayEntry) {
        // Clean old entries and create new one
        limits.data = [];
        todayEntry = {
            date: today,
            flash: { count: 0 },
            flashLite: { count: 0 }
        };
        limits.data.push(todayEntry);
    } else {
        // Clean old entries, keep only today
        limits.data = limits.data.filter(entry => entry.date === today);
    }

    // Increment the appropriate model count
    if (model === 'gemini-2.5-flash') {
        todayEntry.flash.count++;
    } else if (model === 'gemini-2.5-flash-lite') {
        todayEntry.flashLite.count++;
    }

    setLimits(limits);
    return todayEntry;
}

function getAvailableModel() {
    const todayLimits = getTodayLimits();

    // RPD limits: flash = 20, flash-lite = 20
    // After both exhausted, fall back to flash (for paid API users)
    if (todayLimits.flash.count < 20) {
        return 'gemini-2.5-flash';
    } else if (todayLimits.flashLite.count < 20) {
        return 'gemini-2.5-flash-lite';
    }

    return 'gemini-2.5-flash'; // Default to flash for paid API users
}

// ============ HISTORY ============

function getSessionPath(sessionId) {
    return path.join(getHistoryDir(), `${sessionId}.json`);
}

function saveSession(sessionId, data) {
    const sessionPath = getSessionPath(sessionId);

    // Load existing session to preserve metadata
    const existingSession = readJsonFile(sessionPath, null);

    const sessionData = {
        sessionId,
        createdAt: existingSession?.createdAt || parseInt(sessionId),
        lastUpdated: Date.now(),
        // Profile context - set once when session starts
        profile: data.profile || existingSession?.profile || null,
        customPrompt: data.customPrompt || existingSession?.customPrompt || null,
        // Conversation data
        conversationHistory: data.conversationHistory || existingSession?.conversationHistory || [],
        screenAnalysisHistory: data.screenAnalysisHistory || existingSession?.screenAnalysisHistory || [],
        // Co-pilot data
        copilotPrep: data.copilotPrep || existingSession?.copilotPrep || null,
        sessionNotes: data.sessionNotes || existingSession?.sessionNotes || null,
        summary: data.summary || existingSession?.summary || null
    };
    return writeJsonFile(sessionPath, sessionData);
}

function getSession(sessionId) {
    return readJsonFile(getSessionPath(sessionId), null);
}

function getAllSessions() {
    const historyDir = getHistoryDir();

    try {
        if (!fs.existsSync(historyDir)) {
            return [];
        }

        const files = fs.readdirSync(historyDir)
            .filter(f => f.endsWith('.json'))
            .sort((a, b) => {
                // Sort by timestamp descending (newest first)
                const tsA = parseInt(a.replace('.json', ''));
                const tsB = parseInt(b.replace('.json', ''));
                return tsB - tsA;
            });

        return files.map(file => {
            const sessionId = file.replace('.json', '');
            const data = readJsonFile(path.join(historyDir, file), null);
            if (data) {
                return {
                    sessionId,
                    createdAt: data.createdAt,
                    lastUpdated: data.lastUpdated,
                    messageCount: data.conversationHistory?.length || 0,
                    screenAnalysisCount: data.screenAnalysisHistory?.length || 0,
                    profile: data.profile || null,
                    customPrompt: data.customPrompt || null,
                    hasCopilot: !!data.copilotPrep,
                    hasSummary: !!data.summary,
                    goal: data.copilotPrep?.goal || null,
                    firstMessage: data.conversationHistory?.[0]?.transcription || null
                };
            }
            return null;
        }).filter(Boolean);
    } catch (error) {
        console.error('Error reading sessions:', error.message);
        return [];
    }
}

function deleteSession(sessionId) {
    const sessionPath = getSessionPath(sessionId);
    try {
        if (fs.existsSync(sessionPath)) {
            fs.unlinkSync(sessionPath);
            return true;
        }
    } catch (error) {
        console.error('Error deleting session:', error.message);
    }
    return false;
}

function deleteAllSessions() {
    const historyDir = getHistoryDir();
    try {
        if (fs.existsSync(historyDir)) {
            const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
            files.forEach(file => {
                fs.unlinkSync(path.join(historyDir, file));
            });
        }
        return true;
    } catch (error) {
        console.error('Error deleting all sessions:', error.message);
        return false;
    }
}

// ============ CO-PILOT PREP ============

function getCoPilotPrep() {
    const saved = readJsonFile(getCoPilotPrepPath(), {});
    return { ...DEFAULT_COPILOT_PREP, ...saved };
}

function setCoPilotPrep(data) {
    const current = getCoPilotPrep();
    const updated = { ...current, ...data };
    return writeJsonFile(getCoPilotPrepPath(), updated);
}

function updateCoPilotPrepField(key, value) {
    const prep = getCoPilotPrep();
    prep[key] = value;
    return writeJsonFile(getCoPilotPrepPath(), prep);
}

function clearCoPilotPrep() {
    return writeJsonFile(getCoPilotPrepPath(), DEFAULT_COPILOT_PREP);
}

// ============ CUSTOM PROFILES ============

function getCustomProfilesPath() {
    return path.join(getConfigDir(), 'custom-profiles.json');
}

function getCustomProfiles() {
    return readJsonFile(getCustomProfilesPath(), []);
}

function saveCustomProfile(profile) {
    const profiles = getCustomProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
        profiles[index] = profile;
    } else {
        profiles.push(profile);
    }
    return writeJsonFile(getCustomProfilesPath(), profiles);
}

function deleteCustomProfile(profileId) {
    const profiles = getCustomProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    return writeJsonFile(getCustomProfilesPath(), filtered);
}

// ============ EMBEDDINGS ============

function saveEmbeddings(docId, data) {
    const filePath = path.join(getEmbeddingsDir(), `${docId}.json`);
    return writeJsonFile(filePath, data);
}

function getEmbeddings(docId) {
    const filePath = path.join(getEmbeddingsDir(), `${docId}.json`);
    return readJsonFile(filePath, null);
}

function deleteEmbeddings(docId) {
    const filePath = path.join(getEmbeddingsDir(), `${docId}.json`);
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
    } catch (error) {
        console.error('Error deleting embeddings:', error.message);
    }
    return false;
}

function getAllEmbeddings() {
    const embeddingsDir = getEmbeddingsDir();
    try {
        if (!fs.existsSync(embeddingsDir)) return [];

        const files = fs.readdirSync(embeddingsDir).filter(f => f.endsWith('.json'));
        return files.map(file => readJsonFile(path.join(embeddingsDir, file), null)).filter(Boolean);
    } catch (error) {
        console.error('Error reading embeddings:', error.message);
        return [];
    }
}

function clearAllEmbeddings() {
    const embeddingsDir = getEmbeddingsDir();
    try {
        if (fs.existsSync(embeddingsDir)) {
            fs.rmSync(embeddingsDir, { recursive: true, force: true });
            fs.mkdirSync(embeddingsDir, { recursive: true });
        }
        return true;
    } catch (error) {
        console.error('Error clearing embeddings:', error.message);
        return false;
    }
}

// ============ TEMPLATES ============

function getTemplatesPath() {
    return path.join(getConfigDir(), 'templates.json');
}

function getTemplates() {
    return readJsonFile(getTemplatesPath(), []);
}

function saveTemplate(template) {
    const templates = getTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    if (index >= 0) {
        templates[index] = template;
    } else {
        templates.push(template);
    }
    return writeJsonFile(getTemplatesPath(), templates);
}

function deleteTemplate(templateId) {
    const templates = getTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    return writeJsonFile(getTemplatesPath(), filtered);
}

// ============ CLEAR ALL DATA ============

function clearAllData() {
    resetConfigDir();
    return true;
}

module.exports = {
    // Initialization
    initializeStorage,
    getConfigDir,

    // Config
    getConfig,
    setConfig,
    updateConfig,

    // Credentials
    getCredentials,
    setCredentials,
    getApiKey,
    setApiKey,
    getGoogleTranslationApiKey,
    setGoogleTranslationApiKey,

    // Preferences
    getPreferences,
    setPreferences,
    updatePreference,

    // Keybinds
    getKeybinds,
    setKeybinds,

    // Limits (Rate Limiting)
    getLimits,
    setLimits,
    getTodayLimits,
    incrementLimitCount,
    getAvailableModel,

    // History
    saveSession,
    getSession,
    getAllSessions,
    deleteSession,
    deleteAllSessions,

    // Co-Pilot Prep
    getCoPilotPrep,
    setCoPilotPrep,
    updateCoPilotPrepField,
    clearCoPilotPrep,

    // Templates
    getTemplates,
    saveTemplate,
    deleteTemplate,

    // Custom Profiles
    getCustomProfiles,
    saveCustomProfile,
    deleteCustomProfile,

    // Embeddings
    getEmbeddingsDir,
    saveEmbeddings,
    getEmbeddings,
    deleteEmbeddings,
    getAllEmbeddings,
    clearAllEmbeddings,

    // Clear all
    clearAllData
};
