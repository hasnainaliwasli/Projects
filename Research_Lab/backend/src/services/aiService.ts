import { textRankSummarize, extractKeyPhrases } from '../utils/textrank';
import { tfidfKeywords } from '../utils/tfidf';
import { rakeKeywords } from '../utils/rake';
import { config } from '../config';

/**
 * Helper to call Gemini with a prompt + optional PDF buffer
 */
async function callGemini(prompt: string, pdfBuffer?: Buffer): Promise<string> {
    const apiKey = config.gemini.apiKey;
    if (!apiKey) throw new Error('Gemini API key not configured');

    const parts: any[] = [{ text: prompt }];

    // If we have a PDF buffer, attach it as inline data
    if (pdfBuffer) {
        parts.push({
            inlineData: {
                mime_type: 'application/pdf',
                data: pdfBuffer.toString('base64'),
            },
        });
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
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

/**
 * Generates AI keywords using Gemini (multimodal) or fallback text analysis.
 * Accepts either:
 *  - text (string): Legacy text-based analysis
 *  - pdfBuffer (Buffer): Direct PDF analysis (PREFERRED)
 */
export async function generateAIKeywords(input: string | Buffer): Promise<string[]> {
    let textForFallback = "";
    let pdfBuffer: Buffer | undefined;

    if (Buffer.isBuffer(input)) {
        pdfBuffer = input;
    } else {
        textForFallback = input;
    }

    try {
        console.log(`Generating AI keywords via Gemini... Input type: ${pdfBuffer ? 'PDF Buffer' : 'Text String'}`);

        const prompt = `Analyze the attached research paper and extract 5-7 distinct keywords or tags that accurately describe its content.
Return your response in this exact JSON format (no markdown, no backticks, just pure JSON):
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

IMPORTANT: Provide ONLY the JSON object. Do not explain anything.`;

        // Pass the prompt AND the buffer (if it exists) to Gemini
        let finalPrompt = prompt;
        if (!pdfBuffer && textForFallback) {
            finalPrompt += `\n\nPaper text:\n${textForFallback.substring(0, 30000)}`;
        }

        const response = await callGemini(finalPrompt, pdfBuffer);

        // Try to parse JSON from the response, handling markdown code blocks
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);

                // If keywords are missing from Gemini, fill them in
                let keywords = parsed.keywords || [];
                if (keywords.length === 0 && textForFallback) {
                    const tfidf = tfidfKeywords(textForFallback, 10);
                    const rake = rakeKeywords(textForFallback, 10);
                    keywords = [...new Set([...tfidf.slice(0, 5), ...rake.slice(0, 5)])];
                }

                return keywords;
            } catch (parseError) {
                console.error('JSON parse error for Gemini response:', parseError);
                throw new Error('Invalid JSON structure in Gemini response');
            }
        }
        throw new Error('Could not find JSON in Gemini response');

    } catch (error) {
        console.error('Gemini API failed:', error);

        // Fallback only works if we have text
        if (textForFallback) {
            console.log('Using TextRank fallback...');
            return fallbackKeywords(textForFallback);
        } else {
            return [];
        }
    }
}

function fallbackKeywords(text: string): string[] {
    const tfidf = tfidfKeywords(text, 10);
    const rake = rakeKeywords(text, 10);
    return [...new Set([...tfidf.slice(0, 5), ...rake.slice(0, 5)])];
}
