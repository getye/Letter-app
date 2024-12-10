const Approver = require('../models/ApproverModel');
const Letter = require('../models/LetterModel');
const User = require('../models/UserModel');


const rejectLetter = async (ref_no, status, comment, approvers_id, user_id, sign) => {
  try {
    //Get approver
    const approver = await User.findOne({
      where: { user_id: user_id },
      attributes: ['user_name', 'user_role'],
    });
    const userName = approver.user_name; // Access user_name
    const userRole = approver.user_role; // Access user_role

    //Create Approver
    const addApprover = await Approver.create(
      {
        approver_id: approvers_id, 
        approvers_name: userName, 
        approvers_position: userRole,
        approvers_segnature: sign,
      });

    // Update Letter
    const result = await Letter.update(
      {
      approvers_id: approvers_id, 
      status: status, 
      remark: comment,
    },
    {
      where: { ref_no: ref_no },
      returning: true, // Return the updated row(s)
    });
    return result;
  } catch (error) {
    console.error("Error adding ccs:", error);
    throw error;
  }
};

const acceptLetter = async (ref_no, status, remark, approvers_id, user_id, sign) => {
  try {
    // Get approver details
    const approver = await User.findOne({
      where: { user_id: user_id },
      attributes: ['user_name', 'user_role'],
    });
    const userName = approver.user_name;
    const userRole = approver.user_role;

    // Get approvers' ID and remark from the Letter
    const letter = await Letter.findOne({
      where: { ref_no: ref_no },
      attributes: ['approvers_id', 'remark'],
    });
    const letter_remark = letter.remark;
    const id = letter.approvers_id;

    if (!letter_remark) {
      // First approver: Create a new Approver record
      const addApprover = await Approver.create({
        approver_id: approvers_id,
        approvers_name: JSON.stringify([userName]), // Store as a JSON string
        approvers_position: JSON.stringify([userRole]),
        approvers_signature: JSON.stringify([sign]),
      });

      // Update the Letter
      const result = await Letter.update(
        {
          approvers_id: approvers_id,
          status: status,
          remark: remark,
        },
        {
          where: { ref_no: ref_no },
          returning: true,
        }
      );
      return result;
    } else {
      // Retrieve the existing Approver record
      const existingApprover = await Approver.findOne({
        where: { approver_id: id },
      });

      if (!existingApprover) {
        throw new Error('Existing approver not found');
      }

      // Parse the existing JSON fields from LONGTEXT
      const existingNames = JSON.parse(existingApprover.approvers_name || '[]');
      const existingPositions = JSON.parse(existingApprover.approvers_position || '[]');
      const existingSignatures = JSON.parse(existingApprover.approvers_signature || '[]');

      // Append new values to the arrays
      const updatedNames = [...existingNames, userName];
      const updatedPositions = [...existingPositions, userRole];
      const updatedSignatures = [...existingSignatures, sign];

      // Update the Approver record with serialized JSON
      await Approver.update(
        {
          approvers_name: JSON.stringify(updatedNames),
          approvers_position: JSON.stringify(updatedPositions),
          approvers_signature: JSON.stringify(updatedSignatures),
        },
        {
          where: { approver_id: id },
        }
      );

      // Update the Letter
      const result = await Letter.update(
        {
          status: status,
          remark: remark,
        },
        {
          where: { ref_no: ref_no },
          returning: true,
        }
      );
      return result;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};




module.exports = {
  rejectLetter,
  acceptLetter,
};
