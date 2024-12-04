const Office = require('../models/OfficeModel');
const User = require('../models/UserModel');


// Function to add office
const addOffice = async (id, name, writer, head, manager, type) => {
  try {
    
    const office = await Office.create({
      office_id: id,
      office_name: name,
      writer: writer,
      head: head,
      manager: manager,
      type:type
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
      };
    });

    console.log("Offices retrieved:", transformedOffices);
    return transformedOffices;
  } catch (error) {
    console.error("Error retrieving offices:", error);
    throw error;
  }
};


const updateOffice = async (id, office_name, writer, head, manager) => {
  try {
    const updatedOffice = await Office.update(
      { office_name: office_name },
      { writer: writer },
      { head: head },
      { manager: manager },
      {
        where: { office_id: id },
        returning: true, // Return the updated row(s)
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
};
