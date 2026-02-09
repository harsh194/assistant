/**
 * Export session notes and summary to .docx format.
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

function createHeading(text, level = HeadingLevel.HEADING_1) {
    return new Paragraph({
        text,
        heading: level,
        spacing: { before: 300, after: 100 },
    });
}

function createBullet(text) {
    return new Paragraph({
        children: [new TextRun(text)],
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 },
    });
}

function createParagraph(text, bold = false) {
    return new Paragraph({
        children: [new TextRun({ text, bold })],
        spacing: { before: 80, after: 80 },
    });
}

/**
 * Build a .docx document from session data.
 * @param {Object} options
 * @param {string} options.summary - AI-generated summary text
 * @param {Object} options.prepData - Co-pilot prep data (goal, topics, etc.)
 * @param {Object} options.notes - Accumulated session notes
 * @param {string} options.profile - Session profile (interview, sales, etc.)
 * @returns {Promise<Buffer>} - .docx file as a Buffer
 */
async function exportNotesToDocx({ summary, prepData, notes, profile }) {
    const children = [];

    // Title
    children.push(new Paragraph({
        children: [new TextRun({ text: 'Session Summary', bold: true, size: 36 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
    }));

    // Metadata
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    children.push(createParagraph(`Date: ${date}`));
    children.push(createParagraph(`Profile: ${profile || 'General'}`));

    if (prepData?.goal) {
        children.push(createParagraph(`Goal: ${prepData.goal}`));
    }
    if (prepData?.desiredOutcome) {
        children.push(createParagraph(`Desired Outcome: ${prepData.desiredOutcome}`));
    }

    // Summary section
    if (summary) {
        children.push(createHeading('Summary', HeadingLevel.HEADING_1));
        const summaryLines = summary.split('\n').filter(l => l.trim());
        for (const line of summaryLines) {
            children.push(createParagraph(line));
        }
    }

    // Key Decisions
    if (notes?.decisions?.length > 0) {
        children.push(createHeading('Key Decisions', HeadingLevel.HEADING_2));
        for (const item of notes.decisions) {
            children.push(createBullet(item));
        }
    }

    // Action Items
    if (notes?.actionItems?.length > 0) {
        children.push(createHeading('Action Items', HeadingLevel.HEADING_2));
        for (const item of notes.actionItems) {
            children.push(createBullet(item));
        }
    }

    // Key Points
    if (notes?.keyPoints?.length > 0) {
        children.push(createHeading('Key Points', HeadingLevel.HEADING_2));
        for (const item of notes.keyPoints) {
            children.push(createBullet(item));
        }
    }

    // Open Questions
    if (notes?.openQuestions?.length > 0) {
        children.push(createHeading('Open Questions', HeadingLevel.HEADING_2));
        for (const item of notes.openQuestions) {
            children.push(createBullet(item));
        }
    }

    // Next Steps
    if (notes?.nextSteps?.length > 0) {
        children.push(createHeading('Next Steps', HeadingLevel.HEADING_2));
        for (const item of notes.nextSteps) {
            children.push(createBullet(item));
        }
    }

    // Topic Coverage
    if (prepData?.keyTopics?.length > 0) {
        children.push(createHeading('Topic Coverage', HeadingLevel.HEADING_2));
        for (const topic of prepData.keyTopics) {
            const status = topic.covered ? '[Covered]' : '[Not Covered]';
            children.push(createBullet(`${status} ${topic.text}`));
        }
    }

    const doc = new Document({
        sections: [{ children }],
    });

    return Packer.toBuffer(doc);
}

module.exports = { exportNotesToDocx };
