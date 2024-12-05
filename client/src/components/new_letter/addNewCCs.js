import React, { useEffect, useState } from "react";
import { Typography,  Button, Box, IconButton, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Add, Delete, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddNewCCs = ({sendCcs, submit}) => {

  const [openCcs, setOpenCcs] =useState(false)
  const [ccs, setCcs] = useState([{ cc_name: "", cc_email: "" }]);
  const [savedCcs, setSavedCcs] = useState([]);

  const handleCcsOpen = () =>{
    setOpenCcs(!openCcs)
  }

// Handle cc input change
  const handleCcsInputChange = (index, field, value) => {
    const updatedCcs = [...ccs];
    updatedCcs[index][field] = value;
    setCcs(updatedCcs);
  };

    // Add a new cc
    const handleAddCc = () => {
      setCcs([...ccs, { cc_name: "", cc_email: "" }]);
    };
  
    // Remove a cc
    const handleRemoveCc = (index) => {
      const updatedCcs = ccs.filter((_, i) => i !== index);
      setCcs(updatedCcs);
    };

    const handleSave = () => {
      // Validate receiver data
      const isValid = ccs.every((cc) => 
        cc.cc_name.trim() !== "" && cc.cc_email.trim() !== ""
      );
    
      if (!isValid) {
        toast.error("Please fill in all cc details.");
        return;
      }
    
      // Prepare request payload
      const payload = {
        ccs: ccs.map((cc) => ({
          name: cc.cc_name,
          email: cc.cc_email,
        })),
      };
    
      // Send data to the backend
      fetch("http://localhost:8001/api/ccs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save receivers. Please try again.");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          toast.success("CC added successfully!");
          setOpenCcs(false)

          //send ccs id to parent component
          sendCcs(data.data.id)
           // Update saved ccs 
          setSavedCcs(data.data.names.map((name, index) => ({
            name,
            email: data.data.emails[index],
          })));

          // Clear receivers after successful save
          setCcs([{ cc_name: "", cc_email: "" }]);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to save ccs.");
        });
    };

    useEffect(() => {
      if (submit) {
        setSavedCcs([]);
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
          onClick={handleCcsOpen}
          sx={{
            position: "absolute",
            top: "-22px", 
            left: 16, 
            background: "#fff", 
            px: 1, 
          }}
        >
          <IconButton sx={{fontSize:{xs:12, sm:18}}}>
            CCs {openCcs? (<ExpandLessIcon/>): (<ExpandMoreIcon/>)}
          </IconButton>
        </Typography>
          {openCcs && (        
          <Box>    
            {ccs.map((cc, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <TextField
                  label="Name"
                  value={ccs.cc_name}
                  onChange={(e) => handleCcsInputChange(index, "cc_name", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email"
                  value={ccs.cc_email}
                  onChange={(e) => handleCcsInputChange(index, "cc_email", e.target.value)}
                  fullWidth
                  size="small"
                />
                <IconButton onClick={() => handleRemoveCc(index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", 
                gap: 2,  
              }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddCc}
                sx={{ mt: 1, textTransform:'none' }}
              >
                Add CC
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<Save />}
                sx={{ mt: 1, textTransform:'none' }}
              >
                Save
              </Button>
            </Box>
          </Box>
              )}
            {/* Display saved CCs */}
            {savedCcs.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {savedCcs.map((cc, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Typography variant="body1">{cc.name}</Typography>
                    <Typography variant="body1">{cc.email}</Typography>
                  </Box>
                ))}
              </Box>
            )}
    </Box>
  );
};
