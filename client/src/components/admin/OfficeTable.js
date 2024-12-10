// UserTable.js
import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, IconButton, Snackbar, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateOfficeModal from './UpdateOfficeModal';


const OfficeTable = ({ handleOpen }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null); 

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [messageType, setMessageType] =useState('')
  const fetchRoles = async () => {
    
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
          console.log('Error: No token');
        }
      const response = await fetch('http://localhost:8001/api/offices/view', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token
          },
      });
      const data = await response.json();
      //if (!Array.isArray(data)) throw new Error('Data is not an array');
      setOffices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);


  const handleUpdate = (office) => {
    setSelectedOffice(office); // Set the selected role
    setOpenModal(true); // Open the modal
  };

const handleModalClose = () => {
    setOpenModal(false); // Close the modal
  };

const handleSubmitUpdate = async (updatedOffice) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
          console.log('Error: No token');
        }
      const response = await fetch(`http://localhost:8001/api/offices/update/${updatedOffice.office_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          office_name: updatedOffice.office_name,
          writer: updatedOffice.writer,
          head: updatedOffice.head,
          manager: updatedOffice.manager, 
        }),
      });
  
      // Check if the update was successful
      if (response.ok) {
        // Update the local state after successful update
        setOffices((prevOffices) =>
          prevOffices.map((office) =>
            office.office_id === updatedOffice.office_id ? updatedOffice : office
          )
        );
        setMessageType('Success');
        setOpenModal(false); // Close the modal
        setNotificationMessage('Office Successfully Updated');
        setShowNotification(true);
      } else {
        // Handle error response
        setMessageType('Error');
        setNotificationMessage(`Error: ${response.statusText}`);
        setShowNotification(true);
      }
    } catch (err) {
      setNotificationMessage('An unexpected error occurred');
      setShowNotification(true);
      console.error(err);
    }
  };
  

const handleDelete = async (office) => {
    if (!window.confirm(`Are you sure you want to delete office: ${office.office_name}?`)) {
      return;
    }
    const token = localStorage.getItem('token'); // Retrieve the token from storage
      
    if(!token){
        console.log('Error: No token');
      }
  
    try {
      const response = await fetch(`http://localhost:8001/api/roles/delete/${office.office_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
      });
  
      if (response.ok) {
        // Remove the deleted role from the local state
        setMessageType('Success');
        setOffices((prevOffices) => prevOffices.filter((r) => r.office_id !== office.office_id));
        setNotificationMessage('Office Deleted Successfully');
        setShowNotification(true);
      } else {
        // Handle error response
        setMessageType('Error');
        setNotificationMessage(`Error: ${response.statusText}`);
        setShowNotification(true);
      }
    } catch (err) {
      setNotificationMessage('An unexpected error occurred while deleting the role');
      setShowNotification(true);
      console.error(err);
    }
  };
  


  
  
  const columns = [
    { accessorKey: 'office_name', header: 'Office Name' },
    { accessorKey: 'type', header: 'Office Type' },
    { accessorKey: 'writer_name', header: 'Writer' },
    { accessorKey: 'head_name', header: 'Head' },
    { accessorKey: 'manager_name', header: 'Manager' },
    { accessorKey: 'executive_name', header: 'Executive' },
    {
      header: 'Action',
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="Update Office">
            <IconButton onClick={() => handleUpdate(row.original)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Office">
            <IconButton onClick={() => handleDelete(row.original)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <Box sx={{ paddingTop: 3, 
      ml: {xs: '1%', sm: '3%', md: '5%', lg: '7%'},
      mb: {xs: 1, sm: 2, md: 3, lg: 4},
    }}>
      <MaterialReactTable
        columns={columns}
        data={offices}
        enableSorting
        enableColumnFiltering
        initialState={{ pagination: { pageSize: 3, pageIndex: 0 } }}
        enableTopToolbar
        renderTopToolbarCustomActions={() => (
          <Button onClick={handleOpen} sx={{ bgcolor: '#357EC7', color: 'white', textTransform: 'none' }}>
            Add Office
          </Button>
        )}
      />
      {selectedOffice && (
        <UpdateOfficeModal
          open={openModal}
          office={selectedOffice}
          onClose={handleModalClose}
          onSubmit={handleSubmitUpdate}
        />
      )}

    <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        >
        <Alert
            onClose={() => setShowNotification(false)}
            severity={String(messageType).includes('Success') ? 'success' : 'error'}
            sx={{ width: '100%' }}
        >
            {notificationMessage}
        </Alert>
    </Snackbar>
    </Box>
  );
};

export default OfficeTable;



