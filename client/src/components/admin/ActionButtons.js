import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionButtons = ({ user, onNotify }) => {
  const [userStatus, setUserStatus] = useState(user.user_status);
  const [roles, setRoles] = useState([]); // List of roles
  const [selectedRole, setSelectedRole] = useState(user.user_role);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  
const handleStatusChange = async () => {
    const newStatus = userStatus === 'Active' ? 'Inactive' : 'Active';
    setUserStatus(newStatus);

    const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
        console.log('Error: No token');
      }

    try {
      const response = await fetch(`http://localhost:8001/api/users/update/status/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token

        },
        body: JSON.stringify({ user_status: newStatus }),
      });

      if (response.ok) {
        onNotify('User Status Updated Successfully', 'Success');
      } else {
        onNotify(`Error: ${response.statusText}`);
      }
    } catch (err) {
      onNotify('Error occurred while updating user status', 'Error');
      console.error(err);
    }
  };

const handleUpdate = async () => {
    
    const token = localStorage.getItem('token'); // Retrieve the token from storage
      
    if(!token){
        console.log('Error: No token');
      }
      
  
    try {
      const response = await fetch(`http://localhost:8001/api/users/update/role/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ user_role: selectedRole }),
      });
      console.log(response)
      if (response.ok) {
        onNotify('User Role Updated Successfully', 'Success');
      } else {

        onNotify(`Error: ${response.statusText}`);
      }
    } catch (err) {
      onNotify('Error occurred while updating user role', 'Error');
      console.error(err);
    }
  };

const handleDelete = async () => {

    const token = localStorage.getItem('token'); // Retrieve the token from storage
      
    if(!token){
        console.log('Error: No token');
      }
    if (!window.confirm(`Are you sure you want to delete : ${user.user_name}?`)) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8001/api/users/delete/${user.user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
      });
      console.log(response)
      if (response.ok) {
        onNotify('User Deleted Successfully', 'Success');
      } else {

        onNotify(`Error: ${response.statusText}`);
      }
    } catch (err) {
      onNotify('Error occurred while deleting user', 'Error');
      console.error(err);
    }
  };

   // Fetch roles for Selecting role on the add from 
   useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from storage
      
        if(!token){
            console.log('Error: No token');
          }
        const response = await fetch('http://localhost:8001/api/roles/view', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token
          },
        });
        const data = await response.json();
        console.log(data);
        setRoles(data); // Store the roles in state
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <>
    <Box>
      {userStatus === 'Active' ? (
        <Tooltip title="Block User">
          <IconButton
            onClick={handleStatusChange}
            sx={{ width: '80px', height: '20px', borderRadius: '20px', color: 'green', bgcolor: '#B4CFEC', fontSize: '12px', paddingLeft: 2, paddingRight: 2 }}
          >
            {userStatus}
            <ToggleOnIcon sx={{ color: 'green' }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Unblock User">
          <IconButton
            onClick={handleStatusChange}
            sx={{ width: '80px', height: '20px', borderRadius: '20px', color: 'red', bgcolor: '#FAEBD7', fontSize: '12px', paddingLeft: 2, paddingRight: 2 }}
          >
            {userStatus}
            <ToggleOffIcon sx={{ color: 'red' }} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Update User Role">
            <IconButton onClick={handleModalOpen}>
              <VisibilityIcon />
            </IconButton>
      </Tooltip>
      <Tooltip title="Delete User">
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>

      <Dialog
          open={isModalOpen}
          onClose={handleModalClose}
          aria-labelledby="update-user-role-modal"
          aria-describedby="modal-to-update-user-role"
        >
          <DialogTitle sx={{ textAlign: 'center' }}>Update User Role</DialogTitle>
          <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="userName"
            label="User Name"
            type="text"
            size='small'
            fullWidth
            readonly
            value={user.user_name}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          size='small'
          fullWidth
          readonly
          value={user.user_email}
        />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              name="newRole"
              id="role-select"
              label="Select Role"
              size='small'
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{paddingBottom:1}}
            >
              {
                roles.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_name}>
                    {role.role_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
                onClick={handleModalClose}
                sx={{
                  bgcolor: 'red',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'red',
                    opacity: 0.9,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                sx={{
                  bgcolor: '#357EC7',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#357EC7',
                    opacity: 0.9,
                  },
                }}
              >
                Update
              </Button>
            </Box>
   
          </DialogContent>
      </Dialog>

    </>
  );
};

export default ActionButtons;
