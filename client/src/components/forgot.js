import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
   } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

   
   export const Forgot =() =>{
    return (
    <Grid container  sx={{paddingTop: 10, maxWidth:2/3, alignItems:'center', 
                          alignContent:'center', paddingLeft:15}}>
      <Grid item xs={6} sx={{bgcolor:'lightblue', height:200, display: 'flex', 
                              alignContent:'center', justifyContent: 'center' }} >
      
        <MenuBookIcon sx={{width: 150, height: 150, mt:3}}/>

      </Grid>
     <Grid item xs={6} sx={{paddingLeft:0}}> 
       <Box sx={{paddingLeft:6}}>
       <Typography component="h1" variant="h5">
         Forgot Password
        </Typography>
        <Box component="form">
         <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                size='small'
                label="Email Address"
                name="email"        
                autoFocus
                />
         <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              >
              Send
         </Button>
         
        </Box>
       </Box>
  
      </Grid>
     </Grid>
    );
   }