
import { MainBar } from './navigations/mainbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Signin} from './components/signin'
import { Home } from './components/home'
import { ViewUsers } from './components/admin/AddUsers';
import { AddRoles } from './components/admin/AddRoles';
import { UpdateProfile } from './components/updateProfile';

import { AbilityProvider } from './AbilityProvider'; 
import { AbilityContext } from './AbilityProvider';
import { Can } from '@casl/react';
import React, { useContext } from 'react';
import { Unauthorized } from './components/unauthorized';
import { Report } from './components/admin/Report';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AddOffice } from './components/admin/AddOffices';
import { Dashboard } from './components/dashboard';
import { Letters } from './components/edit_letter/letters';
import { NewLetter } from './components/new_letter/newLetter';
import { ToastContainer } from "react-toastify";

const theme = createTheme();

const ProtectedRoute = ({ action, subject, element }) => {
  const ability = useContext(AbilityContext);

  return (
    <Can I={action} a={subject} ability={ability}>
      {(allowed) => (allowed ? element : <Navigate to="/unauthorized" />)}
    </Can>
  );
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <AbilityProvider>
        <MainBar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signin' element={<Signin/>}/>

            <Route
              path="/admin/users"
              element={<ViewUsers />} 
            />
            <Route
              path="/admin/dashboard"
             element={<Report />} 
            />
            <Route
              path="/admin/roles"
              element={<AddRoles />}
            />
            <Route
              path="/admin/offices"
              element={<AddOffice />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/letters"
              element={<Letters />}
            />
            
            <Route
              path="/new-letter"
              element={<NewLetter/>}
            />
            
            <Route
              path="/users/update/profile"
              element={<ProtectedRoute action="update" subject="Profile" element={<UpdateProfile />} />}
            />
            
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
        <ToastContainer />
      </AbilityProvider> 
    </ThemeProvider>
  );
}

export default App;
