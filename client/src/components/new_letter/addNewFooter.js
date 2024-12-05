import React, { useEffect, useState } from "react";
import { Typography,   Grid,  Button, Box, IconButton, TextField, Card, CardContent, Divider } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ViewFooters } from "./viewFooter";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';


export const AddNewFooter = ({sendSelectedFooter, submit}) => {

  const [openFooter, setOpenFooter] =useState(false)
  const [newFooterOpen, setNewFooterOpen] =useState(false)
  const [oldFooterOpen, setOldFooterOpen] =useState(false)
  const [footer, setFooter] = useState({
    phone: "",
    email: "",
    pobox: "",
    address: "",
    slogan: "",
    website: "",
  });
  const [selected, setSelected] = useState([])

  const handleFooterOpen = () =>{
    setOpenFooter(!openFooter)
  }
  const handleNewFooterOpen = () =>{
    setNewFooterOpen(!newFooterOpen)
    setOldFooterOpen(false)
  }
  const handleOldFooterOpen = () =>{
    setOldFooterOpen(!oldFooterOpen)
    setNewFooterOpen(false)
  }

  const handleFooterChange = (field) => (event) => {
    setFooter({
      ...footer,
      [field]: event.target.value,
    });
  };

  const handleSave = () => {
    const footerData = { 
      phone: footer.phone, 
      email: footer.email,
      address: footer.address,
      pobox: footer.pobox,
      slogan: footer.slogan,
      website: footer.website,
     };

    if(footer.phone !=="" || footer.email !== ""){
      fetch("http://localhost:8001/api/footers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(footerData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          toast.success("Footer added successfully!")
          setFooter({
            phone: "",
            email: "",
            pobox: "",
            address: "",
            slogan: "",
            website: "",
          })
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to add footer.")
        });
      }else{
        toast.error("Phone number or email is empty")
      }
      
  };

  const handleSelectedFooter = (footer) => {
    sendSelectedFooter(footer);
    setSelected(footer)
    setOldFooterOpen(false)
    setOpenFooter(false)
    toast.success("Footer selected successfully!")
  }

  useEffect(() => {
    if (submit) {
      setSelected([]);
    }
  }, [submit]);
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 2.4,
        mt: 4,
      }}
    >
      {/* Title on the Border */}
      <Typography
        variant="h6"
        onClick={handleFooterOpen}
        sx={{
          position: "absolute",
          top: "-22px", 
          left: 16, 
          background: "#fff", 
          px: 1, 
        }}
      >
        <IconButton sx={{fontSize:{xs:12, sm:18}}}>
          Footer {openFooter? (<ExpandLessIcon/>): (<ExpandMoreIcon/>)}
        </IconButton>
      </Typography>
        {openFooter && (
          <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", 
            gap: 2,  
          }}
        >
          <Button
            onClick={handleNewFooterOpen}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            New Footer
          </Button>
          <Button
            onClick={handleOldFooterOpen}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Existing Footer
          </Button>
        </Box>
        
        <Grid
          container
          spacing={2} 
          sx={{ padding: 2 }}
        >
          {/* New Header */}
          {newFooterOpen && (
          <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                size="small"
                required
                value={footer.phone}
                onChange={handleFooterChange("phone")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                size="small"
                required
                value={footer.email}
                onChange={handleFooterChange("email")}
                sx={{ mb: 2 }}
              />  
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                size="small"
                value={footer.address}
                onChange={handleFooterChange("address")}
                sx={{ mb: 2 }}
              /> 
              <TextField
                fullWidth
                label="Po. Box"
                variant="outlined"
                size="small"
                value={footer.pobox}
                onChange={handleFooterChange("pobox")}
                sx={{ mb: 2 }}
              /> 
              <TextField
                fullWidth
                label="Slogan"
                variant="outlined"
                size="small"
                value={footer.slogan}
                onChange={handleFooterChange("slogan")}
                sx={{ mb: 2 }}
              /> 
              <TextField
                fullWidth
                label="Website"
                variant="outlined"
                size="small"
                value={footer.website}
                onChange={handleFooterChange("website")}
                sx={{ mb: 2 }}
              /> 
              <Button 
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#357EC7', 
                  color: 'white', 
                  fontWeight:'bold', 
                  ml:'40%',
                  mr:'50%',
                  textTransform: 'none' 
                  }}>Save</Button>
          </Grid>
          )}

          {/* Select an existing header*/}
          {oldFooterOpen && (
          <Grid item xs={12}>
            <ViewFooters setSelectedFooter={handleSelectedFooter}/>
          </Grid>
          )}
        </Grid>
        </>
        )}
        {selected && Object.keys(selected).length > 0 && (
          <Grid item xs={12} key={selected.footer_id}> 
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}> {/* Center align text */}
                <Divider sx={{mb:1, width:'100%'}}/>
                <Typography 
                    variant="body2" 
                    sx={{display: 'inline', mx: 1 }}>
                      {selected.phone && <PhoneIcon/>} {selected.phone}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {selected.email && <EmailIcon/>} {selected.email}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {selected.address && <LocationOnIcon/>} {selected.address}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ display: 'inline', mx: 1 }}>
                      {selected.website && <LanguageIcon/>} {selected.website}
                </Typography>
                <Typography variant="body2">
                       {selected.slogan}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
    </Box>
  );
};
