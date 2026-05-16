const express = require("express");
const router = express.Router();
const { createProject, getProjects, assignPaperToProject, getProjectById, deleteProject, removePaperFromProject } = require("../controllers/project.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/:id/papers", assignPaperToProject);
router.delete("/:id/papers/:paperId", removePaperFromProject);
router.delete("/:id", deleteProject);

module.exports = router;
