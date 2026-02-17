// Cosine similarity for comparing document embedding vectors

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
}

// Generate a simple embedding vector from text using TF
// This is a lightweight alternative when external embedding APIs are not available
export function generateSimpleEmbedding(text: string, dimensions = 128): number[] {
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);

    const vector = new Array(dimensions).fill(0);

    words.forEach((word) => {
        // Simple hash function to map words to vector dimensions
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
        }
        const index = Math.abs(hash) % dimensions;
        vector[index] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
        for (let i = 0; i < dimensions; i++) {
            vector[i] /= magnitude;
        }
    }

    return vector;
}
