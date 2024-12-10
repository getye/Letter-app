const Office = require('../models/OfficeModel');
const User = require('../models/UserModel');


// Function to add office
const addOffice = async (id, name, writer, head, manager, executive, type) => {
  try {
    
    const office = await Office.create({
      office_id: id,
      office_name: name,
      writer: writer,
      head: head,
      manager: manager,
      executive: executive,
      type: type
    });
    return office;
  } catch (error) {
    console.error("Error to add office:", error);
    throw error;
  }
};


// Function to retrieve  offices
const getOffices = async () => {
  try {
    const offices = await Office.findAll({
      include: [
        { model: User, as: 'Writer', attributes: ['user_name'] }, // Include writer's name
        { model: User, as: 'Head', attributes: ['user_name'] },   // Include head's name
        { model: User, as: 'Manager', attributes: ['user_name'] }, // Include manager's name
        { model: User, as: 'Executive', attributes: ['user_name'] }, // Include executive's name
      ],
    });

    // Transform results to flatten nested user names
    const transformedOffices = offices.map(office => {
      const officeData = office.toJSON();
      return {
        ...officeData,
        writer_name: officeData.Writer?.user_name || null,
        head_name: officeData.Head?.user_name || null,
        manager_name: officeData.Manager?.user_name || null,
        executive_name: officeData.Executive?.user_name || null,
      };
    });

    console.log("Offices retrieved:", transformedOffices);
    return transformedOffices;
  } catch (error) {
    console.error("Error retrieving offices:", error);
    throw error;
  }
};

const getOfficesByUserId = async (userId) => {
  try {
    const offices = await Office.findAll({
      where: { writer: userId }, // Matches the writer field
      attributes: ['type'], // Fetch specific office fields
    });

    return offices;
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw error;
  }
};

const updateOffice = async (id, office_name, writer, head, manager) => {
  try {
    const updatedOffice = await Office.update(
      {
        office_name: office_name,
        writer: writer,
        head: head,
        manager: manager,
      }, // Object containing fields to update
      {
        where: { office_id: id }, // Options object
        returning: true, // Return the updated rows
      }
    );

    console.log("Office updated:", updateOffice);
    return updateOffice;
  } catch (error) {
    console.error("Error updating office:", error);
    throw error;
  }
};

module.exports = {
  addOffice,
  getOffices,
  updateOffice,
  getOfficesByUserId,
};
