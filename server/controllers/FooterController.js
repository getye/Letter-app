const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    addFooter,
    getFooters,
   } = require('../services/footerService');


const addFooterHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const { phone, email, address, pobox, slogan, website} = req.body;
        console.log("Phone:", phone)
        console.log("email:", email)
        const footer = await addFooter(id, phone, email, address, pobox, slogan, website);
        res.status(201).json(footer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to get all headers
const getFootersHandler = async (req, res) => {
  try {
      const footers = await getFooters();
      res.status(200).json(footers);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = { 
    addFooterHandler,
    getFootersHandler,
   };
 