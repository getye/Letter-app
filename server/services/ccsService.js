const CC = require('../models/CcsModel');

// Function to add new receivers
const addCcs = async (id, names, emails) => {
  try {
    // Create a new cc record
    const ccs = await CC.create({
      cc_id: id,
      ccs_name: names, // Array of names
      ccs_email: emails, // Array of emails
    });
    return ccs;
  } catch (error) {
    console.error("Error adding ccs:", error);
    throw error;
  }
};

// Function to update CCS
const updateCCs = async (id, name, email) => {
  try {
    const updatedCCs = await CC.update(
      { 
        ccs_name: name, 
        ccs_email: email
       },
      {
        where: { cc_id: id },
        returning: true, // Return the updated row(s)
      }
    );
    console.log("CC updated:", updateCCs);
    return updateCCs;
  } catch (error) {
    console.error("Error updating CCs:", error);
    throw error;
  }
};

module.exports = {
  addCcs,
  updateCCs,
};
