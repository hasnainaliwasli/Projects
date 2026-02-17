import { Response, NextFunction } from 'express';
import Paper from '../models/Paper';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService';
import { generateAISummary } from '../services/aiService';
import { generateSimpleEmbedding, cosineSimilarity } from '../utils/cosine';
import { tfidfKeywords } from '../utils/tfidf';
import { rakeKeywords } from '../utils/rake';

export const uploadPaper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, title, authors, year, journal, doi } = req.body;

        let fileUrl = '';
        let filePublicId = '';
        let extractedText = '';

        // Upload to Cloudinary if file provided
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'papers', 'raw');
                fileUrl = result.url;
                filePublicId = result.publicId;
            } catch (err) {
                console.error('Cloudinary upload failed:', err);
                // Continue without file URL - paper will still be created
            }

            // Simple text extraction from PDF buffer (basic approach)
            try {
                extractedText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ').substring(0, 50000);
            } catch (err) {
                console.error('Text extraction failed:', err);
            }
        }

        // Generate AI summary if we have text
        let aiResult = {
            summaryShort: '',
            summaryMethodology: '',
            keyFindings: '',
            limitations: '',
            suggestedTags: [] as string[],
            keywords: [] as string[],
        };

        if (extractedText.length > 100) {
            try {
                aiResult = await generateAISummary(extractedText);
            } catch (err) {
                console.error('AI summary generation failed:', err);
            }
        }

        // Generate embedding vector
        let embeddingVector: number[] = [];
        try {
            embeddingVector = extractedText.length > 100
                ? generateSimpleEmbedding(extractedText)
                : [];
        } catch (err) {
            console.error('Embedding generation failed:', err);
        }

        const parsedAuthors = typeof authors === 'string' ? authors.split(',').map((a: string) => a.trim()) : authors || [];

        // Get keywords safely
        let finalKeywords = aiResult.keywords;
        if (finalKeywords.length === 0 && extractedText.length > 100) {
            try {
                finalKeywords = tfidfKeywords(extractedText, 10);
            } catch (err) {
                console.error('TF-IDF keyword extraction failed:', err);
                finalKeywords = [];
            }
        }

        const paper = await Paper.create({
            title,
            authors: parsedAuthors,
            year: year ? Number(year) : undefined,
            journal: journal || '',
            doi: doi || '',
            keywords: finalKeywords,
            projectId,
            fileUrl,
            filePublicId,
            extractedText: extractedText.substring(0, 50000),
            summaryShort: aiResult.summaryShort,
            summaryMethodology: aiResult.summaryMethodology,
            keyFindings: aiResult.keyFindings,
            limitations: aiResult.limitations,
            embeddingVector,
        });

        res.status(201).json({ success: true, data: paper });
    } catch (error) {
        next(error);
    }
};

export const getPapers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, search, page = 1, limit = 10 } = req.query;
        const query: any = {};

        if (projectId) query.projectId = projectId;
        if (search) {
            query.$text = { $search: search as string };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const papers = await Paper.find(query)
            .select('-extractedText -embeddingVector')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Paper.countDocuments(query);

        res.status(200).json({
            success: true,
            data: papers,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getPaper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paper = await Paper.findById(req.params.id).populate('projectId', 'title');
        if (!paper) {
            throw new ApiError(404, 'Paper not found');
        }

        res.status(200).json({ success: true, data: paper });
    } catch (error) {
        next(error);
    }
};

export const updatePaper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!paper) {
            throw new ApiError(404, 'Paper not found');
        }

        res.status(200).json({ success: true, data: paper });
    } catch (error) {
        next(error);
    }
};

export const deletePaper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            throw new ApiError(404, 'Paper not found');
        }

        if (paper.filePublicId) {
            await deleteFromCloudinary(paper.filePublicId, 'raw');
        }

        await paper.deleteOne();
        res.status(200).json({ success: true, message: 'Paper deleted' });
    } catch (error) {
        next(error);
    }
};

export const deletePapers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            throw new ApiError(400, 'Paper IDs array is required');
        }

        const papers = await Paper.find({ _id: { $in: ids } });
        for (const paper of papers) {
            if (paper.filePublicId) {
                await deleteFromCloudinary(paper.filePublicId, 'raw');
            }
        }

        await Paper.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: `${papers.length} papers deleted` });
    } catch (error) {
        next(error);
    }
};

export const getSimilarPapers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            throw new ApiError(404, 'Paper not found');
        }

        if (!paper.embeddingVector || paper.embeddingVector.length === 0) {
            res.status(200).json({ success: true, data: [] });
            return;
        }

        const allPapers = await Paper.find({
            _id: { $ne: paper._id },
            projectId: paper.projectId,
            embeddingVector: { $exists: true, $ne: [] },
        }).select('title authors year journal keywords embeddingVector');

        const similarities = allPapers
            .map((p) => ({
                paper: { _id: p._id, title: p.title, authors: p.authors, year: p.year, journal: p.journal, keywords: p.keywords },
                similarity: cosineSimilarity(paper.embeddingVector, p.embeddingVector),
            }))
            .filter((s) => s.similarity > 0.1)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        res.status(200).json({ success: true, data: similarities });
    } catch (error) {
        next(error);
    }
};

export const regenerateSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            throw new ApiError(404, 'Paper not found');
        }

        if (!paper.extractedText || paper.extractedText.length < 100) {
            throw new ApiError(400, 'Not enough text to generate summary');
        }

        const aiResult = await generateAISummary(paper.extractedText);

        paper.summaryShort = aiResult.summaryShort;
        paper.summaryMethodology = aiResult.summaryMethodology;
        paper.keyFindings = aiResult.keyFindings;
        paper.limitations = aiResult.limitations;
        if (aiResult.keywords.length > 0) {
            paper.keywords = aiResult.keywords;
        }

        await paper.save();

        res.status(200).json({ success: true, data: paper });
    } catch (error) {
        next(error);
    }
};
