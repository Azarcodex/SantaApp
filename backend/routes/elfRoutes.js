import express from 'express';
import * as elfController from '../controllers/elfController.js';

const router = express.Router();

router.get('/', elfController.getElves);
router.post('/', elfController.createElf);
router.get('/:id', elfController.getElfById);
router.patch('/:id/status', elfController.updateElfStatus);
router.patch('/:id/reassign-tasks', elfController.reassignTasks);
router.post('/:id/assign-task', elfController.assignTask);
router.post('/auto-balance', elfController.autoBalance);

export default router;
