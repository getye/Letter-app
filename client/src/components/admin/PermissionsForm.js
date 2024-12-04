import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Grid, Typography } from '@mui/material';

const PermissionsForm = ({ permissions, onPermissionChange }) => {
  return (
    <FormGroup>
      <Typography variant="h6">Permissions</Typography>
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <FormControlLabel
            control={<Checkbox checked={permissions["CreateRole"] || false} name="CreateRole" onChange={onPermissionChange} />}
            label="Create Roles"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["AddUser"] || false} name="AddUser" onChange={onPermissionChange} />}
            label="Add Users"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["CreateLetter"] || false} name="CreateLetter" onChange={onPermissionChange} />}
            label="Create Letter"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["EditLetter"] || false} name="EditLetter" onChange={onPermissionChange} />}
            label="Edit Letter"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={<Checkbox checked={permissions["DeleteLetter"] || false} name="DeleteLetter" onChange={onPermissionChange} />}
            label="Delete Letter"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["ViewLetter"] || false} name="ViewLetter" onChange={onPermissionChange} />}
            label="View Letter"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["CommentLetter"] || false} name="CommentLetter" onChange={onPermissionChange} />}
            label="Comment Letter"
          />
          <FormControlLabel
            control={<Checkbox checked={permissions["ApproveLetter"] || false} name="ApproveLetter" onChange={onPermissionChange} />}
            label="Approve Letter"
          />
        </Grid>
      </Grid>
    </FormGroup>
  );
};

export default PermissionsForm;
