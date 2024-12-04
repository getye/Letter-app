const express = require('express');
const { 
        createUserHandler,
        login,
        getUsersHandler,
        getOfficesHandler,
        userStatusUpdateHandler,
        updateUserRoleHandler,
        deleteUserHandler,
        updatePasswordHandler,
     } = require('../controllers/UserController');

const protect = require('../middleware/auth');
const userRouter = express.Router();
const profile = require('../middleware/profile-images')

 
userRouter.post('/login', login);
userRouter.post('/create', protect, createUserHandler); 
userRouter.get('/view', protect, getUsersHandler); 
userRouter.put('/update/role/:user_id', protect, updateUserRoleHandler);
userRouter.put('/update/status/:user_id', protect, userStatusUpdateHandler);
userRouter.delete('/delete/:user_id', protect, deleteUserHandler);
userRouter.put('/update/password', protect, updatePasswordHandler);


module.exports = userRouter;

/*
userRouter.post('/customer/signup', UserController.customerSignup);
userRouter.post('/user/login', UserController.login);
userRouter.put('/user/update/password', protect, UserController.updatePassword);
userRouter.get('/admin/users', protect, UserController.getAllUsers);
userRouter.post('/admin/add/user', protect, UserController.addUser); 
userRouter.put('/admin/update/user/status/:user_email', UserController.updateUserStatus);
userRouter.delete('/admin/delete/user/:user_email', UserController.deleteUser);
userRouter.get('/superadmin/view/admins', UserController.getAllAdmins);
userRouter.post('/superadmin/add/admins', UserController.addAdmin);
userRouter.put('/users/update/profile', profile.single('picture'), protect, UserController.updateProfile);

*/


