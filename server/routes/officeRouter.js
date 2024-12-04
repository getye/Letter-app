const express = require('express');
const { 
        addOfficesHandler,
        getOfficesHandler,
        updateOfficeHandler,
     } = require('../controllers/OfficeController');

const protect = require('../middleware/auth');
const officeRouter = express.Router();
const profile = require('../middleware/profile-images')

 

officeRouter.get('/view', protect, getOfficesHandler);
officeRouter.post('/add', protect, addOfficesHandler); 
officeRouter.put('/update/:office_id', protect, updateOfficeHandler);



module.exports = officeRouter;

