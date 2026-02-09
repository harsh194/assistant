const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const { getApiKey } = require('../storage');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 50000;

const PLAIN_TEXT_EXTENSIONS = ['.txt', '.md', '.markdown'];

const MIME_TYPES = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
};

const EXTRACTION_PROMPT = 'Extract all text content from this document. Return only the extracted text, preserving structure and formatting. Do not add any commentary or explanation.';

function isPlainText(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return PLAIN_TEXT_EXTENSIONS.includes(ext);
}

function parsePlainText(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const truncated = content.length > MAX_TEXT_LENGTH
            ? content.substring(0, MAX_TEXT_LENGTH) + '\n\n[Document truncated]'
            : content;
        return { success: true, text: truncated };
    } catch (error) {
        return { success: false, text: '', error: error.message };
    }
}

async function parseWithGeminiOCR(filePath) {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { success: false, text: '', error: 'No API key configured' };
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext];
    if (!mimeType) {
        return { success: false, text: '', error: `Unsupported file type: ${ext}` };
    }

    try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                    },
                },
                { text: EXTRACTION_PROMPT },
            ],
        });

        const text = response.text || '';
        const truncated = text.length > MAX_TEXT_LENGTH
            ? text.substring(0, MAX_TEXT_LENGTH) + '\n\n[Document truncated]'
            : text;

        return { success: true, text: truncated };
    } catch (error) {
        console.error('Gemini OCR error:', error);
        return { success: false, text: '', error: error.message };
    }
}

async function parseDocument(filePath) {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
        return { success: false, text: '', error: 'File not found' };
    }

    // Validate file size
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
        return { success: false, text: '', error: 'File exceeds 10MB limit' };
    }

    if (stats.size === 0) {
        return { success: false, text: '', error: 'File is empty' };
    }

    // Route to appropriate parser
    if (isPlainText(filePath)) {
        return parsePlainText(filePath);
    }

    return parseWithGeminiOCR(filePath);
}

function getSupportedExtensions() {
    return [...PLAIN_TEXT_EXTENSIONS, ...Object.keys(MIME_TYPES)];
}

function getFileDialogFilters() {
    return [
        { name: 'All Supported', extensions: ['txt', 'md', 'pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'] },
        { name: 'Text Files', extensions: ['txt', 'md'] },
        { name: 'Documents', extensions: ['pdf', 'docx', 'doc'] },
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] },
    ];
}

module.exports = {
    parseDocument,
    getSupportedExtensions,
    getFileDialogFilters,
};
