import { Router } from 'express';
import { createNote, getNotes, getNote, updateNote, deleteNote, getNoteVersions } from '../controllers/noteController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.get('/:id/versions', getNoteVersions);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

export default router;
