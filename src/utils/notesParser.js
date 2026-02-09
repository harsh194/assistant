/**
 * Parses structured markers from AI co-pilot responses.
 * Extracts [NOTES], [REFOCUS], [TOPICS REMAINING], [ADVANCE] blocks
 * and strips them from the displayed text.
 */

const NOTES_REGEX = /\[NOTES\]([\s\S]*?)\[\/NOTES\]/g;
const REFOCUS_REGEX = /\[REFOCUS:\s*(.*?)\]/g;
const TOPICS_REMAINING_REGEX = /\[TOPICS REMAINING:\s*(.*?)\]/g;
const ADVANCE_REGEX = /\[ADVANCE:\s*(.*?)\]/g;

/**
 * Parse a single [NOTES] block into structured data.
 * Expects lines like:
 *   - Key point: ...
 *   - Decision: ...
 *   - Open question: ...
 *   - Action item: ...
 *   - Next step: ...
 */
function parseNotesBlock(rawNotes) {
    const result = {
        keyPoints: [],
        decisions: [],
        openQuestions: [],
        actionItems: [],
        nextSteps: [],
    };

    const lines = rawNotes.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        const cleaned = line.replace(/^[-*]\s*/, '');
        const lower = cleaned.toLowerCase();

        if (lower.startsWith('key point:')) {
            result.keyPoints.push(cleaned.replace(/^key point:\s*/i, ''));
        } else if (lower.startsWith('decision:')) {
            result.decisions.push(cleaned.replace(/^decision:\s*/i, ''));
        } else if (lower.startsWith('open question:')) {
            result.openQuestions.push(cleaned.replace(/^open question:\s*/i, ''));
        } else if (lower.startsWith('action item:')) {
            result.actionItems.push(cleaned.replace(/^action item:\s*/i, ''));
        } else if (lower.startsWith('next step:')) {
            result.nextSteps.push(cleaned.replace(/^next step:\s*/i, ''));
        } else if (cleaned.length > 0) {
            result.keyPoints.push(cleaned);
        }
    }

    return result;
}

/**
 * Parse a full AI response, extracting all structured markers.
 * Returns cleaned text for display and extracted notes/alerts.
 */
export function parseResponse(text) {
    if (!text || typeof text !== 'string') {
        return { cleanText: text || '', notes: null, alerts: [] };
    }

    const alerts = [];
    const allNotes = {
        keyPoints: [],
        decisions: [],
        openQuestions: [],
        actionItems: [],
        nextSteps: [],
    };

    // Extract [REFOCUS] alerts
    let match;
    const refocusRegex = new RegExp(REFOCUS_REGEX.source, 'g');
    while ((match = refocusRegex.exec(text)) !== null) {
        alerts.push({ type: 'refocus', message: match[1].trim() });
    }

    // Extract [TOPICS REMAINING] alerts
    const topicsRegex = new RegExp(TOPICS_REMAINING_REGEX.source, 'g');
    while ((match = topicsRegex.exec(text)) !== null) {
        alerts.push({ type: 'topics_remaining', message: match[1].trim() });
    }

    // Extract [ADVANCE] alerts
    const advanceRegex = new RegExp(ADVANCE_REGEX.source, 'g');
    while ((match = advanceRegex.exec(text)) !== null) {
        alerts.push({ type: 'advance', message: match[1].trim() });
    }

    // Extract [NOTES] blocks
    const notesRegex = new RegExp(NOTES_REGEX.source, 'g');
    let hasNotes = false;
    while ((match = notesRegex.exec(text)) !== null) {
        hasNotes = true;
        const parsed = parseNotesBlock(match[1]);
        allNotes.keyPoints.push(...parsed.keyPoints);
        allNotes.decisions.push(...parsed.decisions);
        allNotes.openQuestions.push(...parsed.openQuestions);
        allNotes.actionItems.push(...parsed.actionItems);
        allNotes.nextSteps.push(...parsed.nextSteps);
    }

    // Strip all markers from text for clean display
    const cleanText = cleanResponse(text);

    return {
        cleanText,
        notes: hasNotes ? allNotes : null,
        alerts,
    };
}

/**
 * Strip all co-pilot markers from text for clean display.
 */
export function cleanResponse(text) {
    if (!text || typeof text !== 'string') return text || '';

    return text
        .replace(NOTES_REGEX, '')
        .replace(REFOCUS_REGEX, '')
        .replace(TOPICS_REMAINING_REGEX, '')
        .replace(ADVANCE_REGEX, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * Merge new notes into existing accumulated notes.
 */
export function mergeNotes(existing, newNotes) {
    if (!newNotes) return existing;

    return {
        keyPoints: [...(existing.keyPoints || []), ...(newNotes.keyPoints || [])],
        decisions: [...(existing.decisions || []), ...(newNotes.decisions || [])],
        openQuestions: [...(existing.openQuestions || []), ...(newNotes.openQuestions || [])],
        actionItems: [...(existing.actionItems || []), ...(newNotes.actionItems || [])],
        nextSteps: [...(existing.nextSteps || []), ...(newNotes.nextSteps || [])],
    };
}
