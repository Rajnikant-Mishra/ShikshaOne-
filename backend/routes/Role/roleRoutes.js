import express from 'express';
const router = express.Router();
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from '../../controllers/Role/roleController.js';

router.post('/role', createRole);
router.get('/role', getAllRoles);
router.get('/role/:id', getRoleById);
router.put('/role/:id', updateRole);
router.delete('/role/:id', deleteRole);

export default router;
