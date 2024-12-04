const express = require('express');
const protect = require('../middleware/auth');
const letterRouter = express.Router();
const profile = require('../middleware/profile-images')
const { 
        addLetterHandler,
        getLettersHandler,
        updateLetterHandler
     } = require('../controllers/LetterController');

 
letterRouter.post('/add', protect, addLetterHandler); 
letterRouter.get('/view/:role', protect, getLettersHandler); 
letterRouter.put('/edit/:ref_no', protect, updateLetterHandler); 


module.exports = letterRouter;

