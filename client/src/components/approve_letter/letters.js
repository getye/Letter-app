import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LetterDetailDialog from '../new_letter/letterDetailDialog';
import { EditLetter } from './editletterDialog';

export const ViewLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  const permissions = localStorage.getItem('permissions');
  

  const fetchLetters = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Error: No token');
        return;
      }

      const response = await fetch('http://localhost:8001/api/letters/approve', {
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

  useEffect(() => {
    fetchLetters();
  }, []);

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
    setSelectedLetter(null);
    setViewDialogOpen(false);
    setEditDialogOpen(false);

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

  const columns = [
    { accessorKey: 'ref_no', header: 'Ref_No' },
    { accessorKey: 'date', header: 'Date (E.C.)' },
    { accessorKey: 'status', header: 'Status' },
    {
      header: 'Action',
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="View Detail">
            <IconButton onClick={() => handleViewDetail(row.original)}>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
          {permissions && permissions.includes('EditLetter') && (
            <>
            {((row.original.status ==="Draft") || (row.original.status ==="Rejected")) &&(
            <Tooltip title="Edit Letter">
              <IconButton onClick={() => handleEdit(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
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
    <Box sx={{ paddingTop: 3, width: '80%', margin: 'auto' }}>
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
    <EditLetter
        open={editDialogOpen}
        onClose={handleDialogClose}
        selectedLetter={selectedLetter}
      />
    </Box>
  );
};
