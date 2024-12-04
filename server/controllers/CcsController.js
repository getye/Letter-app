const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    addCcs,
    updateCCs,
   } = require('../services/ccsService');

   
const addCcsHandler = async (req, res) => {
     try {
       const { ccs } = req.body;
       // Validation to ensure the payload is correct
       if (!ccs || !Array.isArray(ccs) || ccs.length === 0) {
         return res.status(400).json({ error: "CC array is required and cannot be empty." });
       }
   
       // Extract arrays of names and emails from the ccs
       const names = ccs.map((cc) => cc.name);
       const emails = ccs.map((cc) => cc.email);
   
       const id = uuidv4(); // Generate a single ID for all ccs
   
       // Save the data (send to the service for database storage)
       const result = await addCcs( id, names, emails );
   
       res.status(201).json({
         message: "CC added successfully",
         data: {
           id,
           names,
           emails,
         },
       });
     } catch (error) {
       console.error("Error adding ccs:", error);
       res.status(500).json({ error: error.message });
     }
   };

// Handler to update CCs 
const updateCcsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
      const result = await updateCCs(id, name, email);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
   

module.exports = { 
    addCcsHandler,  
    updateCcsHandler,  
   };
 