
import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Snackbar, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import OfficeTable from './OfficeTable';

export const AddOffice = () => {
  const [open, setOpen] = useState(false);
  const [officeData, setOfficeData] = useState({ name: '', writer: '', head: '', manager: '', type: ''});
  const [users, setUsers] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');



  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
        console.log('Error: No token');
      }
      const response = await fetch('http://localhost:8001/api/users/view', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
  
      const data = await response.json();
  
      setUsers(data); // Set the users data to state
    } catch (err) {
      console.log(err.message); // Handle error
    } 
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);
const handleOpen = () => {
    setOpen(true);
  };

const handleClose = () => {
    setOpen(false);
  };

const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOfficeData({ ...officeData, [name]: value });
  };



const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
          console.log('Error: No token');
        }
      const response = await fetch(`http://localhost:8001/api/offices/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify(officeData),
      });

      if (response.status === 201) {
        setNotificationMessage('Successfully registered');
        setShowNotification(true);
        setOfficeData({ name: '', writer: '', head: '', manager: '', type:'' }); // Reset form
      } else {
        setNotificationMessage('Error in registration');
        setShowNotification(true);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data.message;
        setNotificationMessage(errorMessage);
        setShowNotification(true);
      } else {
        setNotificationMessage('An unexpected error occurred');
        setShowNotification(true);
        console.error(err);
      }
    }
  };

  return (
    <Box sx={{ paddingTop: 2, justifyContent: 'center',
      ml: {xs: '5%', sm: '10%', md: '15%', lg: '20%'},
      mr: {xs: '1%', sm: '3%', md: '5%', lg: '7%'},
      mb: {xs: 1, sm: 2, md: 3, lg: 4},

    }}>
      <OfficeTable handleOpen={handleOpen} />

      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Add Office</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Office Name"
            name='name'
            type="text"
            size='small'
            fullWidth
            value={officeData.name}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="type">Select office type</InputLabel>
            <Select
              labelId="type"
              name="type"
              id="type"
              label="Select office type"
              size='small'
              onChange={handleInputChange}
              sx={{paddingBottom:1}}
            >
              <MenuItem value="Department">Department</MenuItem>
              <MenuItem value="Management">Management</MenuItem>
              <MenuItem value="Executive">Executive</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="writer">Select Writer</InputLabel>
            <Select
              labelId="writer"
              name="writer"
              id="writer"
              label="Select Writer"
              size='small'
              value={officeData.writer}
              onChange={handleInputChange}
              sx={{paddingBottom:1}}
            >
              {
              users.length > 0 ? (
                users.some((user) => user.user_role === "Writer") ? ( // Check if there is at least one writer
                  users
                    .filter((user) => user.user_role === "Writer") // Filter only "Writer" roles
                    .map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {user.user_name}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem value="">No Writer available</MenuItem>
                )
              ) : (
                <MenuItem value="">No users available</MenuItem> // Handle case where no users exist at all
              )
            }

            </Select>
          </FormControl>

          {officeData.type === "Department" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="head">Select Head</InputLabel>
            <Select
              labelId="haed"
              name="head"
              id="haed"
              label="Select Head"
              size='small'
              value={officeData.haed}
              onChange={handleInputChange}
              sx={{paddingBottom:1}}
            >
              {
              users.length > 0 ? (
                users.some((user) => user.user_role === "Head") ? ( // Check if there is at least one writer
                  users
                    .filter((user) => user.user_role === "Head") // Filter only "Writer" roles
                    .map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {user.user_name}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem value="">No Head available</MenuItem>
                )
              ) : (
                <MenuItem value="">No users available</MenuItem> // Handle case where no users exist at all
              )
            }

            </Select>
          </FormControl>
            )}

          <FormControl fullWidth margin="dense">
            <InputLabel id="manager">Select Manager</InputLabel>
            <Select
              labelId="manager"
              name="manager"
              id="manager"
              label="Select Manager"
              size='small'
              value={officeData.manager}
              onChange={handleInputChange}
              sx={{paddingBottom:1}}
            >
              {
              users.length > 0 ? (
                users.some((user) => user.user_role === "Manager") ? ( // Check if there is at least one writer
                  users
                    .filter((user) => user.user_role === "Manager") // Filter only "Writer" roles
                    .map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {user.user_name}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem value="">No Manager available</MenuItem>
                )
              ) : (
                <MenuItem value="">No users available</MenuItem> // Handle case where no users exist at all
              )
            }

            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleSubmit} sx={{ bgcolor: '#357EC7', color: 'white', fontWeight:'bold', textTransform: 'none' }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showNotification}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        >
        <Alert
            onClose={() => setShowNotification(false)}
            severity={String(notificationMessage).includes('Successfully registered') ? 'success' : 'error'}
            sx={{ width: '100%' }}
        >
            {notificationMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};
