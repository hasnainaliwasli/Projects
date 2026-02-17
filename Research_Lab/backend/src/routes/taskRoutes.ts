import { Router } from 'express';
import { createTask, getTasks, getTask, updateTask, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.patch('/:id/status', updateTaskStatus);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

export default router;
