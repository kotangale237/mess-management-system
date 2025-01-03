import React from 'react'
import { NavLink } from 'react-router-dom'
import '../assets/styles.css'
import logo from '../assets/images/messchain.jpg'

const header = () => {

  const cname = ({isActive})=>{
    if(isActive) return "active-link";
    return "link"
  }

  return (
    <div id='header' >
      <div id='logo'>
        <img id='logo-img' src={logo} alt="logo" />
      </div>
      <ul id='header-ul'> 
        <li className='header-li'><NavLink to="/" className={cname}>Home</NavLink></li>
        <li className='header-li'><NavLink to="/login" className={cname}>Login</NavLink></li>
        <li className='header-li'><NavLink to="/signup" className={cname}>Register</NavLink></li>
        <li className='header-li'><NavLink to="/complaints" className={cname}>Complaints</NavLink></li>
        <li className='header-li'><NavLink to="/feedbacks" className={cname}>Feedbacks</NavLink></li>
        <li className='header-li'><NavLink to="/qr-scanner" className={cname}>QR Scanner</NavLink></li>
        <li className='header-li'><NavLink to="/about-us" className={cname}>About Us</NavLink></li>
        <li className='header-li'><NavLink to="/contact-us" className={cname}>Contact Us</NavLink></li>
      </ul>
    </div>
  )
}

export default header