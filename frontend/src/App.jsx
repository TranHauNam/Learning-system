import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css';
import { AlertProvider } from './components/common/alertContext.jsx';
import CustomAlert from './components/common/CustomAlert.jsx';
import { CartProvider } from './components/common/cartContext.jsx';

function App() {
  return (
    <CartProvider>
      <AlertProvider>
       <Router>
         <AppRoutes />
         <CustomAlert />
       </Router>
      </AlertProvider>
    </CartProvider>
  );
}

export default App;
