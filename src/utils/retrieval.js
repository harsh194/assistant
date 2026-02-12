const { generateEmbedding, findTopKSimilar } = require('./embeddings');

const RETRIEVAL_COOLDOWN_MS = 20000; // 20 seconds between retrievals
const MAX_CHUNKS_PER_INJECTION = 5;
const MIN_SIMILARITY_SCORE = 0.3;
const RECENT_TURNS_FOR_QUERY = 3;

class RetrievalEngine {
    /**
     * @param {string} apiKey - Gemini API key for embedding generation
     * @param {Array<object>} allEmbeddings - All stored embedding documents from storage
     */
    constructor(apiKey, allEmbeddings) {
        this.apiKey = apiKey;
        this.injectedChunkIds = new Set();
        this.lastRetrievalTime = 0;
        this.isRetrieving = false;

        // Flatten all chunks from all documents into a single searchable array
        this.chunks = [];
        for (const doc of allEmbeddings) {
            if (doc.chunks) {
                for (const chunk of doc.chunks) {
                    this.chunks.push({
                        ...chunk,
                        docName: doc.docName,
                    });
                }
            }
        }

        console.log(`RetrievalEngine initialized with ${this.chunks.length} chunks from ${allEmbeddings.length} documents`);
    }

    /**
     * Check if enough time has passed since the last retrieval.
     */
    canRetrieve() {
        if (this.isRetrieving) return false;
        return Date.now() - this.lastRetrievalTime >= RETRIEVAL_COOLDOWN_MS;
    }

    /**
     * Build a search query from recent conversation turns.
     * @param {Array<{ transcription: string, ai_response: string }>} recentTurns
     * @returns {string}
     */
    buildConversationQuery(recentTurns) {
        const parts = [];
        const turns = recentTurns.slice(-RECENT_TURNS_FOR_QUERY);

        for (const turn of turns) {
            if (turn.transcription) {
                parts.push(turn.transcription.trim());
            }
            if (turn.ai_response) {
                // Take first 300 chars of AI response to keep query focused
                parts.push(turn.ai_response.trim().slice(0, 300));
            }
        }

        return parts.join(' ');
    }

    /**
     * Retrieve relevant chunks that haven't been injected yet.
     * @param {Array<{ transcription: string, ai_response: string }>} recentTurns
     * @param {number} topK - Max chunks to return
     * @returns {Promise<Array<{ text: string, docName: string, score: number, id: string }>>}
     */
    async retrieve(recentTurns, topK = MAX_CHUNKS_PER_INJECTION) {
        if (this.chunks.length === 0 || !recentTurns || recentTurns.length === 0) {
            return [];
        }

        this.isRetrieving = true;
        this.lastRetrievalTime = Date.now();

        try {
            const query = this.buildConversationQuery(recentTurns);
            if (!query.trim()) return [];

            const queryEmbedding = await generateEmbedding(this.apiKey, query);

            // Filter out already-injected chunks before search
            const availableChunks = this.chunks.filter(c => !this.injectedChunkIds.has(c.id));
            if (availableChunks.length === 0) return [];

            const results = findTopKSimilar(queryEmbedding, availableChunks, topK, MIN_SIMILARITY_SCORE);

            // Mark retrieved chunks as injected
            const retrieved = [];
            for (const { chunk, score } of results) {
                this.injectedChunkIds.add(chunk.id);
                retrieved.push({
                    id: chunk.id,
                    text: chunk.text,
                    docName: chunk.docName,
                    score: Math.round(score * 100) / 100,
                });
            }

            if (retrieved.length > 0) {
                console.log(`RAG: Retrieved ${retrieved.length} chunks (${this.injectedChunkIds.size} total injected)`);
            }

            return retrieved;
        } catch (error) {
            console.error('RAG retrieval error:', error.message);
            return [];
        } finally {
            this.isRetrieving = false;
        }
    }

    /**
     * Format retrieved chunks as context text for injection into the live session.
     * @param {Array<{ text: string, docName: string, score: number }>} chunks
     * @returns {string}
     */
    formatContextInjection(chunks) {
        if (!chunks || chunks.length === 0) return '';

        const lines = ['[REFERENCE CONTEXT - from uploaded documents, use if relevant to current discussion]'];

        for (const chunk of chunks) {
            lines.push(`--- From: ${chunk.docName} ---`);
            lines.push(chunk.text);
        }

        lines.push('[END REFERENCE CONTEXT]');
        return lines.join('\n');
    }

    /**
     * Reset engine state for a new session.
     */
    reset() {
        this.injectedChunkIds.clear();
        this.lastRetrievalTime = 0;
        this.isRetrieving = false;
    }
}

module.exports = { RetrievalEngine };
