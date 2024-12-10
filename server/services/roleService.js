const Role = require('../models/roleModel');

// Function to create a role
const createRole = async (id, name, permissions, role_status) => {
  try {
    // Extract all permission keys into an array, including those with false values
    const permissionsArray = Object.keys(permissions);  // Get all keys

    // Create a new role in the Role table
    const role = await Role.create({
      role_id: id,
      role_name: name,
      permissions: permissionsArray,  // Store permissions as an array of keys
      role_status: role_status,
    });

    console.log("Role created:", role);
    return role;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};


// Function to retrieve all roles
const getRoles = async () => {
  try {
    // Retrieve all roles from the Role table
    const roles = await Role.findAll();
    return roles;
  } catch (error) {
    console.error("Error retrieving roles:", error);
    throw error;
  }
};

// Function to update a role by ID
const updateRole = async (role_id, role_name, permissions) => {
  try {


    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Invalid permissions format' });
    }

    const [updatedRowsCount] = await Role.update(
      {
        role_name: role_name,
        permissions:permissions, // Store permissions as an array
      },
      {
        where: { role_id:role_id },
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

  } catch (error) {
    console.error('Error updating role:', error);
  }
};








// Function to update role status by ID
const updateRoleStatus = async (id, newStatus) => {
  try {
    const updatedRole = await Role.update(
      { role_status: newStatus },
      {
        where: { role_id: id },
        returning: true, // Return the updated role
      }
    );

    console.log("Role status updated:", updatedRole);
    return updatedRole;
  } catch (error) {
    console.error("Error updating role status:", error);
    throw error;
  }
};

// Function to delete a role by ID
const deleteRole = async (id) => {
  try {
    const deletedCount = await Role.destroy({
      where: { role_id: id },
    });

    if (deletedCount === 0) {
      throw new Error(`Role with ID ${id} not found.`);
    }

    console.log(`Role with ID ${id} deleted successfully.`);
    return { message: `Role with ID ${id} successfully deleted.` };
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRole,
  updateRoleStatus,
  deleteRole,
};
