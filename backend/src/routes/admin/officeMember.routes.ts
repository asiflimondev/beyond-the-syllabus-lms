import { Router } from 'express';
import {
  getOfficeMemberStats,
  createOfficeMember,
  getAllOfficeMembers,
  getOfficeMemberById,
  updateOfficeMember,
  deleteOfficeMember,
  restoreOfficeMember,
} from '../../controllers/admin/officeMember.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getOfficeMemberStats);
router.post('/', createOfficeMember);
router.get('/', getAllOfficeMembers);
router.get('/:id', getOfficeMemberById);
router.put('/:id', updateOfficeMember);
router.delete('/:id', deleteOfficeMember);
router.patch('/:id/restore', restoreOfficeMember);

export default router;