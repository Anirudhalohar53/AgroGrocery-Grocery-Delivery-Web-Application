import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo.png'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = ({ onLogout }) => {
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  return (
    <div className='navbar'>
      <div className='admin'>
        <img src={navlogo} alt="" className="nav_logo" />
        <h3>AgroGrocery <span>ADMIN PANEL</span></h3>
      </div>
      <div className="navbar-actions">
        <span className="admin-email">{adminEmail}</span>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
        {/* <img src={navProfile} className='nav-profile' alt="" /> */}
      </div>
    </div>
  )
}

export default Navbar