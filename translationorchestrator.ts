export function segmentText(text: string, language: string): TextSegment[] {
    try {
        if (typeof Intl === 'object' && (Intl as any).Segmenter) {
            const Segmenter: IntlSegmenterConstructor = (Intl as any).Segmenter;
            const supportedLocales = Segmenter.supportedLocalesOf([language], { granularity: 'sentence' });
            if (supportedLocales.length > 0) {
                try {
                    const segmenter = new Segmenter(language, { granularity: 'sentence' });
                    const segments = Array.from(segmenter.segment(text));
                    return segments.map((segment, index) => ({
                        id: index,
                        text: segment.segment
                    }));
                } catch (e) {
                    console.error('Error while segmenting with Intl.Segmenter:', e);
                }
            }
        }
    } catch (e) {
        console.error('Error accessing Intl.Segmenter:', e);
    }

    const fallbackSegments = text.match(/[^.!?]+[.]*!*\?*[!\?]?/g) || [text];
    return fallbackSegments.map((text, index) => ({ id: index, text }));
}

export function reassembleSegments(segments: TranslatedSegment[]): string {
    return segments
        .sort((a, b) => a.id - b.id)
        .map(segment => segment.translatedText)
        .join('');
}

export async function orchestrateTranslation(
    job: TranslationJob,
    translateSegment: (segment: TextSegment, sourceLang: string, targetLang: string) => Promise<TranslatedSegment>
): Promise<TranslationResult> {
    try {
        const segments = segmentText(job.sourceText, job.sourceLang);
        const translatedSegments = await Promise.all(
            segments.map(segment => 
                translateSegment(segment, job.sourceLang, job.targetLang)
            )
        );
        const resultText = reassembleSegments(translatedSegments);
        return { success: true, translatedText: resultText };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

interface TextSegment {
    id: number;
    text: string;
}

interface TranslatedSegment extends TextSegment {
    translatedText: string;
}

interface TranslationJob {
    sourceText: string;
    sourceLang: string;
    targetLang: string;
}

interface TranslationResult {
    success: boolean;
    translatedText?: string;
    error?: string;
}