import { Router } from 'express';
import {
    uploadPaper, getPapers, getPaper, updatePaper,
    deletePaper, deletePapers, getSimilarPapers, regenerateSummary,
} from '../controllers/paperController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(protect);

router.route('/').get(getPapers);
router.post('/upload', upload.single('file'), uploadPaper);
router.post('/bulk-delete', deletePapers);
router.get('/:id/similar', getSimilarPapers);
router.post('/:id/regenerate-summary', regenerateSummary);
router.route('/:id').get(getPaper).put(updatePaper).delete(deletePaper);

export default router;
