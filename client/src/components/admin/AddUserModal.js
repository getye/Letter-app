import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { z } from 'zod';

// Zod schema for validation
const userSchema = z.object({
  userName: z.string().min(1, "User Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't exceed 15 digits")
    .regex(/^\+?[0-9]+$/, "Phone number should only contain digits and can start with +"),
  role: z.string().min(1, "Role is required"),
});

export const AddUserModal = ({ open, handleClose, newUser, handleInputChange, handleSubmit }) => {
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

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
        setRoles(data); // Store the roles in state
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Validation handler
  const validateForm = () => {
    try {
      userSchema.parse(newUser); // Zod will throw an error if validation fails
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Map Zod errors to form errors
        const formErrors = e.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(formErrors);
      }
      return false;
    }
  };

  // Submit handler
  const handleFormSubmit = () => {
    if (validateForm()) {
      handleSubmit(); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="userName"
          label="User Name"
          type="text"
          size='small'
          fullWidth
          value={newUser.userName}
          onChange={handleInputChange}
          error={!!errors.userName}
          helperText={errors.userName}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          size='small'
          fullWidth
          value={newUser.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          type="text" 
          size='small'
          fullWidth
          value={newUser.phone}
          onChange={handleInputChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <FormControl fullWidth margin="dense" error={!!errors.role}>
          <InputLabel id="role-label">Select Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            id="role-select"
            label="Select Role"
            size='small'
            value={newUser.role || ''}
            onChange={handleInputChange}
            sx={{paddingBottom:1}}
          >
            {roles.length > 0 ? (
              roles.map((role) => (
                <MenuItem key={role.role_id} value={role.role_name}>
                  {role.role_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No roles available</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
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
          onClick={handleFormSubmit}
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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
