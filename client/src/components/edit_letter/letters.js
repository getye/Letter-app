import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LetterDetailDialog from '../new_letter/letterDetailDialog';
import { EditLetter } from './editletterDialog';
import { AcceptLetter } from '../approve_letter/acceptLetter';
import { RejectLetter } from '../approve_letter/rejectLetter';

export const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ref_no, setRef_no] = useState('');
  const [acceptedLetter, setAcceptedLetter] = useState({
    ref_no: "",
    remark: "",
  });


  const permissions = localStorage.getItem('permissions');
  const role = localStorage.getItem('userRole');


  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error: No token');
          return;
        }
  
        const response = await fetch(`http://localhost:8001/api/letters/view/${role}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setLetters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, [role]);

  const handleViewDetail = (letter) => {
    const parsedLetter = {
      ...letter,
      receiver: {
        ...letter.receiver,
        receiver_name: JSON.parse(letter.receiver.receiver_name),
        receiver_email: JSON.parse(letter.receiver.receiver_email),
      },
      cc: {
        ...letter.cc,
        ccs_name: JSON.parse(letter.cc.ccs_name),
        ccs_email: JSON.parse(letter.cc.ccs_email),
      },
    };

    setSelectedLetter(parsedLetter);
    setViewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedLetter();
    setRef_no('');
    setAcceptedLetter({
      ref_no: "",
      remark: "",
    })
    setViewDialogOpen(false);
    setEditDialogOpen(false);
    setAcceptDialogOpen(false)
    setRejectDialogOpen(false)

  };

  const handleEdit = (letter) => {
    const parsedLetter = {
      ...letter,
      receiver: {
        ...letter.receiver,
        receiver_name: JSON.parse(letter.receiver.receiver_name),
        receiver_email: JSON.parse(letter.receiver.receiver_email),
      },
      cc: {
        ...letter.cc,
        ccs_name: JSON.parse(letter.cc.ccs_name),
        ccs_email: JSON.parse(letter.cc.ccs_email),
      },
    };

    setSelectedLetter(parsedLetter);
    setEditDialogOpen(true);
    console.log("Selected letter:", parsedLetter)
  };

  

  const handleAccept = (ref_no, remark) => {
    setAcceptedLetter({
      ref_no: ref_no,
      remark: remark,
    });
    setAcceptDialogOpen(true);
  };

  const handleReject = (ref_no) => {
    setRef_no(ref_no);
    setRejectDialogOpen(true);
  };

  const columns = [
    { accessorKey: 'ref_no', header: 'Ref_No' },
    { accessorKey: 'date', header: 'Date (E.C.)' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'remark', header: 'Remark' },
    {
      header: 'Action',
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="View Detail">
            <IconButton color='info' onClick={() => handleViewDetail(row.original)}>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
          {permissions && permissions.includes('EditLetter') && (
            <>
            {((row.original.status ==="Draft") || (row.original.status ==="Rejected")) &&(
            <Tooltip title="Edit Letter">
              <IconButton color='primary' onClick={() => handleEdit(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            )}
            </>
          )}

         {role && (role === "Head") && (
            <>
            {(row.original.status ==="Pending for department approval")  &&(
            <>
            <Tooltip title="Accept Letter">
              <IconButton color='success' onClick={() => handleAccept(row.original.ref_no, row.original.remark)}>
                <CheckIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Letter">
            <IconButton color='warning' onClick={() => handleReject(row.original.ref_no)}>
              <CloseIcon/>
            </IconButton>
          </Tooltip>
          </>
            )}
            </>
          )}

         {role && (role === "Manager") && (
            <>
            {(row.original.status ==="Pending for managing approval")  &&(
            <>
            <Tooltip title="Accept Letter">
              <IconButton color='success' onClick={() => handleAccept(row.original.ref_no, row.original.remark)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Letter">
            <IconButton color='warning' onClick={() => handleReject(row.original.ref_no)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          </>
            )}
            </>
          )}
         
         {role && (role === "Executive") && (
            <>
            {(row.original.status ==="Pending for executive approval")  &&(
            <>
            <Tooltip title="Accept Letter">
              <IconButton color='success' onClick={() => handleAccept(row.original.ref_no, row.original.remark)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Letter">
            <IconButton color='warning' onClick={() => handleReject(row.original.ref_no)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          </>
            )}
            </>
          )}
        </Box>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <Box sx={{ paddingTop: 3, width: {xs:'100%', sm:'95%', md:'90%'}, margin: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={letters}
        enableSorting
        enableColumnFiltering
        initialState={{ pagination: { pageSize: 3, pageIndex: 0 } }}
        enableTopToolbar
      />

      <LetterDetailDialog
        open={viewDialogOpen}
        onClose={handleDialogClose}
        selectedLetter={selectedLetter}
      />

      <AcceptLetter
        open={acceptDialogOpen}
        onClose={handleDialogClose}
        selectedLetter={acceptedLetter}
      />

      <RejectLetter
        open={rejectDialogOpen}
        onClose={handleDialogClose}
        selectedLetter={ref_no}
      />

    <EditLetter
        open={editDialogOpen}
        onClose={handleDialogClose}
        selectedLetter={selectedLetter}
      />
    </Box>
  );
};
