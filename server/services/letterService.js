const Letter = require('../models/LetterModel');
const Header = require('../models/HeaderModel');
const User = require('../models/UserModel');
const Receiver = require('../models/ReceiversModel');
const CC = require('../models/CcsModel');
const Approver = require('../models/ApproverModel');
const Footer = require('../models/FooterModel');
const Office = require('../models/OfficeModel');
const { Op, Sequelize } = require('sequelize');



// Function to add new letter
const addLetter = async (ref_no, date, header, writer, receivers, subject, content, ccs, footer, status) => {
  try {

    const letter = await Letter.create({
      ref_no: ref_no,
      date: date, 
      header_id: header, 
      writer_id: writer,
      receiver_id: receivers,
      subject: subject,
      content: content,
      cc_id: ccs,
      footer_id: footer,
      status: status,

    });
    return letter;
  } catch (error) {
    console.error("Error creating a letter:", error);
    throw error;
  }
};



// Function to update Letter
const updateLetter = async (ref_no, subject, content, status) => {
  try {
    const updatedLetter = await Letter.update(
      { 
        subject: subject, 
        content: content,
        status: status,
       },
      {
        where: { ref_no: ref_no },
        returning: true, // Return the updated row(s)
      }
    );
    console.log("Letter updated:", updatedLetter);
    return updatedLetter;
  } catch (error) {
    console.error("Error updating Letter:", error);
    throw error;
  }
};

const getLetters = async (user_id, role) => {
  try {
    let whereConditions = {}; // Default where conditions

    // Common includes for all roles
    const commonIncludes = [
      { model: Header, as: 'header' },
      { model: User, as: 'writer' },
      { model: Receiver, as: 'receiver' },
      { model: CC, as: 'cc' },
      { model: Approver, as: 'approver' },
      { model: Footer, as: 'footer' },
      { model: Office, as: 'office' },
    ];

    // Role-based specific logic
    switch (role) {
      case "Writer":
        whereConditions = { writer_id: user_id };
        break;
        
      case "Head":
        const headOffice = await Office.findOne({
          where: { head: user_id },
          attributes: ['office_id'],
        });
        if (!headOffice) throw new Error('No office found for this head.');

        whereConditions = { '$office.office_id$': headOffice.office_id }; // Join Office and filter by office_id
        break;

      case "Manager":
        const managedOffices = await Office.findAll({
          where: { manager: user_id },
          attributes: ['office_id'],
        });
        if (!managedOffices || managedOffices.length === 0) {
          throw new Error('No offices found for this manager.');
        }
        const officeIds = managedOffices.map((office) => office.office_id);

        whereConditions = {
          status: { [Op.ne]: 'Pending for department approval' }, // Filter out 'Pending for department approval' status
          '$office.office_id$': { [Op.in]: officeIds }, // Join Office and filter by multiple office_ids
        };
        break;

      case "Executive":
        // No additional conditions for Executive role
        break;

      default:
        throw new Error('Invalid role specified');
    }

    // Fetch the letters based on the role
    const letters = await Letter.findAll({
      where: whereConditions,
      include: commonIncludes,
    });

        // Handle duplication of ref_no
        const seenRefNos = new Set();
        const uniqueLetters = letters.filter(letter => {
          const key = letter.ref_no; // Use ref_no to identify duplicates
          if (seenRefNos.has(key)) {
            return false; // Skip duplicate
          } else {
            seenRefNos.add(key);
            return true;
          }
        });
    
        // Handle office head assignment based on office type
        uniqueLetters.forEach(letter => {
          const office = letter.office; // Get the office details
    
          // Check if the office type is "Executive" or "Managing" and adjust head assignment accordingly
          if (office.type === "Executive") {
            office.head = null;
            office.manager = null;
            office.executive = office.executive;
          } else if (office.type === "Managing") {
            office.head = null;
            office.manager = office.manager; 
            office.executive = office.executive;
          }
        });
      return uniqueLetters; // Return the processed unique letters
  } catch (error) {
    console.error('Error retrieving letters:', error);
    throw error;
  }
};


const receivedLetters = async (email) => {
  try {
    // Fetch all receiver IDs where the email matches
    const receivers = await Receiver.findAll({
      where: Sequelize.where(
        Sequelize.fn('JSON_CONTAINS', Sequelize.col('receiver_email'), JSON.stringify(email)),
        true
      ),
      attributes: ['receiver_id'], // Fetch only receiver_id
    });

    // If no receivers are found, return an empty array or handle the case
    if (!receivers || receivers.length === 0) {
      console.log("No receivers found for the given email.");
      return [];
    }

    // Extract receiver IDs
    const receiverIds = receivers.map(({ receiver_id }) => receiver_id);

    // Fetch all letters with archived status
    const letters = await Letter.findAll({
      where: {
        receiver_id: receiverIds,
        status: "Archived",
      },
      include: [
        { model: Header, as: 'header' },
        { model: User, as: 'writer' },
        { model: Receiver, as: 'receiver' },
        { model: CC, as: 'cc' },
        { model: Approver, as: 'approver' },
        { model: Footer, as: 'footer' },
        { model: Office, as: 'office' },
      ],
    });

    // Handle duplication of ref_no
    const seenRefNos = new Set();
    const uniqueLetters = letters.filter(letter => {
      const key = letter.ref_no; // Use ref_no to identify duplicates
      if (seenRefNos.has(key)) {
        return false; // Skip duplicate
      } else {
        seenRefNos.add(key);
        return true;
      }
    });

    // Handle office head assignment based on office type
    uniqueLetters.forEach(letter => {
      const office = letter.office; // Get the office details

      // Check if the office type is "Executive" or "Managing" and adjust head assignment accordingly
      if (office.type === "Executive") {
        office.head = null;
        office.manager = null;
        office.executive = office.executive;
      } else if (office.type === "Managing") {
        office.head = null;
        office.manager = office.manager; 
        office.executive = office.executive;
      }
    });

    return uniqueLetters; // Return the processed unique letters
  } catch (error) {
    console.error("Error retrieving letters:", error);
    throw error;
  }
};




module.exports = {
  addLetter,
  getLetters,
  updateLetter,
  receivedLetters,
};
