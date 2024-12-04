const Header = require('../models/HeaderModel');



// Function to create new header
const addHeader = async (id, title, logo) => {
  try {
    
    const header = await Header.create({
      header_id: id,
      header_title: title,
      header_logo: logo,
    });
    return header;
  } catch (error) {
    console.error("Error to craete header:", error);
    throw error;
  }
};


// Function to retrieve  headers
const getHeaders = async () => {
  try {
    const headers = await Header.findAll()
    return headers;
  } catch (error) {
    console.error("Error retrieving headers:", error);
    throw error;
  }
};


module.exports = {
  addHeader,
  getHeaders,
};
