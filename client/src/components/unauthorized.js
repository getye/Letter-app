import { Box, Typography } from '@mui/material';
import React from 'react';

export const Unauthorized = () => {
  return (
    <Box sx={{mt:8, ml:35}}>
      <Typography variant='h5' sx={{color:'red'}}>Unauthorized Access</Typography>
      <Typography variant='body1'>You do not have permission to view this page.</Typography>
    </Box>
  );
};


