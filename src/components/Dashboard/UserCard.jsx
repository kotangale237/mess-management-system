import React from 'react'
import userImage from '../../assets/images/foodimg4.png';

const UserCard = (props) => {

  const handleClick = (str) => {
    props.handleContent(str);
  }

  return (
    <div id='user-card-div'>
      <img id='user-img' src={userImage} alt="" />
      <ul id='user-card-ul'>
        <li className='user-card-li'><button onClick={() => {handleClick("user-info")}} >Profile</button></li>
        <li className='user-card-li'><button onClick={() => {handleClick("complaint")}} >Complaint</button></li>
        <li className='user-card-li'><button onClick={() => {handleClick("feedback")}}>Feedback</button></li>
        <li className='user-card-li'><button onClick={() => {handleClick("qr-code")}}>QR Code</button></li>
      </ul>
      <button>Logout</button>
    </div>
  )
}

export default UserCard