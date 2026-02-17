// TextRank implementation for extractive summarization
// Used as a fallback when Gemini API is unavailable

interface SentenceScore {
    sentence: string;
    score: number;
    index: number;
}

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);
}

function sentenceTokenize(text: string): string[] {
    return text
        .replace(/\n+/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 10)
        .map((s) => s.trim());
}

function similarity(s1: string[], s2: string[]): number {
    const set1 = new Set(s1);
    const set2 = new Set(s2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    if (set1.size + set2.size === 0) return 0;
    return intersection.size / (Math.log(set1.size) + Math.log(set2.size) + 1);
}

function buildGraph(sentences: string[][]): number[][] {
    const n = sentences.length;
    const graph: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const sim = similarity(sentences[i], sentences[j]);
            graph[i][j] = sim;
            graph[j][i] = sim;
        }
    }
    return graph;
}

function textRankScores(graph: number[][], damping = 0.85, iterations = 30): number[] {
    const n = graph.length;
    let scores = Array(n).fill(1.0 / n);

    for (let iter = 0; iter < iterations; iter++) {
        const newScores = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const outSum = graph[j].reduce((a, b) => a + b, 0);
                if (outSum > 0) {
                    sum += (graph[j][i] / outSum) * scores[j];
                }
            }
            newScores[i] = (1 - damping) / n + damping * sum;
        }
        scores = newScores;
    }
    return scores;
}

export function textRankSummarize(text: string, numSentences = 5): string {
    const sentences = sentenceTokenize(text);
    if (sentences.length <= numSentences) return sentences.join(' ');

    const tokenizedSentences = sentences.map(tokenize);
    const graph = buildGraph(tokenizedSentences);
    const scores = textRankScores(graph);

    const scored: SentenceScore[] = sentences.map((s, i) => ({
        sentence: s,
        score: scores[i],
        index: i,
    }));

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, numSentences);
    top.sort((a, b) => a.index - b.index);

    return top.map((s) => s.sentence).join(' ');
}

export function extractKeyPhrases(text: string, topN = 10): string[] {
    const tokens = tokenize(text);
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
        'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
        'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
        'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'not',
        'its', 'it', 'they', 'them', 'their', 'we', 'our', 'you', 'your',
        'which', 'what', 'who', 'whom', 'where', 'when', 'how', 'all',
        'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
        'such', 'than', 'too', 'very', 'just', 'also', 'into', 'over',
        'after', 'before', 'between', 'through', 'during', 'above', 'below',
    ]);

    const filtered = tokens.filter((t) => !stopWords.has(t));
    const freq: Record<string, number> = {};
    filtered.forEach((t) => {
        freq[t] = (freq[t] || 0) + 1;
    });

    return Object.entries(freq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topN)
        .map(([word]) => word);
}
