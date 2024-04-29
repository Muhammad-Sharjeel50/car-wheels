import './App.css';
import Login from './Components/User/Login/login';
import Register from './Components/User/Register/register';
import AdminDashboard from './Components/Dashboard/admindashboard';
import UserDashboard from './Components/Dashboard/userdashboard'
import './index.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {PrivateRoutes , PublicRoutes} from './Routes/routes';
function App() {
  return (
    <div className='font-mono'>
    <BrowserRouter>
      <Routes>
         <Route element={<PublicRoutes/>}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoutes/>}>
        <Route path="/user/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
