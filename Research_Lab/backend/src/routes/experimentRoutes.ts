import { Router } from 'express';
import {
    createExperiment, getExperiments, getExperiment,
    updateExperiment, deleteExperiment,
    createExperimentRun, getExperimentRuns, deleteExperimentRun,
} from '../controllers/experimentController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(protect);

router.route('/').get(getExperiments).post(createExperiment);
router.route('/:id').get(getExperiment).put(updateExperiment).delete(deleteExperiment);

// Experiment runs
router.post('/runs', upload.single('resultGraph'), createExperimentRun);
router.get('/:experimentId/runs', getExperimentRuns);
router.delete('/runs/:id', deleteExperimentRun);

export default router;
