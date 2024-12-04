const Footer = require('../models/FooterModel');



// Function to create new footer
const addFooter = async (id, phone, email, address, pobox, slogan, website) => {
  try {
    
    const footer = await Footer.create({
      footer_id: id,
      phone: phone,
      email: email,
      address: address,
      pobox: pobox,
      slogan: slogan,
      website: website,
    });
    return footer;
  } catch (error) {
    console.error("Error to craete footer:", error);
    throw error;
  }
};


// Function to retrieve  footers
const getFooters = async () => {
  try {
    const footers = await Footer.findAll()
    return footers;
  } catch (error) {
    console.error("Error retrieving footers:", error);
    throw error;
  }
};


module.exports = {
  addFooter,
  getFooters,
};
