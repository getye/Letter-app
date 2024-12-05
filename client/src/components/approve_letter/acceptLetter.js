
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SendIcon from '@mui/icons-material/Send';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';


export const AcceptLetter = ({ open, onClose, selectedLetter }) => {
  const [archaive, setArchaive] = useState({
    status: "",
    remark: "",
  })
  const [approve, setApprove] = useState({
    status: "",
    remark: "",
  })
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    if (role === "Head") {
      setArchaive({
        status: "Archived",
        remark: "Approved by department",
      });
      setApprove({
        status: "Pending for managing approval",
        remark: "Approved by department",
      });
    } else if (role === "Manager") {
      setArchaive({
        status: "Archived",
        remark: "Approved by managing",
      });
      setApprove({
        status: "Pending for executive approval",
        remark: "Approved by managing",
      });
    } else if (role === "Executive") {
      setArchaive({
        status: "Archived",
        remark: "Approved by executive",
      });
      setApprove({
        status: "Archived",
        remark: "Approved by executive",
      });
    }
  }, [role]); 

  const handleArchive = () => {
        const approvalData = { 
          status:archaive.status,
          remark: archaive.remark,
        };

        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error: No token');
          return;
        }

        const ref_no = selectedLetter.ref_no;

          fetch(`http://localhost:8001/api/approvers/accept/${ref_no}`, {
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
              toast.success("Letter Approved!")
            })
            .catch((error) => {
              console.error("Error:", error);
              toast.error("Failed to approve.")
            });
    };
  
  const handleApprove = () => {
      const approvalData = { 
        status:approve.status,
        remark: approve.remark,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Error: No token');
        return;
      }

      const ref_no = selectedLetter.ref_no;

        fetch(`http://localhost:8001/api/approvers/accept/${ref_no}`, {
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
            toast.success("Letter Approved!")
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("Failed to approve.")
          });
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            <Typography>Accept This Letter, {selectedLetter.ref_no} </Typography>

        </DialogTitle>
        <DialogContent>
    
        </DialogContent>
        <DialogActions>
        {role && role!=="Executive" && (
          <Button 
            title='If approval is not finished'
            endIcon={<SendIcon/>} 
            onClick={handleApprove} 
            sx={{ textTransform: 'none', color:'white', bgcolor: 'blue' }}>
              {role && role==="Head" && "Send to Managing"}
              {role && role==="Manager" && "Send to Executive"}
          </Button>
        )}
          <Button 
            title='If approval is finished' 
            endIcon={<DoneAllIcon/>}
            onClick={handleArchive} 
            sx={{ textTransform: 'none', color:'white', bgcolor: 'blue' }}>
            Archive 
          </Button>
          <Button onClick={onClose} sx={{ textTransform: 'none', color:'white', bgcolor: 'red' }}>
              Close
          </Button>
        </DialogActions>
    </Dialog>
  );
};
