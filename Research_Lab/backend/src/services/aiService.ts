import { textRankSummarize, extractKeyPhrases } from '../utils/textrank';
import { tfidfKeywords } from '../utils/tfidf';
import { rakeKeywords } from '../utils/rake';
import { config } from '../config';

interface AISummaryResult {
    summaryShort: string;
    summaryMethodology: string;
    keyFindings: string;
    limitations: string;
    suggestedTags: string[];
    keywords: string[];
}

async function callGemini(prompt: string): Promise<string> {
    const apiKey = config.gemini.apiKey;
    if (!apiKey) throw new Error('Gemini API key not configured');

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2048,
                },
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data: any = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateAISummary(text: string): Promise<AISummaryResult> {
    // Try Gemini first
    try {
        const prompt = `Analyze the following research paper text and provide a structured analysis. 
Return your response in this exact JSON format (no markdown, just pure JSON):
{
  "summaryShort": "A concise 2-3 sentence summary of the paper",
  "summaryMethodology": "Summary of the methodology used (2-3 sentences)",
  "keyFindings": "Main findings and conclusions (2-3 sentences)",
  "limitations": "Limitations mentioned or implied (1-2 sentences)",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Paper text (first 4000 chars):
${text.substring(0, 4000)}`;

        const response = await callGemini(prompt);

        // Try to parse JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const tfidf = tfidfKeywords(text, 10);
            const rake = rakeKeywords(text, 10);
            const keywords = [...new Set([...tfidf.slice(0, 5), ...rake.slice(0, 5)])];

            return {
                summaryShort: parsed.summaryShort || '',
                summaryMethodology: parsed.summaryMethodology || '',
                keyFindings: parsed.keyFindings || '',
                limitations: parsed.limitations || '',
                suggestedTags: parsed.suggestedTags || [],
                keywords,
            };
        }
        throw new Error('Could not parse Gemini response');
    } catch (error) {
        console.log('Gemini API failed, using TextRank fallback:', (error as Error).message);
        return fallbackSummary(text);
    }
}

function fallbackSummary(text: string): AISummaryResult {
    const summaryShort = textRankSummarize(text, 3);
    const summaryMethodology = textRankSummarize(text, 2);
    const keyFindings = textRankSummarize(text, 2);
    const limitations = 'AI summary unavailable. Please review the paper manually.';

    const tfidf = tfidfKeywords(text, 10);
    const rake = rakeKeywords(text, 10);
    const keyPhrases = extractKeyPhrases(text, 10);

    const keywords = [...new Set([...tfidf.slice(0, 5), ...rake.slice(0, 5)])];
    const suggestedTags = [...new Set([...keyPhrases.slice(0, 5)])];

    return {
        summaryShort,
        summaryMethodology,
        keyFindings,
        limitations,
        suggestedTags,
        keywords,
    };
}
