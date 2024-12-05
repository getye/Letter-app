
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, } from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const RejectLetter = ({ open, onClose, selectedLetter }) => {
    const [ comment, setComment ] = useState('')

    const handleChange = (event) => {
        setComment(event.target.value); 
    }

    const handleSave = () => {
        const approvalData = { 
          status:"Rejected",
          comment: comment,
         };

         const token = localStorage.getItem('token');
         if (!token) {
           console.error('Error: No token');
           return;
         }

         const ref_no = selectedLetter;

          fetch(`http://localhost:8001/api/approvers/reject/${ref_no}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(approvalData),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
              toast.success("Letter Rejected!")
            })
            .catch((error) => {
              console.error("Error:", error);
              toast.error("Failed to approve.")
            });
          
      };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            <Typography>Reject This Letter, {selectedLetter}</Typography>
        </DialogTitle>    
        <DialogContent>
            <Box sx={{
                mt:1,
                }}>
                <TextField
                    fullWidth
                    label="Comment/Reason for rejection"
                    variant="outlined"
                    value={comment}
                    onChange={handleChange}
                    required
                />
            </Box>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleSave} sx={{ textTransform: 'none', color:'white', bgcolor: 'blue' }}>
            Save
        </Button>
        <Button onClick={onClose} sx={{ textTransform: 'none', color:'white', bgcolor: 'red' }}>
            Close
        </Button>
        </DialogActions>
    </Dialog>
  );
};
