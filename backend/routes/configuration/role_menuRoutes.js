// import express from 'express';
// import {
//     assignMenu,
//     getMenusByRole,
   
//     getAllRoleMenu,
//     deleteRoleMenu
   
// } from '../../controllers/configuration/role_menuController.js';

// const router = express.Router();


// router.post('/assign', assignMenu);
// router.get('/:role_id', getMenusByRole);
// router.get('/menus/all', getAllRoleMenu); 
// // Delete a consignment by ID
// router.delete('/assign/:id', deleteRoleMenu);

// export default router;


import express from 'express';
import {
  assignMenu,
  getMenusByRole,
  getAllRoleMenu,
  deleteRoleMenu
} from '../../controllers/configuration/role_menuController.js';

const router = express.Router();

router.post('/assign', assignMenu);
router.get('/menus/all', getAllRoleMenu);
router.get('/:role_id', getMenusByRole);
router.delete('/assign/:id', deleteRoleMenu);

export default router;
