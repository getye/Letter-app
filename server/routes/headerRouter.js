const express = require('express');
const { 
        addHeaderHandler,
        getHeadersHandler,
     } = require('../controllers/HeaderController');

const protect = require('../middleware/auth');
const headerRouter = express.Router();
const profile = require('../middleware/profile-images')
const logo = require('../middleware/logo-images')

 
headerRouter.post('/add', logo.single("header_logo"), addHeaderHandler); 
headerRouter.get('/view', getHeadersHandler);



module.exports = headerRouter;

