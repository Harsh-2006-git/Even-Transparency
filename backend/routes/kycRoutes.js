import express from 'express';
import {
  getKYCQueue,
  verifyCandidateDocument,
  verifyUserAccount
} from '../controllers/kycController.js';

const router = express.Router();

router.get('/queue', getKYCQueue);
router.patch('/verify-document/:id', verifyCandidateDocument);
router.patch('/verify-user/:id', verifyUserAccount);

export default router;
