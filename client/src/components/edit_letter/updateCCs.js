import React, { useState } from "react";
import { Typography, Button, Box, IconButton, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, Delete, Save } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UpdateCCs = ({ selectedCcs }) => {
  const [openCCs, setOpenCCs] = useState(false);
  const [ccs, setCcs] = useState([
    {
      names: selectedCcs?.cc?.ccs_name || [""],
      emails: selectedCcs?.cc?.ccs_email || [""],
    },
  ]);
  const [savedCcs, setSavedCcs] = useState([]);


  // Toggle visibility
  const handleReceiversOpen = () => {
    setOpenCCs(!openCCs);
  };

  // Handle input change for names
  const handleNameChange = (receiverIndex, nameIndex, value) => {
    const updatedCCs = [...ccs];
    updatedCCs[receiverIndex].names[nameIndex] = value;
    setCcs(updatedCCs);
  };

  // Handle input change for emails
  const handleEmailChange = (receiverIndex, emailIndex, value) => {
    const updatedCCs = [...ccs];
    updatedCCs[receiverIndex].emails[emailIndex] = value;
    setCcs(updatedCCs);
  };

 

  // Remove a specific name-email pair
  const handleRemovePair = (receiverIndex, pairIndex) => {
    const updatedReceivers = [...ccs];
    updatedReceivers[receiverIndex].names.splice(pairIndex, 1);
    updatedReceivers[receiverIndex].emails.splice(pairIndex, 1);
    setCcs(updatedReceivers);
  };

  // Add a new CC group
  const handleAddCCGroup = () => {
    setCcs([...ccs, { names: [""], emails: [""] }]);
  };

  const handleSave = () => {
    // Validate receiver data
    const isValid = ccs.every(
      (receiver) =>
        receiver.names.every((name) => name.trim() !== "") &&
        receiver.emails.every((email) => email.trim() !== "")
    );
  
    if (!isValid) {
      toast.error("Please fill in all receiver details.");
      return;
    }
  
    // Prepare a flattened request payload
    const payload = ccs.flatMap((receiver) =>
      receiver.names.map((name, index) => ({
        name,
        email: receiver.emails[index],
      }))
    );
  
    const id = selectedCcs.cc_id;
  
    // Send data to the backend
    fetch(`http://localhost:8001/api/ccs/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: payload.map(r => r.name), email: payload.map(r => r.email) }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save updated ccs.");
        }
        return {};
      })
      .then((data) => {
        console.log("Success:", data);
        toast.success("CC updated successfully!");
        setOpenCCs(false);
  
        // Update saved receivers
        setSavedCcs(
          ccs.flatMap((receiver) =>
            receiver.names.map((name, index) => ({
              name,
              email: receiver.emails[index],
            }))
          )
        );
  
        // Clear receivers after successful save
        setCcs([{ names: [""], emails: [""] }]);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to save receivers. Please try again.");
      });
  };

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
        <IconButton sx={{ fontSize: { xs: 12, sm: 18 } }}>
          CCs {openCCs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Typography>
      {openCCs && (
        <Box>
          {ccs.map((receiver, receiverIndex) => (
            <Box key={receiverIndex} sx={{ mb: 4 }}>
              {receiver.names.map((name, nameIndex) => (
                <Box
                  key={`name-email-${receiverIndex}-${nameIndex}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label={`Name ${nameIndex + 1}`}
                    value={name}
                    onChange={(e) =>
                      handleNameChange(receiverIndex, nameIndex, e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label={`Email ${nameIndex + 1}`}
                    value={receiver.emails[nameIndex]}
                    onChange={(e) =>
                      handleEmailChange(receiverIndex, nameIndex, e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    onClick={() => handleRemovePair(receiverIndex, nameIndex)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}

            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCCGroup}
              sx={{ mt: 1, textTransform: "none" }}
            >
              Add CC
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<Save />}
              sx={{ mt: 1, textTransform: "none" }}
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
