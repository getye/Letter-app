import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormGroup, FormControlLabel, Checkbox, Grid } from '@mui/material';

const UpdateRoleModal = ({ open, role, onClose, onSubmit }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({ 
        CreateRole: false, 
        AddUser: false,
        CreateLetter: false,
        EditLetter: false,
        DeleteLetter: false,
        ViewLetter: false,
        CommentLetter: false,
        ApproveLetter: false,
      });

  useEffect(() => {
    if (role) {
      setRoleName(role.role_name);
      setPermissions(role.permissions || '{}'); // Initialize permissions if provided
    }
  }, [role]);

  const handlePermissionChange = (e) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  const handleSubmit = () => {
    const updatedRole = {
      ...role,
      role_name: roleName,
      permissions: JSON.stringify(permissions),
    };
    onSubmit(updatedRole);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Update Role</DialogTitle>
      <DialogContent>
        <TextField
          label="Role Name"
          fullWidth
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          margin="normal"
        />
        <FormGroup>
            <Grid container spacing={5}>
             <Grid item xs={12} sm={5}>
                <FormControlLabel
                    control={<Checkbox checked={permissions.CreateRole} onChange={handlePermissionChange} name="CreateRole" />}
                    label="Create Role"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.AddUser} onChange={handlePermissionChange} name="AddUser" />}
                    label="Add User"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.CreateLetter} onChange={handlePermissionChange} name="CreateLetter" />}
                    label="Create Letter"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.EditLetter} onChange={handlePermissionChange} name="EditLetter" />}
                    label="Edit Letter"
                    />
            </Grid>
            <Grid item xs={12} sm={5}>
                <FormControlLabel
                    control={<Checkbox checked={permissions.DeleteLetter} onChange={handlePermissionChange} name="DeleteLetter" />}
                    label="Delete Letter"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.ViewLetter} onChange={handlePermissionChange} name="ViewLetter" />}
                    label="View Letter"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.CommentLetter} onChange={handlePermissionChange} name="CommentLetter" />}
                    label="Comment Letter"
                    />
                <FormControlLabel
                    control={<Checkbox checked={permissions.ApproveLetter} onChange={handlePermissionChange} name="ApproveLetter" />}
                    label="Approve Letter"
                    />
            </Grid>
            </Grid>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={handleSubmit} sx={{ bgcolor: '#FF8C00', color: 'white', textTransform: 'none' }}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRoleModal;
