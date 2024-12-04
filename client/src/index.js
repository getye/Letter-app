import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Your main App component
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);