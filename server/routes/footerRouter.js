const express = require('express');
const { 
        addFooterHandler,
        getFootersHandler,
     } = require('../controllers/FooterController');

const protect = require('../middleware/auth');
const footerRouter = express.Router();
const profile = require('../middleware/profile-images')

 
footerRouter.post('/add', addFooterHandler); 
footerRouter.get('/view', getFootersHandler);



module.exports = footerRouter;

