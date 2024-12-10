import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LetterDetailDialog from '../new_letter/letterDetailDialog';

export const ReceivedLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);



  const email = localStorage.getItem('email');


  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error: No token');
          return;
        }
  
        const response = await fetch(`http://localhost:8001/api/letters/received/${email}`, {
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
  }, [email]);

  // Sorting by the most recent date
  const sortedLetter = Array.isArray(letters) && letters.length > 0
  ? letters.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB - dateA; // Descending order
    })
  : []; // Return an empty array if letters is empty or not an array


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
      approver: {
        approvers_name: letter.approver && letter.approver.approvers_name
          ? letter.approver.approvers_name // safely access approvers_name if approver is not null
          : '',  // Default to an empty string if approver is null or approvers_name is not available
        approvers_position: letter.approver && letter.approver.approvers_position
          ? JSON.parse(letter.approver.approvers_position) 
          : '',  // Default to an empty array if approvers_position is not available
      }
      
      
    };

    setSelectedLetter(parsedLetter);
    setViewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedLetter();
    setViewDialogOpen(false);

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
        data={sortedLetter}
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
    </Box>
  );
};
