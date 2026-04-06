import { Response, NextFunction } from 'express';
import Paper from '../models/Paper';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService';
import { generateSimpleEmbedding, cosineSimilarity } from '../utils/cosine';
const pdf = require('pdf-parse');

export const uploadPaper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, title, authors, year, journal, doi, keywords } = req.body;

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

            // Improved text extraction using pdf-parse
            try {
                // Version 2.4.5 in CJS requires .default
                const pdfParser = pdf.default || pdf;
                const data = await pdfParser(req.file.buffer);
                // Detect garbage in the extracted text with regex
                const text = data.text ? data.text.trim() : "";
                const pdfPatterns = [
                    /%PDF-/i, /%%EOF/i, /endobj/i, /endstream/i, /obj\s*<</i,
                    /\/Type\s*\//i, /xref\s*\d+\s+\d+/i, /trailer\s*<</i,
                    /startxref/i, /\/Root\s*\d+\s+\d+/i, /\[\s*\d+\s+\d+\s+\d+\s*\]/i,
                    /\/Border/i, /\/Rect/i, /\/Annots/i, /\/URI/i, /\d+\s+\d+\s+R/i
                ];
                const matchedPatterns = pdfPatterns.filter(pattern => pattern.test(text));
                const isGarbage = matchedPatterns.length >= 1;

                if (text && text.length > 50 && !isGarbage) {
                    extractedText = text.substring(0, 50000);
                } else {
                    console.warn(`[UPLOAD-GARBAGE] Extracted text appears to be garbage or empty (${matchedPatterns.length} markers matched).`);
                    extractedText = "";
                }
            } catch (err) {
                console.error('Text extraction failed:', err);
                // Don't fall back to binary-to-string, it results in garbage
                extractedText = "";
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

        // Manual keywords only
        const parsedKeywords = typeof keywords === 'string'
            ? keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
            : Array.isArray(keywords) ? keywords : [];

        const paper = await Paper.create({
            title,
            authors: parsedAuthors,
            year: year ? Number(year) : undefined,
            journal: journal || '',
            doi: doi || '',
            keywords: parsedKeywords,
            projectId,
            fileUrl,
            filePublicId,
            extractedText: extractedText.substring(0, 50000),
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
            .slice(0, 15); // Increased from 5 to 15

        res.status(200).json({ success: true, data: similarities });
    } catch (error) {
        next(error);
    }
};
