const Letter = require('../models/LetterModel');
const Header = require('../models/HeaderModel');
const User = require('../models/UserModel');
const Receiver = require('../models/ReceiversModel');
const CC = require('../models/CcsModel');
const Approver = require('../models/ApproverModel');
const Footer = require('../models/FooterModel');
const Office = require('../models/OfficeModel');
const { Op } = require('sequelize');



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

/*
const getLetters = async (user_id, role) => {
  try {
    const letters = await Letter.findAll({
      include: [
        { model: Header, as: 'header' },
        { model: User, as: 'writer' },
        { model: Receiver, as: 'receiver' },
        { model: CC, as: 'cc' },
        { model: Approver, as: 'approver' },
        { model: Footer, as: 'footer' },
      ],
    },
  {
    where: { writer_id: user_id },
  });
    return letters;
  } catch (error) {
    console.error("Error retrieving letters:", error);
    throw error;
  }
}; */

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
    // Determine the query conditions based on the role
    let conditions = {};
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
          where: { status: 'Pending for managing approval' },
          include: [
            {
              model: User,
              as: 'writer',
            },
            {
              model: Office,
              where: { office_id: { [Op.in]: officeIds } },
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
        conditions = {
          [Op.or]: [
            { executive_id: user_id }, // Letters in the executive's office
            //{ status: 'Pending for executive approval' },
          ],
        };
      }
    else{
        throw new Error('Invalid role specified');
      }

  } catch (error) {
    console.error('Error retrieving letters:', error);
    throw error;
  }
};


module.exports = {
  addLetter,
  getLetters,
  updateLetter,
};
