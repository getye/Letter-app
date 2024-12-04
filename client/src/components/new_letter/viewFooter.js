import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid, Divider, CardActions, Button } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

export const ViewFooters = ({setSelectedFooter}) => {
  const [footers, setFooters] = useState([]);

  // Fetch menu items when the component mounts
  useEffect(() => {
    const fetchFooters = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/footers/view'); 
        const data = await response.json();
        console.log('Footers :', data);
        setFooters(data);
      } catch (error) {
        console.error('Error fetching footer:', error);
      }
    };

    fetchFooters();
  }, []);

  const handleSelectedFooter = (footer) =>{
    setSelectedFooter(footer)
  }


  return (
      <Grid container spacing={3}> 
        {footers.map((footer) => (
          <Grid item xs={12} key={footer.footer_id}> 
            <Card sx={{ display: 'flex', flexDirection: 'column', width:'100%', alignItems: 'center', marginBottom: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}> {/* Center align text */}
                <Divider sx={{mb:1, width:'100%'}}/>
                <Typography 
                    variant="body2" 
                    sx={{display: 'inline', mx: 1 }}>
                      {footer.phone && <PhoneIcon/>} {footer.phone}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {footer.email && <EmailIcon/>} {footer.email}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {footer.address && <LocationOnIcon/>} {footer.address}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {footer.website && <LanguageIcon/>} {footer.website}
                </Typography>
                <Typography 
                    variant="body2" 
                    >
                       {footer.slogan}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                    endIcon={<DoneIcon/>}
                    onClick={() => handleSelectedFooter(footer)} 
                    sx={{ color: 'blue', fontWeight: 'bold', marginLeft: 1, pl: 2, pr: 2, borderRadius: 2, textTransform: 'none' }}
                    >
                    Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
  );
};
