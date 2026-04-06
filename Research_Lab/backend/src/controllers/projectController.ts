import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Task from '../models/Task';
import Paper from '../models/Paper';
import Note from '../models/Note';
import Experiment from '../models/Experiment';
import ExperimentRun from '../models/ExperimentRun';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { deleteFromCloudinary } from '../services/cloudinaryService';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const project = await Project.create({
            ...req.body,
            owner: req.user!._id,
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query: any = {
            $or: [{ owner: req.user!._id }, { collaborators: req.user!._id }],
        };

        if (status) query.status = status;
        if (search) {
            query.$text = { $search: search as string };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const projects = await Project.find(query)
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Project.countDocuments(query);

        // Calculate progress for each project
        const projectsWithProgress = await Promise.all(
            projects.map(async (project) => {
                const tasks = await Task.find({ projectId: project._id });
                const totalTasks = tasks.length;
                const doneTasks = tasks.filter((t) => t.status === 'Done').length;
                const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                if (project.progressPercentage !== progress) {
                    project.progressPercentage = progress;
                    await project.save();
                }

                return project;
            })
        );

        res.status(200).json({
            success: true,
            data: projectsWithProgress,
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

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id as string)
            .populate('owner', 'name email')
            .populate('collaborators', 'name email');

        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id as string);
        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        if (project.owner.toString() !== req.user!._id.toString()) {
            throw new ApiError(403, 'Not authorized to update this project');
        }

        const updated = await Project.findByIdAndUpdate(id as string, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('owner', 'name email')
            .populate('collaborators', 'name email');

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const projectId = req.params.id as string;
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        if (project.owner.toString() !== req.user!._id.toString()) {
            throw new ApiError(403, 'Not authorized to delete this project');
        }

        // Use valid ObjectId for queries
        const projectObjectId = new mongoose.Types.ObjectId(projectId);

        // 1. Delete associated Tasks
        await Task.deleteMany({ projectId: projectObjectId });

        // 2. Delete associated Papers (and their files on Cloudinary)
        const papers = await Paper.find({ projectId: projectObjectId });
        for (const paper of papers) {
            if (paper.filePublicId) {
                await deleteFromCloudinary(paper.filePublicId, 'raw');
            }
        }
        await Paper.deleteMany({ projectId: projectObjectId });

        // 3. Delete associated Notes
        await Note.deleteMany({ projectId: projectObjectId });

        // 4. Delete associated Experiments (and their Runs + files)
        const experiments = await Experiment.find({ projectId: projectObjectId });
        for (const exp of experiments) {
            const runs = await ExperimentRun.find({ experimentId: exp._id });
            for (const run of runs) {
                if (run.resultGraphPublicId) {
                    await deleteFromCloudinary(run.resultGraphPublicId, 'image');
                }
            }
            await ExperimentRun.deleteMany({ experimentId: exp._id });
        }
        await Experiment.deleteMany({ projectId: projectObjectId });

        // 5. Finally delete the project
        await project.deleteOne();

        res.status(200).json({ success: true, message: 'Project deleted and all associated data cleared' });
    } catch (error) {
        next(error);
    }
};
