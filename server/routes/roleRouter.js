const express = require('express');
const { 
    createRoleHandler, 
    getRolesHandler,
    roleUpdateHandler,
    roleStatusUpdateHandler,
    deleteRoleHandler,
 } = require('../controllers/roleController');
 const protect = require('../middleware/auth');


const roleRouter = express.Router();

roleRouter.post('/add', protect, createRoleHandler); 
roleRouter.get('/view', protect, getRolesHandler); 
roleRouter.put('/update/:role_id', protect, roleUpdateHandler);
roleRouter.put('/update/status/:role_id', protect, roleStatusUpdateHandler);
roleRouter.delete('/delete/:role_id', protect, deleteRoleHandler);


module.exports = roleRouter;

/*
roleRouter.post('/admin/add/roles', roleController.addRole); 
roleRouter.get('/admin/roles', roleController.viewRoles); 
roleRouter.put('/admin/update/role/:role_id', roleController.updateRole);
roleRouter.delete('/admin/delete/role/:role_id', roleController.deleteRole);
roleRouter.put('/admin/update/role/status/:role_id', roleController.updateRoleStatus);
*/
 

