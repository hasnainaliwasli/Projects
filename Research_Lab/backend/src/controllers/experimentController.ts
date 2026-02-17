import { Response, NextFunction } from 'express';
import Experiment from '../models/Experiment';
import ExperimentRun from '../models/ExperimentRun';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../services/cloudinaryService';

// Experiment CRUD
export const createExperiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const experiment = await Experiment.create(req.body);
        res.status(201).json({ success: true, data: experiment });
    } catch (error) {
        next(error);
    }
};

export const getExperiments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId } = req.query;
        const query: any = {};
        if (projectId) query.projectId = projectId;

        const experiments = await Experiment.find(query)
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: experiments });
    } catch (error) {
        next(error);
    }
};

export const getExperiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const experiment = await Experiment.findById(req.params.id).populate('projectId', 'title');
        if (!experiment) {
            throw new ApiError(404, 'Experiment not found');
        }

        const runs = await ExperimentRun.find({ experimentId: experiment._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { experiment, runs },
        });
    } catch (error) {
        next(error);
    }
};

export const updateExperiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!experiment) {
            throw new ApiError(404, 'Experiment not found');
        }

        res.status(200).json({ success: true, data: experiment });
    } catch (error) {
        next(error);
    }
};

export const deleteExperiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const experiment = await Experiment.findById(req.params.id);
        if (!experiment) {
            throw new ApiError(404, 'Experiment not found');
        }

        await ExperimentRun.deleteMany({ experimentId: experiment._id });
        await experiment.deleteOne();

        res.status(200).json({ success: true, message: 'Experiment and its runs deleted' });
    } catch (error) {
        next(error);
    }
};

// Experiment Run CRUD
export const createExperimentRun = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let resultGraphUrl = '';
        let resultGraphPublicId = '';

        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'experiment-graphs', 'image');
                resultGraphUrl = result.url;
                resultGraphPublicId = result.publicId;
            } catch (err) {
                console.error('Cloudinary upload failed for experiment graph:', err);
            }
        }

        const { experimentId, parameters, metrics, resultSummary } = req.body;

        if (!experimentId) {
            throw new ApiError(400, 'Experiment ID is required');
        }

        let parsedParameters = {};
        let parsedMetrics = {};

        try {
            parsedParameters = typeof parameters === 'string' ? JSON.parse(parameters) : (parameters || {});
        } catch (err) {
            throw new ApiError(400, 'Invalid JSON format for parameters');
        }

        try {
            parsedMetrics = typeof metrics === 'string' ? JSON.parse(metrics) : (metrics || {});
        } catch (err) {
            throw new ApiError(400, 'Invalid JSON format for metrics');
        }

        const run = await ExperimentRun.create({
            experimentId,
            parameters: parsedParameters,
            metrics: parsedMetrics,
            resultSummary: resultSummary || '',
            resultGraphUrl,
            resultGraphPublicId,
        });

        res.status(201).json({ success: true, data: run });
    } catch (error) {
        console.error('Error in createExperimentRun:', error);
        next(error);
    }
};

export const getExperimentRuns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const runs = await ExperimentRun.find({ experimentId: req.params.experimentId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: runs });
    } catch (error) {
        next(error);
    }
};

export const deleteExperimentRun = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const run = await ExperimentRun.findById(req.params.id);
        if (!run) {
            throw new ApiError(404, 'Experiment run not found');
        }

        await run.deleteOne();
        res.status(200).json({ success: true, message: 'Run deleted' });
    } catch (error) {
        next(error);
    }
};
