import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';  // Hamburger icon for mobile
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Divider, MenuItem, Link, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Profile } from './profile';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';


import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';


const Footer = ({open, handleClose, handleOpen}) => (

  <Box 
    sx={{ 
      textAlign: 'center', 
      backgroundColor: '#E5E4E2', 
      color:'black',
      zIndex: 1000,
      position: { lg: 'fixed', md:'fixed', sm: 'fixed', xs: 'relative' },
      mt: { xs: 'auto' },
      bottom: 0, 
      left: 0, 
      right: 0,
    }}
  >
    <Stack 
      direction={'row'}
      spacing={2} 
      justifyContent="space-between" 
      alignItems="center" 
      sx={{ pl:{md:5, sm:3, xs:1}, width: '100%', maxWidth: 'lg', mx: 'auto' }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} QMT. All rights reserved.
        </Typography>
        <Link 
          href="/terms" 
          sx={{ 
            mx: 1, 
            textDecoration: 'none',  
            fontWeight: 'bold',  
            '&:hover': {
              textDecoration: 'none',  
              color: 'secondary.main',  
            },
          }}>
          Terms and Conditions
        </Link>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
      <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <FacebookIcon />
      </Link>
      <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
        <LinkedInIcon />
      </Link>
      <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <TwitterIcon />
      </Link>
      <Link href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
        <YouTubeIcon />
      </Link>
    </Box>
    </Stack>
  </Box>
);


export const MainBar = (props) => {
  const userRole = localStorage.getItem('userRole');
  const permissions = localStorage.getItem('permissions');

  const navigate = useNavigate();
  const { window } = props;
  // State to control the mobile drawer
  const [open, setOpen] = React.useState(false);
  const [isCollapsed, setCollapsed] = React.useState(false);

  const theme = useTheme();

  const toggleDrawer = () => {
      setCollapsed(!isCollapsed);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/')
  };

  const navWidth = 240
  const drawer = (
    <List sx={{ height:'auto', backgroundColor: '#E5E4E2' }}>
      {(isCollapsed )? (
          <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{marginLeft:1}}>
              <MenuIcon/>
          </IconButton> 
        ):(
        <>
        <Stack justifyContent={'space-between'} padding={1} direction="row" gap={3}>
          <Stack direction="row" gap={2}>
            <Typography variant="h6">Letter</Typography>
          </Stack>
            <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{marginLeft:1}}>
                  <MenuIcon />
            </IconButton>     
        </Stack>
        <Divider />


        <ListItem disablePadding onClick={() => { navigate("/dashboard") }}>
              <ListItemButton>
                <ListItemIcon>
                  <SpaceDashboardOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
        
          <>
          {permissions && permissions.includes('CreateRole') && (
            <>
            <ListItem disablePadding onClick={() => { navigate("/admin/roles") }}>
              <ListItemButton >
                <ListItemIcon>
                  <Person2OutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Roles" />
              </ListItemButton>
            </ListItem>
            </>
          )}
          {permissions && permissions.includes('AddUser') && (
            <>
            <ListItem disablePadding onClick={() => { navigate("/admin/users") }}>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem> 
            <ListItem disablePadding onClick={() => { navigate("/admin/offices") }}>
              <ListItemButton>
                <ListItemIcon>
                  <MeetingRoomIcon />
                </ListItemIcon>
                <ListItemText primary="Offices" />
              </ListItemButton>
            </ListItem>
            </>
          )}
            
          {permissions && permissions.includes( 'ApproveLetter' ) && (
            <>

            <ListItem disablePadding onClick={() => { navigate("/letters") }}>
              <ListItemButton>
                <ListItemIcon>
                  <MailOutlineIcon/>
                </ListItemIcon>
                <ListItemText primary="Letters" />
              </ListItemButton>
            </ListItem>
            </>
          )}

        {permissions && permissions.includes( 'CreateLetter') && (
            <>

            <ListItem disablePadding onClick={() => { navigate("/letters") }}>
              <ListItemButton>
                <ListItemIcon>
                  <MailOutlineIcon/>
                </ListItemIcon>
                <ListItemText primary="Letters" />
              </ListItemButton>
            </ListItem>
            </>
            )}
            
            {permissions && permissions.includes('CreateLetter') && (
            <ListItem disablePadding onClick={() => { navigate("new-letter") }}>
              <ListItemButton>
                <ListItemIcon>
                  <MailOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="New Letter" />
              </ListItemButton>
            </ListItem>
            )}
          {permissions && permissions.includes('ViewLetter') && (
          <ListItem disablePadding onClick={() => { navigate("received-letters") }}>
              <ListItemButton>
                <ListItemIcon>
                  <ForwardToInboxIcon />
                </ListItemIcon>
                <ListItemText primary="Received Letters" />
              </ListItemButton>
          </ListItem>
          )}
          </>

        <Divider/>
          <ListItem disablePadding onClick={ handleSignOut } sx={{paddingTop:2}}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutOutlinedIcon sx={{color:'red'}}/>
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{color:'red'}}/>
              </ListItemButton>
          </ListItem>
          <Divider sx={{marginTop:1}}/>
        </>
      ) }
              
    </List>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: '56px' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#E5E4E2', color: 'black'}}>

          {(!userRole) ? (
          <Toolbar sx={{ justifyContent: 'flex-end', flexDirection: 'row'}}>
              <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
              <MenuItem onClick={() => navigate('/signin')}>Login</MenuItem>
          </Toolbar>
          ) : (
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
                <Profile role={userRole}/>
            </Toolbar>
          )}
        
      </AppBar>
      {(userRole) && (
        <Box component="nav" 
            sx={{ 
              width: navWidth,
            }} 
              aria-label="mailbox folders">
            
            {(isSmall)? (
                  <>
                  {/* Drawer for mobile */}
                  <Drawer
                         container={container}
                         variant="persistent"
                         open
                         sx={{
                          width: isCollapsed ? '50px' : '180px', 
                          height:'auto', 
                          transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                          }),
                          '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: isCollapsed ? '50px' : '180px',
                            height:'auto'
                          },
                         }}
                       >
                         {drawer}
                    </Drawer>
                  </>
                  ):(
                    <>
                  {/* Permanent Drawer for desktop */}
                  <Drawer
                      variant="persistent"
                      open
                      sx={{
                        width: isCollapsed ? '60px' : navWidth, 
                        height:'auto',  
                        transition: theme.transitions.create('width', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                        }),
                        '& .MuiDrawer-paper': {
                          boxSizing: 'border-box',
                          width: isCollapsed ? '60px' : navWidth,
                          height:'auto', 
                        },
                      }}
                      >
                  {drawer}
                </Drawer>
                </>
                  )}
 
        </Box>
      )}
      <Box sx={{ flexGrow: 1, position: 'relative'}} />
        {!( isSmall ) && (
          <Footer open={open} handleClose={handleClose} handleOpen={handleOpen}/>
        )}
    </Box>
  );
};

MainBar.propTypes = {
  window: PropTypes.func,
};