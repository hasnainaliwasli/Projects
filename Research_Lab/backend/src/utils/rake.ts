// RAKE (Rapid Automatic Keyword Extraction)

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
    'above', 'below', 'each', 'few', 'other', 'only', 'own', 'same',
]);

function splitToWords(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function generateCandidates(text: string): string[][] {
    const sentences = text.split(/[.!?,;:\n]+/);
    const phrases: string[][] = [];

    sentences.forEach((sentence) => {
        const words = splitToWords(sentence);
        let currentPhrase: string[] = [];

        words.forEach((word) => {
            if (STOP_WORDS.has(word) || word.length <= 2) {
                if (currentPhrase.length > 0) {
                    phrases.push([...currentPhrase]);
                    currentPhrase = [];
                }
            } else {
                currentPhrase.push(word);
            }
        });

        if (currentPhrase.length > 0) {
            phrases.push(currentPhrase);
        }
    });

    return phrases;
}

export function rakeKeywords(text: string, topN = 15): string[] {
    const candidates = generateCandidates(text);

    // Calculate word scores
    const wordDegree: Record<string, number> = {};
    const wordFreq: Record<string, number> = {};

    candidates.forEach((phrase) => {
        phrase.forEach((word) => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
            wordDegree[word] = (wordDegree[word] || 0) + phrase.length;
        });
    });

    const wordScore: Record<string, number> = {};
    Object.keys(wordFreq).forEach((word) => {
        wordScore[word] = wordDegree[word] / wordFreq[word];
    });

    // Score phrases
    const phraseScores: { phrase: string; score: number }[] = [];
    const seen = new Set<string>();

    candidates.forEach((phrase) => {
        const phraseStr = phrase.join(' ');
        if (seen.has(phraseStr)) return;
        seen.add(phraseStr);

        const score = phrase.reduce((sum, word) => sum + (wordScore[word] || 0), 0);
        phraseScores.push({ phrase: phraseStr, score });
    });

    return phraseScores
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map((p) => p.phrase);
}
