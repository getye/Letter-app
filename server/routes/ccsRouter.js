const express = require('express');
const protect = require('../middleware/auth');
const ccsRouter = express.Router();
const profile = require('../middleware/profile-images')

const { 
        addCcsHandler,
        updateCcsHandler,
     } = require('../controllers/CcsController');


 
ccsRouter.post('/add', addCcsHandler); 
ccsRouter.put('/update/:id', updateCcsHandler); 



module.exports = ccsRouter;

