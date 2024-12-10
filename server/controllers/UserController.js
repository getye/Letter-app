const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../utils/jwt.helper'); 
const sendEmail = require('../utils/emailService');

const { 
    findUserByEmail,
    createUser, 
    getUsers,
    getOffices,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    updatePassword
   } = require('../services/userService');

function generateRandomText(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}


const createUserHandler = async (req, res) => {
    try {
        const id = uuidv4();
        const { userName, email, phone, role} = req.body;
        const password = generateRandomText(8);
        const hashedpass = await bcrypt.hash(password, 10);
        const user_status = "Active";
        const coverPhoto = null;
        const user = await createUser(id, userName, email, hashedpass, phone, role, coverPhoto, user_status);
        
        console.log(user)
        // Send the generated password to the user's email
        const emailSubject = "Your Account Has Been Created";
        const emailText = `Hello ${userName}, \n\nYour account has been successfully created for ${role}.
                        \nYour login details are as follows:\n\nEmail: ${email}\nPassword: ${password}
                        \n\nPlease change your password upon first login.
                        \n\nBest regards,`;
        // Send the email
        await sendEmail(email, emailSubject, emailText);  

        res.status(201).json({ message: "Registered Successfully and email sent"});  
    } catch (error) {
        res.json({ error: error.message });
    }
};


