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
    console.log("permissions:", permissions)
    // Ensure permissions is an array (if it's not already)
    let formattedPermissions = [];

    // If permissions is already an array, use it directly
    if (Array.isArray(permissions)) {
      formattedPermissions = permissions;
    }
    // If permissions is an object, filter the true ones and convert to an array
    else if (typeof permissions === 'object') {
      formattedPermissions = Object.keys(permissions).filter(key => permissions[key]);
    }

    // If no permissions are active, set to an empty array (or a default permission)
    if (formattedPermissions.length === 0) {
      formattedPermissions = [];  // Or set to ["DefaultPermission"] if you want a default
    }

    // Ensure it's an array format like ["ViewLetter", "CommentLetter"]
    console.log("Formatted Permissions:", formattedPermissions);

    // Update the role in the database
    const [updatedRowsCount] = await Role.update(
      {
        role_name,
        permissions: formattedPermissions,  // Store the permissions directly as an array
      },
      {
        where: { role_id },
        returning: true,  // Return updated record
      }
    );

    if (updatedRowsCount === 0) {
      throw new Error(`Role with ID ${role_id} not found.`);
    }

    // Retrieve the updated role from the database
    const updatedRole = await Role.findOne({
      where: { role_id },
    });

    console.log("Role updated:", updatedRole);
    return updatedRole;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
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
