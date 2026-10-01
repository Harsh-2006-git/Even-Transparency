import express from 'express';
import {
  getPlacementCoordinators,
  createPlacementCoordinator,
  updatePlacementCoordinator,
  deletePlacementCoordinator
} from '../controllers/placementCoordinatorController.js';

const router = express.Router();

router.get('/', getPlacementCoordinators);
router.post('/', createPlacementCoordinator);
router.put('/:id', updatePlacementCoordinator);
router.delete('/:id', deletePlacementCoordinator);

export default router;
