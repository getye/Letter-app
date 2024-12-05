import React, { useEffect, useState } from "react";
import { Typography,  Button, Box, IconButton, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Add, Delete, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const AddNewReceivers = ({sendReceivers, submit}) => {
  
  const [openReceivers, setOpenReceivers] =useState(false)
  const [receivers, setReceivers] = useState([{ 
      receiver_name: "", 
      receiver_email: "" 
    }]);
  const [savedReceivers, setSavedReceivers] = useState([]);


  const handleReceiversOpen = () =>{
    setOpenReceivers(!openReceivers)
  }

// Handle receiver input change
  const handleReceiversInputChange = (index, field, value) => {
    const updatedReceivers = [...receivers];
    updatedReceivers[index][field] = value;
    setReceivers(updatedReceivers);
  };

    // Add a new receiver
  const handleAddReceiver = () => {
      setReceivers([...receivers, { receiver_name: "", receiver_email: "" }]);
    };
  
    // Remove a receiver
    const handleRemoveReceiver = (index) => {
      const updatedReceivers = receivers.filter((_, i) => i !== index);
      setReceivers(updatedReceivers);
    };

    const handleSave = () => {
      // Validate receiver data
      const isValid = receivers.every((receiver) => 
        receiver.receiver_name.trim() !== "" && receiver.receiver_email.trim() !== ""
      );
    
      if (!isValid) {
        toast.error("Please fill in all receiver details.");
        return;
      }
    
      // Prepare request payload
      const payload = {
        receivers: receivers.map((receiver) => ({
          name: receiver.receiver_name,
          email: receiver.receiver_email,
        })),
      };
    
      // Send data to the backend
      fetch("http://localhost:8001/api/receivers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save receivers.");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          toast.success("Receivers added successfully!");
          setOpenReceivers(false)

          //send receivers id to the parent component
          sendReceivers(data.data.id)

           // Update saved receivers 
          setSavedReceivers(data.data.names.map((name, index) => ({
            name,
            email: data.data.emails[index],
          })));

          // Clear receivers after successful save
          setReceivers([{ receiver_name: "", receiver_email: "" }]);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to save receivers. Please try again.");
        });
    };    

    useEffect(() => {
      if (submit) {
        setSavedReceivers([]);
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
            onClick={handleReceiversOpen}
            sx={{
              position: "absolute",
              top: "-22px", 
              left: 16, 
              background: "#fff", 
              px: 1, 
            }}
          >
            <IconButton sx={{fontSize:{xs:12, sm:18}}}>
              Receivers {openReceivers? (<ExpandLessIcon/>): (<ExpandMoreIcon/>)}
            </IconButton>
          </Typography>
            {openReceivers && (        
            <Box>    
              {receivers.map((receiver, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="Name"
                    value={receiver.receiver_name}
                    onChange={(e) => handleReceiversInputChange(index, "receiver_name", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Email"
                    value={receiver.receiver_email}
                    onChange={(e) => handleReceiversInputChange(index, "receiver_email", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => handleRemoveReceiver(index)} color="error">
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
                  onClick={handleAddReceiver}
                  sx={{ mt: 1, textTransform:'none' }}
                >
                  Add Receiver
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

            {/* Display saved receivers */}
            {savedReceivers.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {savedReceivers.map((receiver, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Typography variant="body1">{receiver.name}</Typography>
                    <Typography variant="body1">{receiver.email}</Typography>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
  );
};
