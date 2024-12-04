const User = require('../models/UserModel');
const Account = require('../models/AccountModel');
const Role = require('../models/roleModel');
const Office = require('../models/OfficeModel');


// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const accountWithUser = await Account.findOne({
      where: { user_email: email },
      include: [
        {
          model: User, // Include the associated User model
          attributes: ['user_role'], // Only fetch the user_role field
          include: [
            {
              model: Role, // Include the Role model to fetch role permissions
              attributes: ['permissions'], // Only fetch the permissions field from Role
            },
            {
              model: Office, // Include the Office model
              attributes: ['type'], // Fetch only the type field
            },
          ],
        },
      ],
    });

    // Log the full result to verify the structure
    if (accountWithUser) {
      const accountData = accountWithUser.toJSON(); // Convert Sequelize instance to plain object
      console.log("Account Data:", accountData); // Log the full result
      console.log("Permissions:", accountData.User?.Role?.permissions); // Log the permissions to verify if they are included correctly

      return {
        ...accountData, // Include all fields from Account
        user_role: accountData.User?.user_role, // Flatten user_role from the User model
        permissions: accountData.User?.Role?.permissions, // Flatten permissions from the Role model
      };
    }

    return null; // Return null if no account found
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};




// Function to create a user and associated account
const createUser = async (id, name, email, hashedpass, phone, role, coverPhoto, user_status) => {
  const transaction = await User.sequelize.transaction(); // Start a transaction
  try {
    // Create a new user in the User table
    const savedUser = await User.create(
      {
        user_id: id,
        user_name: name,
        user_phone: phone,
        user_role: role,
        user_profile: coverPhoto,
      },
      { transaction }
    );

    // Create a corresponding account in the Account table
    const savedAccount = await Account.create(
      {
        user_id: id,
        user_email: email,
        user_password: hashedpass,
        user_status: user_status,
      },
      { transaction }
    );

    await transaction.commit(); // Commit the transaction
    return { user: savedUser, account: savedAccount };
  } catch (error) {
    await transaction.rollback(); // Roll back the transaction on error
    console.error("Error creating user or account:", error);
    throw error;
  }
};

// Function to retrieve all users
const getUsers = async () => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Account,
          attributes: ['user_email', 'user_status'], // Fields to include from the Account model
        },
      ],
    });

    // Transform the result to flatten the Account fields
    const transformedUsers = users.map(user => {
      // Convert Sequelize instance to plain object
      const userData = user.toJSON(); 
      // Destructure to separate Account
      const { Account, ...userWithoutAccount } = userData; 
      return {
        ...userWithoutAccount, // Spread user data
        ...Account, // Spread Account data
      };
    });

    return transformedUsers;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};


// Function to retrieve  offices
const getOffices = async () => {
  try {
    // Retrieve all roles from the Role table
    const roles = await Role.findAll();
    return roles;
  } catch (error) {
    console.error("Error retrieving roles:", error);
    throw error;
  }
};

// Function to update user status by id
const updateUserRole = async (id, newRole) => {
  try {
    const updatedUser = await User.update(
      { user_role: newRole },
      {
        where: { user_id: id },
        returning: true, // Return the updated row(s)
      }
    );

    console.log("User status updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};


// Function to update user status by id
const updateUserStatus = async (id, newStatus) => {
  try {
    const [updatedRowsCount, [updatedUser]] = await Account.update(
      { user_status: newStatus },
      {
        where: { user_id: id },
        returning: true, // Return the updated row(s)
      }
    );

    if (updatedRowsCount === 0) {
      throw new Error(`User with email ${id} not found.`);
    }

    console.log("User status updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Function to delete a user by id
const deleteUser = async (id) => {
  try {
    const deletedUser = await User.destroy({ where: { user_id: id } });
    const deletedCount = await Account.destroy({ where: { user_id: id } });
    if (deletedCount & deletedUser === 0) {
      throw new Error(`User with email ${id} not found.`);
    }

    console.log(`User with email ${id} deleted successfully.`);
    return { message: `User with email ${id} successfully deleted.` };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Function to update password by user ID
const updatePassword = async (id, newPass) => {
  try {
    const updatedAccount = await Account.update(
      { user_password: newPass },
      {
        where: { user_id: id },
        returning: true, // Return the updated row(s)
      }
    );



    console.log("Password updated:", updatedAccount);
    return updatedAccount;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  getUsers,
  getOffices,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  updatePassword,
};
