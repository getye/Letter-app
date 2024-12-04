const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { toEthiopian } = require('ethiopian-date');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    addLetter,
    getLetters,
    updateLetter
   } = require('../services/letterService');

//function to generate reference number
 const generateReferenceNumber = () => {
     const date = new Date();
   
     // Convert Gregorian date to Ethiopian
     const [ethiopianYear, ethiopianMonth, ethiopianDay] = toEthiopian(
       date.getFullYear(),
       date.getMonth() + 1, // Months are 0-indexed in JavaScript
       date.getDate()
     );
   
     // Format Ethiopian date
     const year = String(ethiopianYear);
     const month = String(ethiopianMonth).padStart(2, '0');
     const day = String(ethiopianDay).padStart(2, '0');
     const random = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
   
     return `REF-${year}${month}${day}-${random}`;
   };

//function to generate ethiopian date
const ethiopianDate = () => {
    const date = new Date();
  
    // Convert Gregorian date to Ethiopian
    const [ethiopianYear, ethiopianMonth, ethiopianDay] = toEthiopian(
      date.getFullYear(),
      date.getMonth() + 1, // Months are 0-indexed in JavaScript
      date.getDate()
    );
  
    // Format Ethiopian date
    const year = String(ethiopianYear);
    const month = String(ethiopianMonth).padStart(2, '0');
    const day = String(ethiopianDay).padStart(2, '0');
  
    return `${day}/${month}/${year}`;
  };
   

const addLetterHandler = async (req, res) => {
     try {

       const ref_no = generateReferenceNumber();
       const date = ethiopianDate();
       const writer = req.user.userId;
       const { header, receivers, subject, content, ccs, footer, status } = req.body; 
       
       await addLetter( ref_no, date, header, writer, receivers, subject, content, ccs, footer, status);
       res.status(201).json({ message: "Letter created successfully"});
     } catch (error) {
       console.error("Error to create letter:", error);
       res.status(500).json({ error: error.message });
     }
   };

const getLettersHandler = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { role } = req.params;
        const letters = await getLetters(user_id, role);
        res.status(200).json(letters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };

// Handler to update Letter 
const updateLetterHandler = async (req, res) => {
  try {
    const { ref_no } = req.params;
    const { subject, content, status } = req.body;
      const result = await updateLetter(ref_no, subject, content, status);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
   

module.exports = { 
  addLetterHandler, 
  getLettersHandler,
  updateLetterHandler,
   };
 