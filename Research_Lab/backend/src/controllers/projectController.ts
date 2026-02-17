import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

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
        const project = await Project.findById(req.params.id)
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
        const project = await Project.findById(req.params.id);
        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        if (project.owner.toString() !== req.user!._id.toString()) {
            throw new ApiError(403, 'Not authorized to update this project');
        }

        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
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
        const project = await Project.findById(req.params.id);
        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        if (project.owner.toString() !== req.user!._id.toString()) {
            throw new ApiError(403, 'Not authorized to delete this project');
        }

        await project.deleteOne();
        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        next(error);
    }
};
