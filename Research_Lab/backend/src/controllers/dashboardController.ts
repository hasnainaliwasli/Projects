import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import Paper from '../models/Paper';
import Experiment from '../models/Experiment';
import ExperimentRun from '../models/ExperimentRun';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!._id;

        // Get user's projects
        const projects = await Project.find({
            $or: [{ owner: userId }, { collaborators: userId }],
        });
        const projectIds = projects.map((p) => p._id);

        // Aggregate stats
        const totalPapers = await Paper.countDocuments({ projectId: { $in: projectIds } });
        const totalExperiments = await Experiment.countDocuments({ projectId: { $in: projectIds } });
        const activeProjects = projects.filter((p) => p.status !== 'Submitted').length;

        // Research progress
        const allTasks = await Task.find({ projectId: { $in: projectIds } });
        const totalTasks = allTasks.length;
        const doneTasks = allTasks.filter((t) => t.status === 'Done').length;
        const researchProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        // Recently added papers
        const recentPapers = await Paper.find({ projectId: { $in: projectIds } })
            .select('title authors year createdAt projectId')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        // Upcoming deadlines
        const upcomingDeadlines = await Task.find({
            projectId: { $in: projectIds },
            deadline: { $gte: new Date() },
            status: { $ne: 'Done' },
        })
            .populate('projectId', 'title')
            .sort({ deadline: 1 })
            .limit(5);

        // Papers per project chart data
        const papersPerProject = await Promise.all(
            projects.slice(0, 10).map(async (project) => {
                const count = await Paper.countDocuments({ projectId: project._id });
                return { name: project.title.substring(0, 20), papers: count };
            })
        );

        // Experiment runs per project
        const experimentRunsPerProject = await Promise.all(
            projects.slice(0, 10).map(async (project) => {
                const experiments = await Experiment.find({ projectId: project._id });
                const experimentIds = experiments.map((e) => e._id);
                const runs = await ExperimentRun.countDocuments({ experimentId: { $in: experimentIds } });
                return { name: project.title.substring(0, 20), runs };
            })
        );

        // Task completion by status
        const tasksByStatus = {
            'To Do': allTasks.filter((t) => t.status === 'To Do').length,
            'In Progress': allTasks.filter((t) => t.status === 'In Progress').length,
            'Review': allTasks.filter((t) => t.status === 'Review').length,
            'Done': doneTasks,
        };

        res.status(200).json({
            success: true,
            data: {
                totalPapers,
                totalExperiments,
                activeProjects,
                totalProjects: projects.length,
                researchProgress,
                recentPapers,
                upcomingDeadlines,
                charts: {
                    papersPerProject,
                    experimentRunsPerProject,
                    tasksByStatus,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
