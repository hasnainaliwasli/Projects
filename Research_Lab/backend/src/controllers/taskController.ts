import { Response, NextFunction } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId, status } = req.query;
        const query: any = {};
        if (projectId) query.projectId = projectId;
        if (status) query.status = status;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('projectId', 'title');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('assignedTo', 'name email')
            .populate('projectId', 'title');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = req.body;
        const validStatuses = ['To Do', 'In Progress', 'Review', 'Done'];

        if (!validStatuses.includes(status)) {
            throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('assignedTo', 'name email')
            .populate('projectId', 'title');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        await task.deleteOne();
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
