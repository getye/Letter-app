import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Grid, Box, Typography, TextField, Button, FormControlLabel, Checkbox, Divider } from '@mui/material';

export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const formdata = { password: password, user_email: email };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userRole', responseData.user_role);
        const permissions = JSON.parse(responseData.permissions);
        localStorage.setItem('permissions', permissions);
        localStorage.setItem('email', responseData.user_email);

      

        if (permissions.includes('CreateRole' || 'AddUser')) {
          navigate('/admin/roles');
        }else if (permissions.includes('ApproveLetter')) {
          navigate('/letters');
        }else if (permissions.includes('CreateLetter')) {
          navigate('/letters');
        }else if (permissions.includes('ViewLetter')) {
          navigate('/received-letters');
        } else {
          navigate('/');
        } 

        console.log('Successfully signed in as ' + responseData.user_role);
      } else {
        // Handle error response
        setNotificationMessage('Wrong email or password'); // Set the error message
        setShowNotification(true); // Show the notification
        console.log('Error:', response.error);
        
      }
    } catch (error) {
      // Handle fetch error
      setNotificationMessage('An error occurred. Please try again.'); // Set a generic error message
      setShowNotification(true); // Show the notification
      console.log('Error:', error);
    }
  };

  return (
    <Box component={'form'} onSubmit={handleSubmit}>
      <Grid
        container
        sx={{
          width: { xs: '100%', sm: '80%', md: '60%' },
          ml: { xs: '1%', sm: '3%', md: '5%' },
          mt:2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} sm={8} sx={{ paddingLeft: 0 }}>
          <Box sx={{ paddingLeft: 1, maxWidth: { sm: '80%' } }}>
            <Typography component="h1" variant="h5" sx={{ paddingTop: 2 }}>
              Login
            </Typography>
            <Divider fullWidth />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              size="small"
              label="Email Address"
              name="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              size="small"
              id="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                bgcolor: '#357EC7',
                paddingTop: 1,
                borderRadius: 2,
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#357EC7',
                  opacity: 0.9,
                },
              }}
            >
              Login
            </Button>
            <Grid className="footer"></Grid>
          </Box>
        </Grid>
      </Grid>


      {/* Snackbar for notifications */}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity={notificationMessage.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};