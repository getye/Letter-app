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
    //Get approver
    const approver = await User.findOne({
      where: { user_id: user_id },
      attributes: ['user_name', 'user_role'],
    });
    const userName = approver.user_name; // Access user_name
    const userRole = approver.user_role; // Access user_role

    //get approvers' id and remark from letter
    const letter = await Letter.findOne({
      where: { ref_no: ref_no },
      attributes: ['approvers_id', 'remark'],
    });
    const letter_remark = letter.remark;
    const id = letter.approvers_id;
    console.log("Approvers id:", id)

    if(letter_remark === null || !letter_remark){
      //Create Approver
      const addApprover = await Approver.create(
        {
          approver_id: approvers_id, 
          approvers_name: userName, 
          approvers_position: userRole,
          approvers_segnature: sign,
        });

      //update Letter
      const result = await Letter.update(
        {
        approvers_id: approvers_id, 
        status: status, 
        remark: remark,
      },
      {
        where: { ref_no: ref_no },
        returning: true, // Return the updated row(s)
      });
      return result;
      }else{
        //get previous approver
        const existingApprover = await Approver.findOne({
          where: { approver_id: id },
        });
        
        // Check if the record exists
          const updatedName = `${existingApprover.approvers_name}, ${userName}`; // Append the new name
          const updatedPosition = `${existingApprover.approvers_position}, ${userRole}`; // Append the new position
          const updatedSignature = `${existingApprover.approvers_segnature}, ${sign}`; // Append the new signature
        
          const updatedApprovers = await Approver.update(
            {
              approvers_name: updatedName,
              approvers_position: updatedPosition,
              approvers_segnature: updatedSignature,
            },
            {
              where: { approver_id: id },
            }
          );
        
        //update Letter
        const result = await Letter.update(
          {
            status: status, 
            remark: remark,
          },
          {
            where: { ref_no: ref_no },
            returning: true, // Return the updated row(s)
          });
        return result;
      }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};



module.exports = {
  rejectLetter,
  acceptLetter,
};
