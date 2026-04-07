import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Navbar from '../../Components/Navbar/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='main'>
      <Navbar onLogout={handleLogout} />
      <div id='Admin'>
        <Sidebar />
        <div className='outlet'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Admin