const { GoogleGenAI } = require('@google/genai');

const EMBEDDING_MODEL = 'text-embedding-004';
const BATCH_SIZE = 100;

/**
 * Generate an embedding vector for a single text.
 * @param {string} apiKey
 * @param {string} text
 * @returns {Promise<Array<number>>}
 */
async function generateEmbedding(apiKey, text) {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
    });
    return result.embeddings[0].values;
}

/**
 * Generate embedding vectors for multiple texts in batches.
 * @param {string} apiKey
 * @param {Array<string>} texts
 * @returns {Promise<Array<Array<number>>>}
 */
async function generateEmbeddings(apiKey, texts) {
    if (!texts || texts.length === 0) return [];

    const ai = new GoogleGenAI({ apiKey });
    const allEmbeddings = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
            batch.map(text =>
                ai.models.embedContent({
                    model: EMBEDDING_MODEL,
                    contents: text,
                })
            )
        );
        for (const result of results) {
            allEmbeddings.push(result.embeddings[0].values);
        }
    }

    return allEmbeddings;
}

/**
 * Compute cosine similarity between two vectors.
 * @param {Array<number>} vecA
 * @param {Array<number>} vecB
 * @returns {number} Similarity score between -1 and 1
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find the top-K most similar chunks to a query embedding.
 * @param {Array<number>} queryEmbedding
 * @param {Array<{ id: string, text: string, embedding: Array<number>, docName: string }>} chunks
 * @param {number} k - Max results to return
 * @param {number} minScore - Minimum similarity threshold
 * @returns {Array<{ chunk: object, score: number }>}
 */
function findTopKSimilar(queryEmbedding, chunks, k = 5, minScore = 0.3) {
    const scored = [];

    for (const chunk of chunks) {
        if (!chunk.embedding) continue;
        const score = cosineSimilarity(queryEmbedding, chunk.embedding);
        if (score >= minScore) {
            scored.push({ chunk, score });
        }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k);
}

module.exports = {
    generateEmbedding,
    generateEmbeddings,
    cosineSimilarity,
    findTopKSimilar,
};
