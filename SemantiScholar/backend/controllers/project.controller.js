const Project = require("../models/Project");
const Paper = require("../models/Paper");
const asyncHandler = require("../middleware/asyncHandler");
const { AppError } = require("../middleware/errorHandler");
const { sendResponse } = require("../utils/response");

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new AppError("Please provide a project name", 400));
  }

  const project = await Project.create({
    userId: req.user.id,
    name,
    description,
  });

  sendResponse(res, 201, "Project created successfully", project);
});

/**
 * @desc    Get all projects for user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user.id })
    .populate({
      path: "papers",
      select: "fileName createdAt notes",
    })
    .sort({ createdAt: -1 });

  sendResponse(res, 200, "Projects retrieved successfully", projects);
});

/**
 * @desc    Assign a paper to a project
 * @route   POST /api/projects/:id/papers
 * @access  Private
 */
const assignPaperToProject = asyncHandler(async (req, res, next) => {
  const { paperId } = req.body;

  if (!paperId) {
    return next(new AppError("Please provide a paperId", 400));
  }

  // Verify the paper belongs to the user
  const paper = await Paper.findOne({ _id: paperId, userId: req.user.id });
  if (!paper) {
    return next(new AppError("Paper not found", 404));
  }

  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (project.papers.includes(paperId)) {
    return next(new AppError("Paper is already assigned to this project", 400));
  }

  project.papers.push(paperId);
  await project.save();

  sendResponse(res, 200, "Paper assigned to project successfully", project);
});

/**
 * @desc    Get a specific project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).populate({
    path: "papers",
    select: "fileName createdAt notes",
  });

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  sendResponse(res, 200, "Project retrieved successfully", project);
});

/**
 * @desc    Delete a project and all its papers
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res, next) => {
  const fs = require("fs");
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
  if (!project) return next(new AppError("Project not found", 404));

  // Delete all papers assigned to this project
  if (project.papers && project.papers.length > 0) {
    const papers = await Paper.find({ _id: { $in: project.papers }, userId: req.user.id });
    for (const paper of papers) {
      if (paper.filePath && fs.existsSync(paper.filePath)) {
        fs.unlinkSync(paper.filePath);
      }
      await paper.deleteOne();
    }
  }

  await project.deleteOne();
  sendResponse(res, 200, "Project and all its papers deleted successfully");
});

/**
 * @desc    Remove a paper from a project
 * @route   DELETE /api/projects/:id/papers/:paperId
 * @access  Private
 */
const removePaperFromProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
  if (!project) return next(new AppError("Project not found", 404));
  project.papers = project.papers.filter((p) => p.toString() !== req.params.paperId);
  await project.save();
  sendResponse(res, 200, "Paper removed from project");
});

module.exports = {
  createProject,
  getProjects,
  assignPaperToProject,
  getProjectById,
  deleteProject,
  removePaperFromProject,
};
