

import { Grid, Typography } from '@mui/material'; 


import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
  
   
export const Home =() =>{




return (
    <>
    <Grid 
        container 
        sx={{
            pl: {xs: '1%', sm: '2%', md: '3%', lg: '5%'},
        }}
        >
      <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography 
          sx={{
            background: 'linear-gradient(to right, #0080ff, #00bfff)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: {xs: '1.5rem', sm: '3rem', md: '5rem', lg: '7rem'},
            fontWeight: 'bold',
          }}
        >
          Letter App
        </Typography>
      </Grid>
    </Grid>
    </>
    );
   }