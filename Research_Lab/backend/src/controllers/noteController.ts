import { Response, NextFunction } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json({ success: true, data: note });
    } catch (error) {
        next(error);
    }
};

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, paperId } = req.query;
        const query: any = {};
        if (projectId) query.projectId = projectId;
        if (paperId) query.paperId = paperId;

        const notes = await Note.find(query)
            .populate('paperId', 'title')
            .populate('projectId', 'title')
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        next(error);
    }
};

export const getNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('paperId', 'title')
            .populate('projectId', 'title');

        if (!note) {
            throw new ApiError(404, 'Note not found');
        }

        res.status(200).json({ success: true, data: note });
    } catch (error) {
        next(error);
    }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new ApiError(404, 'Note not found');
        }

        // Save current version to history before updating
        note.versionHistory.push({
            sections: { ...note.sections },
            updatedAt: new Date(),
        });

        // Keep only last 20 versions
        if (note.versionHistory.length > 20) {
            note.versionHistory = note.versionHistory.slice(-20);
        }

        // Update sections
        if (req.body.sections) {
            note.sections = { ...note.sections, ...req.body.sections };
        }

        await note.save();

        res.status(200).json({ success: true, data: note });
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new ApiError(404, 'Note not found');
        }

        await note.deleteOne();
        res.status(200).json({ success: true, message: 'Note deleted' });
    } catch (error) {
        next(error);
    }
};

export const getNoteVersions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            throw new ApiError(404, 'Note not found');
        }

        res.status(200).json({
            success: true,
            data: {
                current: note.sections,
                versions: note.versionHistory,
            },
        });
    } catch (error) {
        next(error);
    }
};
