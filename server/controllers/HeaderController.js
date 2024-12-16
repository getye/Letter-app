const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');
const { 
    addHeader,
    getHeaders,
   } = require('../services/headerService');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();


const addHeaderHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const { header_title, amharic_title} = req.body;
        const header_logo = path.join('uploads/logo', req.file.filename);
        const header = await addHeader(id, header_title, amharic_title, header_logo);
        res.status(201).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

/*
const addHeaderHandler = async (req, res) => {
    try {
        const id = uuidv4();
        let { header_title } = req.body;
        const header_logo = path.join('uploads/logo', req.file.filename);

        // Translate the header_title to Amharic
        const [translation] = await translate.translate(header_title, 'am');

        // Save the translated header_title
        const header = await addHeader(id, header_title, translation, header_logo);

        res.status(201).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; */

// Handler to get all headers
const getHeadersHandler = async (req, res) => {
  try {
      const headers = await getHeaders();
      res.status(200).json(headers);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = { 
    addHeaderHandler,
    getHeadersHandler,
   };
 