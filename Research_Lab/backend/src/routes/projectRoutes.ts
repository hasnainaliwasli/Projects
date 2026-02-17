import { Router } from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

export default router;
