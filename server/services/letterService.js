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
    if (role === "Writer") {
      const letters = await Letter.findAll({
        where: { writer_id: user_id },
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
  
      return letters;
    }

    else if (role === "Head") {    
      try {
        const headOffice = await Office.findOne({
          where: { head: user_id },
          attributes: ['office_id'],
        });
    
        if (!headOffice) {
          throw new Error('No office found for this head.');
        }
    
        const letters = await Letter.findAll({
          include: [
            {
              model: User,
              as: 'writer', // Alias for the writer association in Letter
            },
            {
              model: Office, 
              where: { office_id: headOffice.office_id },
              as: 'office',
              required: true,
            },
            { model: Header, as: 'header' },
            { model: Receiver, as: 'receiver' },
            { model: CC, as: 'cc' },
            { model: Approver, as: 'approver' },
            { model: Footer, as: 'footer' },
          ],
        });
    
        return letters;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
      
    else if (role === "Manager") { 
      try {
        const managedOffices = await Office.findAll({
          where: { manager: user_id },
          attributes: ['office_id'],
        });
    
        if (!managedOffices || managedOffices.length === 0) {
          throw new Error('No offices found for this manager.');
        }
    
        const officeIds = managedOffices.map((office) => office.office_id);
    
        const letters = await Letter.findAll({
          where: { 
            status: { [Op.ne]: 'Pending for department approval' } // Not equal to 'Pending for department approval'
          },          
          include: [
            {
              model: User,
              as: 'writer',
            },
            {
              model: Office,
              where: { office_id: { [Op.in]: officeIds } },
              as: 'office',
              required: true,
            },
            { model: Header, as: 'header' },
            { model: Receiver, as: 'receiver' },
            { model: CC, as: 'cc' },
            { model: Approver, as: 'approver' },
            { model: Footer, as: 'footer' },
          ],
        });
    
        return letters;
      } catch (error) {
        console.error(error);
        throw error;
      }
      
      }
    else if (role === "Executive") { 
      const letters = await Letter.findAll({
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
      return letters;
      }
    else{
        throw new Error('Invalid role specified');
      }

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

    // Return an empty array if no receivers are found
    if (receivers.length === 0) {
      console.log("No receivers found for the given email.");
      return [];
    }

    // Extract receiver IDs
    const receiverIds = receivers.map(({ receiver_id }) => receiver_id);

    // Fetch archived letters for matching receiver IDs
    return await Letter.findAll({
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
