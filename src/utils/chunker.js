const DEFAULT_CHUNK_SIZE = 1500;
const DEFAULT_OVERLAP = 200;

/**
 * Split text into fixed-size overlapping chunks with intelligent boundary detection.
 * Splits on paragraph > sentence > hard boundaries.
 *
 * @param {string} text - The text to chunk
 * @param {string} docId - Document identifier for chunk IDs
 * @param {object} options - Optional: chunkSize, overlap
 * @returns {Array<{ id: string, text: string, index: number, startChar: number, endChar: number }>}
 */
function chunkText(text, docId, options = {}) {
    if (!text || text.trim().length === 0) return [];

    const chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
    const overlap = options.overlap || DEFAULT_OVERLAP;

    if (text.length <= chunkSize) {
        return [{
            id: `${docId}-chunk-0`,
            text: text.trim(),
            index: 0,
            startChar: 0,
            endChar: text.length,
        }];
    }

    const chunks = [];
    let start = 0;
    let index = 0;

    while (start < text.length) {
        let end = Math.min(start + chunkSize, text.length);

        // If not at the end, find a good split point
        if (end < text.length) {
            end = findSplitPoint(text, start, end);
        }

        const chunkText = text.slice(start, end).trim();
        if (chunkText.length > 0) {
            chunks.push({
                id: `${docId}-chunk-${index}`,
                text: chunkText,
                index,
                startChar: start,
                endChar: end,
            });
            index++;
        }

        // Move start forward by chunkSize minus overlap
        const prevStart = start;
        start = end - overlap;
        if (start <= prevStart) {
            // Avoid infinite loops: ensure forward progress
            start = end;
        }
    }

    return chunks;
}

/**
 * Find the best split point near the target end position.
 * Prefers paragraph > sentence > word boundaries.
 */
function findSplitPoint(text, start, targetEnd) {
    const searchStart = Math.max(start, targetEnd - 300);
    const region = text.slice(searchStart, targetEnd);

    // Try paragraph boundary (double newline)
    const paraIdx = region.lastIndexOf('\n\n');
    if (paraIdx !== -1 && paraIdx > region.length * 0.3) {
        return searchStart + paraIdx + 2;
    }

    // Try sentence boundary (. followed by space or newline)
    const sentenceRegex = /\.\s/g;
    let lastSentenceEnd = -1;
    let match;
    while ((match = sentenceRegex.exec(region)) !== null) {
        if (match.index > region.length * 0.3) {
            lastSentenceEnd = match.index;
        }
    }
    if (lastSentenceEnd !== -1) {
        return searchStart + lastSentenceEnd + 2;
    }

    // Try word boundary (space)
    const spaceIdx = region.lastIndexOf(' ');
    if (spaceIdx !== -1 && spaceIdx > region.length * 0.3) {
        return searchStart + spaceIdx + 1;
    }

    // Hard split at target
    return targetEnd;
}

module.exports = { chunkText };
