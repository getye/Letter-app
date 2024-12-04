const Receiver = require('../models/ReceiversModel');

// Function to add new receivers
const addReceivers = async (id, names, emails) => {
  try {
    // Create a new receiver record
    const receivers = await Receiver.create({
      receiver_id: id,
      receiver_name: names, // Array of names
      receiver_email: emails, // Array of emails
    });
    return receivers;
  } catch (error) {
    console.error("Error adding receivers:", error);
    throw error;
  }
};

// Function to update Receivers
const updateReceivers = async (id, name, email) => {
  try {
    const updatedReceivers = await Receiver.update(
      { 
        receiver_name: name, 
        receiver_email: email 
      },
      {
        where: { receiver_id: id },
        returning: true, // Return the updated row(s)
      }
    );
    console.log("Receiver updated:", updatedReceivers);
    return updatedReceivers;
  } catch (error) {
    console.error("Error updating Receivers:", error);
    throw error;
  }
};

module.exports = {
  addReceivers,
  updateReceivers,
};
