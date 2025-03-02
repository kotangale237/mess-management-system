import React from 'react'
import { NavLink } from 'react-router-dom'
import '../assets/styles.css'
import logo from '../assets/images/IIITDMJ-Logo.jpg'

const header = () => {

  const cname = ({isActive})=>{
    if(isActive) return "active-link";
    return "link"
  }

  return (
    <div id='header' >
      <div id='logo'>
        { <img id='logo-img' src={logo} alt="logo" /> }
        <h1 id='header-title'></h1>
      </div>
      <ul id='header-ul'> 
        <li className='header-li'><NavLink to="/" className={cname}>Home</NavLink></li>
        <li className='header-li'><NavLink to="/login" className={cname}>Login</NavLink></li>
        <li className='header-li'><NavLink to="/signup" className={cname}>Register</NavLink></li>
        <li className='header-li'><NavLink to="/complaints" className={cname}>Complaints</NavLink></li>
        <li className='header-li'><NavLink to="/aboutus" className={cname}>About Us</NavLink></li>
        <li className='header-li'><NavLink to="/buy-token" className={cname}>Buy Token</NavLink></li>
        <li className='header-li'><NavLink to="/staff" className={cname}>Staff</NavLink></li>
        <li className='header-li'><NavLink to="/admin" className={cname}>Admin</NavLink></li>
      </ul>
    </div>
  )
}

export default header