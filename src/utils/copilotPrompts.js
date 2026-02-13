/**
 * Co-Pilot prompt extensions for structured session context and behavioral instructions.
 */

function buildCoPilotContext(prepData, hasEmbeddings = false) {
    if (!prepData) return '';

    const sections = ['=== SESSION OBJECTIVES ==='];

    if (prepData.goal) {
        sections.push(`GOAL: ${prepData.goal}`);
    }
    if (prepData.desiredOutcome) {
        sections.push(`DESIRED OUTCOME: ${prepData.desiredOutcome}`);
    }
    if (prepData.successCriteria) {
        sections.push(`SUCCESS CRITERIA: ${prepData.successCriteria}`);
    }
    if (prepData.decisionOwner) {
        sections.push(`DECISION OWNER: ${prepData.decisionOwner}`);
    }

    if (prepData.keyTopics && prepData.keyTopics.length > 0) {
        sections.push('\nKEY TOPICS TO COVER:');
        prepData.keyTopics.forEach((topic, i) => {
            sections.push(`${i + 1}. ${topic.text}`);
        });
    }

    if (prepData.referenceDocuments && prepData.referenceDocuments.length > 0) {
        if (hasEmbeddings) {
            // RAG mode: documents will be injected dynamically during conversation
            const docNames = prepData.referenceDocuments.map(d => d.name).join(', ');
            sections.push('\nREFERENCE MATERIALS:');
            sections.push(`Documents uploaded: ${docNames}.`);
            sections.push('Relevant excerpts from these documents will be provided dynamically during the conversation based on discussion topics. When you receive [REFERENCE CONTEXT] blocks, use that information if relevant to the current discussion.');
        } else {
            // Fallback: inject full document text (no embeddings available)
            sections.push('\nREFERENCE MATERIALS:');
            prepData.referenceDocuments.forEach(doc => {
                sections.push(`--- ${doc.name} ---`);
                if (doc.extractedText) {
                    sections.push(doc.extractedText);
                }
                sections.push('--- end ---');
            });
        }
    }

    if (prepData.customNotes) {
        sections.push(`\nADDITIONAL NOTES:\n${prepData.customNotes}`);
    }

    sections.push('=== END SESSION OBJECTIVES ===');
    return sections.join('\n');
}

const copilotBehaviorBase = `
=== CO-PILOT BEHAVIOR ===
You are operating in Co-Pilot mode. In addition to your primary role:

1. DRIFT DETECTION: If the conversation drifts off the stated goal or key topics, include a brief nudge at the START of your response:
   [REFOCUS: brief suggestion to steer back on track]

2. TOPIC TRACKING: After covering a key topic, or if topics remain uncovered late in the conversation, note:
   [TOPICS REMAINING: list of uncovered topics]

3. DECISION READINESS: When you detect hesitation, unresolved objections, or readiness to close, suggest specific language:
   [ADVANCE: specific words to say to move toward a decision]

4. STRUCTURED NOTES: At the END of every response, include a notes block. This is collected silently and NOT shown to the user during the session. It will be used for the post-session summary:
   [NOTES]
   - Key point: ...
   - Decision: ...
   - Open question: ...
   - Action item: ...
   - Next step: ...
   [/NOTES]

IMPORTANT: The [NOTES] block will be stripped from the displayed response. Always include it. Reference the provided documents and session objectives when relevant.
=== END CO-PILOT BEHAVIOR ===`;

const profileCopilotAdditions = {
    interview: `
CO-PILOT FOCUS (Interview):
- Track which STAR stories have been used and suggest fresh ones
- Identify skills gaps between what's been discussed and the job requirements
- Detect interviewer intent (behavioral, technical, cultural fit) and tailor accordingly
- Note if the candidate is being too brief or too verbose`,

    sales: `
CO-PILOT FOCUS (Sales):
- Track objections raised and whether they've been resolved
- Identify buying signals (budget questions, timeline discussions, stakeholder mentions)
- Flag when the prospect is ready to close vs needs more nurturing
- Monitor competitive mentions and suggest differentiation points`,

    meeting: `
CO-PILOT FOCUS (Meeting):
- Track agenda items and time spent on each
- Capture action items with owners as they emerge
- Flag decisions that need formal agreement
- Note when discussion loops without progress`,

    negotiation: `
CO-PILOT FOCUS (Negotiation):
- Track concessions made by each party
- Identify BATNA signals and leverage points
- Flag anchoring attempts and suggest counter-anchors
- Monitor deal readiness and suggest closing language`,

    presentation: `
CO-PILOT FOCUS (Presentation):
- Track key messages delivered vs planned
- Suggest audience engagement techniques if energy drops
- Prepare for likely follow-up questions
- Note audience reactions and concerns raised`,

    study: `
CO-PILOT FOCUS (Study Session):
- Emphasize understanding and concept connections
- Track which topics need more review
- Note areas of confusion for follow-up study`,
};

function buildCoPilotInstructions(profile) {
    const profileAddition = profileCopilotAdditions[profile] || '';
    return copilotBehaviorBase + '\n' + profileAddition;
}

module.exports = {
    buildCoPilotContext,
    buildCoPilotInstructions,
};
