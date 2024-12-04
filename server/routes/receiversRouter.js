const express = require('express');

const protect = require('../middleware/auth');
const receiversRouter = express.Router();
const profile = require('../middleware/profile-images')

const { 
        addReceiversHandler,
        updateReceiversHandler,
     } = require('../controllers/ReceiversController');

 
receiversRouter.post('/add', addReceiversHandler); 
receiversRouter.put('/update/:id', updateReceiversHandler); 



module.exports = receiversRouter;