const login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    // Find user by email using Mongoose
    const user = await findUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Validate the password
    const validPass = await bcrypt.compare(password, user.user_password);

    if (!validPass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate tokens
    const tokens = generateTokens({
      user_id: user.user_id,
      user_email: user.user_email,
    });

    // Set refresh token as an HTTP-only cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: false, // Use true in production
    });

    // Respond with access token and user details
    res.json({
      message: "User logged in",
      token: tokens.accessToken,
      user_email: user.user_email,
      user_role: user.user_role,
      permissions: user.permissions,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Handler to get all users
const getUsersHandler = async (req, res) => {
  try {
      const users = await getUsers();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



// Handler to get all offices
const getOfficesHandler = async (req, res) => {
  try {
      const users = await getOffices();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Handler to update user status
const userStatusUpdateHandler = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user ID from the request parameters
    const { user_status } = req.body; // Get the new status from the request body
      const users = await updateUserStatus(user_id, user_status);
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



// Handler to update user 
const updateUserRoleHandler = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user ID from the request parameters
    const { user_role } = req.body;
      const result = await updateUserRole(user_id, user_role);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Handler to deleted user 
const deleteUserHandler = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user ID from the request parameters
      const result = await deleteUser(user_id);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const updatePasswordHandler = async (req, res) => {
  const user_id = req.user.userId;
  const { password } = req.body; // Get the new password from the request body
  const hashedpass = await bcrypt.hash(password, 10);
  try {  
    // Call the model function to update the user status
    const updatedPasswored = await updatePassword(user_id, hashedpass);

    if (!updatedPasswored) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Your Passwored is Updated Successfully'});
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { 
    createUserHandler,
    login,
    getUsersHandler,
    getOfficesHandler,
    userStatusUpdateHandler,
    updateUserRoleHandler,
    deleteUserHandler,
    updatePasswordHandler,
   };

/*
const signup = async (req, res) => {
  const id = uuidv4();
  const { email, password, phone, restaurantName, location, coverPhoto } = req.body;
  const hashedpass = await bcrypt.hash(password, 10);
  const user_status = "Active"
  const user_type = "Admin"
  
  try {
    await UserModel.createUser(id, email, hashedpass, phone, restaurantName, location, user_type, coverPhoto, user_status);
    res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error, not registered" });
  }
}; 


const customerSignup = async (req, res) => {
  const id = uuidv4();
  const { email, password, location, phone} = req.body;
  const hashedpass = await bcrypt.hash(password, 10);
  const role = "Customer";
  
  try {
    await UserModel.createAccount(id, email, hashedpass, role);
    await UserModel.createCustomer(id, email, hashedpass, location, phone);
    res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error, not registered" });
  }
}; 

const login = async (req, res) => {

  try {
    const { user_email, password } = req.body;
    const userResult = await UserModel.findUserByEmail(user_email);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const validPass = await bcrypt.compare(password, user.user_password);

    if (!validPass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate tokens using the correct function
    const tokens = generateTokens({
      user_id: user.user_id,
      user_email: user.user_email,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: false, // Use true in production
    });

    res.json({
      message: "User logged in",
      token: tokens.accessToken, // Use the access token generated by generateTokens
      user_email: user.user_email,
      user_role: user.user_role,
    });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ message: "Error logging in" });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const admin_id = req.user.userId;
    // Retrieve the admin's restaurant
    const restaurantName = await UserModel.getAdminRestaurant(admin_id);
    if (!restaurantName) {
      return res.status(404).json({ message: "Admin restaurant not found" });
    }
    
    //add users with thier restaurant 
    const users = await UserModel.getAllUsers(restaurantName);
    res.json(users.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  const { user_email } = req.params; // Get user ID from the request parameters
  const { user_status } = req.body; // Get the new status from the request body

  try {  
    // Call the model function to update the user status
    const updatedUser = await UserModel.updateUserStatus(user_email, user_status);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User status updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

function generateRandomText(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}


const addUser = async (req, res) => {
  const id = uuidv4();
  const admin_id = req.user.userId;
  const { userName, email, location, phone, role } = req.body;
  const password = generateRandomText(8);  // Generate random password
  const hashedpass = await bcrypt.hash(password, 10);
  const user_status = "Active";
  const user_profile = null;

  try {
    // Retrieve the admin's restaurant
    const restaurantName = await UserModel.getAdminRestaurant(admin_id);

    if (!restaurantName) {
      return res.status(404).json({ message: "Admin restaurant not found" });
    }

    // Add the user with the admin's restaurant
    await UserModel.addUser(id, userName, email, hashedpass, phone, location, role, user_profile, user_status, restaurantName);
    //add to the accounts table
    await UserModel.createAccount(id, email, hashedpass, role);
    // Send the generated password to the user's email
    const emailSubject = "Your Account Has Been Created";
    const emailText = `Hello ${userName},${role}\n\nYour account has been successfully created.\nYour login details are as follows:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password upon first login.\n\nBest regards,\n Getye Demil`;

    await sendEmail(email, emailSubject, emailText);  // Send the email

    res.status(201).json({ message: "Registered Successfully and email sent", password });  // Optionally include the password in the response for debugging
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error, not registered" });
  }
};

const updatePassword = async (req, res) => {
  
  const user_id = req.user.userId;
  const { password } = req.body; // Get the new status from the request body
  console.log("user id: ", user_id)
  console.log("password: ", password)
  const hashedpass = await bcrypt.hash(password, 10);
  console.log("hashed password: ", hashedpass)
  try {  
    // Call the model function to update the user status
    const updatedPasswored = await UserModel.updatePassword(user_id, hashedpass);

    if (!updatedPasswored) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Your Passwored is Updated Successfully'});
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { user_email} = req.params; // Get role_id from URL params

  try {
    await UserModel.deleteUser(user_email);

   res.status(201).json({ message: 'User deleted successfully' });
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const role = "Restaurant Register";
    const users = await UserModel.getAllAdmins(role);
    res.json(users.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

const addAdmin = async (req, res) => {
  const id = uuidv4();
  const { userName, email, phone, restaurant, location } = req.body;
  const password = generateRandomText(8);  // Generate random verification code
  const hashedpass = await bcrypt.hash(password, 10);
  const role = "Restaurant Register";
  const user_status = "Active";
  const user_profile = null;

  try {

    // Add the user with the admin's restaurant
    await UserModel.addAdmin(id, userName, email, hashedpass, phone, restaurant, role, location, user_profile, user_status);
    //add to the accounts table
    await UserModel.createAccount(id, email, hashedpass, role);
    // Send the generated password to the user's email
    const emailSubject = "Your Account Has Been Created";
    const emailText = `Hello ${userName}, ${role}\n\nYour account has been successfully created.\nYour login details are as follows:\n\nEmail: ${email}\n Verification code: ${password}\n\nPlease change your password upon first login.\n\nBest regards,\n Getye Demil`;

    await sendEmail(email, emailSubject, emailText);  // Send the email

    res.status(201).json({ message: "Registered Successfully and email sent", password });  // Optionally include the password in the response for debugging
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error, not registered" });
  }
};

const updateProfile = async (req, res) => {
  const user_id = req.user.userId;
  const picture = req.file ? req.file.filename : null;
  console.log("Recived Data: ", picture)
  
  try {
        
    await UserModel.updateProfile(user_id, picture);
    res.status(201).json({ message: "Profile Successfully Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error, ",err });
  }
}; 

module.exports = {
  signup,
  customerSignup,
  login,
  getAllUsers,
  updateUserStatus,
  addUser,
  updatePassword,
  deleteUser,
  getAllAdmins,
  addAdmin,
  updateProfile,
};
*/