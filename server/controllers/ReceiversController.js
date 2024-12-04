const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    addReceivers,
    updateReceivers
   } = require('../services/receiversService');

const addReceiversHandler = async (req, res) => {
     try {
       const { receivers } = req.body;
       // Validation to ensure the payload is correct
       if (!receivers || !Array.isArray(receivers) || receivers.length === 0) {
         return res.status(400).json({ error: "Receivers array is required and cannot be empty." });
       }
   
       // Extract arrays of names and emails from the receivers
       const names = receivers.map((receiver) => receiver.name);
       const emails = receivers.map((receiver) => receiver.email);
   
       const id = uuidv4(); // Generate a single ID for all receivers
   
       // Save the data (send to the service for database storage)
       const result = await addReceivers( id, names, emails );
   
       res.status(201).json({
         message: "Receivers added successfully",
         data: {
           id,
           names,
           emails,
         },
       });
     } catch (error) {
       console.error("Error adding receivers:", error);
       res.status(500).json({ error: error.message });
     }
   };

// Handler to update Receivers 
const updateReceiversHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    console.log("id", id)
    console.log("name:",name)
      const result = await updateReceivers(id, name, email);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = { 
    addReceiversHandler,   
    updateReceiversHandler, 
   };
 