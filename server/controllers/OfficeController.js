const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    addOffice,
    getOffices,
    updateOffice,
   } = require('../services/officeService');


const addOfficesHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const { name, writer, head, manager, type } = req.body;
        const office = await addOffice(id, name, writer, head, manager, type);
        res.status(201).json(office);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to get all offices
const getOfficesHandler = async (req, res) => {
  try {
      const users = await getOffices();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const updateOfficeHandler = async (req, res) => {
    try {
      const { office_id } = req.params; // Get user ID from the request parameters
      const { office_name, writer, head, manager } = req.body;
        const result = await updateOffice(office_id, office_name, writer, head, manager);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };





module.exports = { 
    addOfficesHandler,
    getOfficesHandler,
    updateOfficeHandler,
   };
 