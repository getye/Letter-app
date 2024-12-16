import React, { useEffect, useState } from "react";
import { Typography,   Grid,  Button, Box, IconButton, TextField, Card, CardMedia, CardContent } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Save } from "@mui/icons-material";
import FileUploadIcon from '@mui/icons-material/FileUpload';


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ViewHeaders } from "./viewHeader";

export const AddNewHeader = ({sendSelectedHeader, submit}) => {

  const [openHeader, setOpenHeader] =useState(false)
  const [newHeaderOpen, setNewHeaderOpen] =useState(false)
  const [oldHeaderOpen, setOldHeaderOpen] =useState(false)
  const [header, setHeader] = useState({
    header_title: "",
    amharic_header: "",
    header_logo: null,
  });


  const [selected, setSelected] = useState([])

  const handleHeaderOpen = () =>{
    setOpenHeader(!openHeader)
  }
  const handleNewHeaderOpen = () =>{
    setNewHeaderOpen(!newHeaderOpen)
    setOldHeaderOpen(false)
  }
  const handleOldHeaderOpen = () =>{
    setOldHeaderOpen(!oldHeaderOpen)
    setNewHeaderOpen(false)
  }

  const handleHeaderChange = (field) => (event) => {
    if (field === "header_logo") {
      // Handle file upload
      const file = event.target.files[0]; // Get the uploaded file
      setHeader((prevState) => ({
        ...prevState,
        [field]: file,
      }));
    } else {
      // Handle text input
      setHeader((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("header_title", header.header_title);
    formData.append("header_logo", header.header_logo);
    
    if(header.header_title !== "" || header.header_logo !== null){
    fetch("http://localhost:8001/api/headers/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toast.success("Header added successfully!")
        setHeader({header_title: '', header_logo: null})
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to add header. Please try again.")
      });
    }else{
      toast.error("Header Title or Logo is empty")
    }
      
  };

  const handleSelectedHeader = (header) =>{
    sendSelectedHeader(header);
    setSelected(header)
    setOldHeaderOpen(false)
    setOpenHeader(false)
    toast.success("Header selected successfully!")
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
        p:2.4,
        mt: 3,
      }}
    >
      {/* Title on the Border */}
      <Typography
        variant="h6"
        onClick={handleHeaderOpen}
        sx={{
          position: "absolute",
          top: "-22px", 
          left: 16, 
          background: "#fff", 
          px: 1, 
        }}
      >
        <IconButton sx={{fontSize:{xs:12, sm:18}}}>
          Header {openHeader? (<ExpandLessIcon/>): (<ExpandMoreIcon/>)}
        </IconButton>
      </Typography>
        {openHeader && (
          <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", 
            gap: 2,  
          }}
        >
          <Button
            onClick={handleNewHeaderOpen}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Add New Header
          </Button>
          <Button
            onClick={handleOldHeaderOpen}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Select Header
          </Button>
        </Box>
        
        <Grid
          container
          spacing={2} 
          sx={{ padding: 1 }}
        >
          {/* New Header */}
          {newHeaderOpen && (
          <Grid item xs={12}>
              <TextField
                fullWidth
                label="Header Text in English"
                variant="outlined"
                size="small"
                required
                value={header.header_title}
                onChange={handleHeaderChange("header_title")}
                sx={{ mb: 2 }}
              /> 
              <TextField
                fullWidth
                label="የራስጌ ጽሑፍ በአማርኛ"
                variant="outlined"
                size="small"
                required
                value={header.header_title}
                onChange={handleHeaderChange("amharic_header")}
                sx={{ mb: 2 }}
              /> 

              {/* Upload Button */}
              <Button
                component="label"
                fullWidth
                startIcon={<FileUploadIcon />}
                sx={{
                  background: 'linear-gradient(to right, #728FCE, #36454F, #99A3A3)',
                  color:'white', fontWeight:'bold', mb: 2, textTransform: 'none' }}
              >
                {header.header_logo ? (header.header_logo.name) : ("Upload Logo")}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleHeaderChange('header_logo')}
                />
              </Button>
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
          {oldHeaderOpen && (
          <Grid item xs={12}>
            <ViewHeaders setSelectedHeader = {handleSelectedHeader}/>
          </Grid>
          )}
        </Grid>
        </>
        )}
        {selected && Object.keys(selected).length > 0 && (
          <Grid item xs={12} key={selected.header_id}> 
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CardMedia
                     component="img"
                      sx={{ width: 120, height: 120, borderRadius: '50%' }} // Make image circular and position it at the top
                      image={`http://localhost:8001/${selected.header_logo}`} 
                      alt={""}
                     />
                  <CardContent sx={{ textAlign: 'center' }}> {/* Center align text */}
                      <Typography variant="body1" sx={{fontWeight: 'bold'}}>{selected.header_title}</Typography>
       
                  </CardContent>
 
              </Card>
          </Grid>
        )}
    </Box>
  );
};
