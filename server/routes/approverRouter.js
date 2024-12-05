const express = require('express');
const protect = require('../middleware/auth');
const approverRouter = express.Router();
const profile = require('../middleware/profile-images')
const { 
        rejectLetterHandler,
        acceptLetterHandler,
     } = require('../controllers/ApproverController');

 
approverRouter.put('/reject/:ref_no', protect, rejectLetterHandler); 
approverRouter.put('/accept/:ref_no', protect, acceptLetterHandler); 




module.exports = approverRouter;

