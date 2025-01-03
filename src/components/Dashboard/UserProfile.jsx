import React, { useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import UserCard from './UserCard'
import UserContent from './UserContent'

const UserProfile = () => {

  const[content,setContent] = useState("user-info");

  const handleContent = (str) => {
    if(str==="complaint"){
      setContent("complaint");
    }
    else if(str==="feedback"){
      setContent("feedback");
    }
    else if(str==="qr-code"){
      setContent("qr-code");
    }
    else{
      setContent("user-info");
    }
  }

  return (
    <div id='user-profile'>
        <Header />
          <div id='user-profile-content'>
            <UserCard content={content} handleContent={handleContent} />            
            <UserContent content={content} />
          </div>
        <Footer />
    </div>
  )
}

export default UserProfile