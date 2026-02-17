// TF-IDF keyword extraction

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'not',
    'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
    'we', 'our', 'you', 'your', 'he', 'she', 'him', 'her', 'his',
    'which', 'what', 'who', 'whom', 'where', 'when', 'how', 'than',
    'also', 'just', 'very', 'too', 'more', 'most', 'some', 'such',
    'into', 'over', 'after', 'before', 'between', 'through', 'during',
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function termFrequency(tokens: string[]): Record<string, number> {
    const tf: Record<string, number> = {};
    const total = tokens.length;
    tokens.forEach((t) => {
        tf[t] = (tf[t] || 0) + 1;
    });
    Object.keys(tf).forEach((k) => {
        tf[k] = tf[k] / total;
    });
    return tf;
}

function inverseDocFrequency(documents: string[][]): Record<string, number> {
    const idf: Record<string, number> = {};
    const N = documents.length;
    const allTerms = new Set(documents.flat());

    allTerms.forEach((term) => {
        const containingDocs = documents.filter((doc) => doc.includes(term)).length;
        idf[term] = Math.log((N + 1) / (containingDocs + 1)) + 1;
    });

    return idf;
}

export function tfidfKeywords(text: string, topN = 15): string[] {
    // Split text into "documents" (paragraphs)
    const paragraphs = text
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 20);

    if (paragraphs.length === 0) return [];

    const tokenizedDocs = paragraphs.map(tokenize);
    const allTokens = tokenize(text);
    const tf = termFrequency(allTokens);
    const idf = inverseDocFrequency(tokenizedDocs);

    const tfidf: Record<string, number> = {};
    Object.keys(tf).forEach((term) => {
        tfidf[term] = tf[term] * (idf[term] || 1);
    });

    return Object.entries(tfidf)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topN)
        .map(([word]) => word);
}
