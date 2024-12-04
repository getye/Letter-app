import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, CardMedia, Grid, Divider, CardActions, Button } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';

export const ViewHeaders = ({setSelectedHeader}) => {
  const [headers, setHeaders] = useState([]);

  // Fetch menu items when the component mounts
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/headers/view'); 
        const data = await response.json();
        setHeaders(data);
      } catch (error) {
        console.error('Error fetching header:', error);
      }
    };

    fetchHeaders();
  }, []);

  const handleSelectedHeader = (header) =>{
    setSelectedHeader(header)
  }


  return (
      <Grid container spacing={3}> 
        {headers.map((header) => (
          <Grid item xs={12} key={header.header_id}> 
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120, borderRadius: '50%' }} // Make image circular and position it at the top
                image={`http://localhost:8001/${header.header_logo}`} 
                alt={"logo"}
              />
              <CardContent sx={{ textAlign: 'center' }}> {/* Center align text */}
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>{header.header_title}</Typography>

                <Divider sx={{mt:1}}/>
              </CardContent>
              <CardActions>
                <Button
                    endIcon={<DoneIcon/>}
                    onClick={() => handleSelectedHeader(header)} 
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
