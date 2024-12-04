import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

const UpdateOfficeModal = ({ open, office, onClose, onSubmit }) => {
  const [office_name, setOfficeName] = useState(office.office_name);
  const [writer, setWriter] = useState(office.writer);
  const [head, setHead] = useState(office.head);
  const [manager, setManager] = useState(office.manager);
  const [users, setUsers] = useState([]);


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


  const handleSubmit = () => {
    const updatedOffice = {
      ...office,
      office_name: office_name,
      writer: writer,
      head: head,
      manager: manager,
    };
    onSubmit(updatedOffice);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Update Office</DialogTitle>
      <DialogContent>
        <TextField
          label="Office Name"
          fullWidth
          size='small'
          value={office_name}
          onChange={(e) => setOfficeName(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="writer">Select Writer</InputLabel>
          <Select
            labelId="writer"
            name="writer"
            id="writer"
            label="Select Writer"
            size='small'
            value={writer}
            onChange= {(e) => setWriter(e.target.value)}
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

        <FormControl fullWidth margin="dense">
          <InputLabel id="head">Select Head</InputLabel>
          <Select
            labelId="haed"
            name="head"
            id="haed"
            label="Select Head"
            size='small'
            value={head}
            onChange= {(e) => setHead(e.target.value)}
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

        <FormControl fullWidth margin="dense">
          <InputLabel id="manager">Select Manager</InputLabel>
          <Select
            labelId="manager"
            name="manager"
            id="manager"
            label="Select Manager"
            size='small'
            value={manager}
            onChange= {(e) => setManager(e.target.value)}
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
        <Button onClick={onClose} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={handleSubmit} sx={{ bgcolor: '#357EC7', color: 'white', textTransform: 'none' }}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateOfficeModal;
