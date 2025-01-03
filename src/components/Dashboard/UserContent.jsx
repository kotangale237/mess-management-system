import React from "react";

const UserContent = (props) => {
  if(props.content==="complaint"){
    return (
      <div id='user-content'>
        <h2 className="text-4xl">Complaint</h2>
        <hr />
        <form action="">
          <div>
            <label htmlFor="">Regarding</label>
            <select name="" id="">
              <option value="">Food</option>
              <option value="">Staff</option>
              <option value="">Cleanliness</option>
              <option value="">Other</option>
            </select>
          </div>         
          <textarea placeholder='Write your Complaint here!' name="" id="" cols="30" rows="2"></textarea>
          <button type='submit'>Submit</button>        
        </form>
      </div>
    );
  }
  else if(props.content==="feedback"){
    return (
      <div id="user-content">
        <h2 className="text-4xl">Feedback Form</h2>
        <hr />
        
      </div>
    );
  }
  else if(props.content==="qr-code"){
    return (
      <div id="user-content">
        <h2 className="text-4xl">QR Code</h2>
        <hr />
      </div>
    );
  }
  else{
    return (
      <div id="user-content">
        <h2 className="text-4xl">User Info</h2>
        <hr />
        <div id="div1">
          <p>Name: Kamal Thakur</p>
          <p>Roll No.: 23XYZ000</p>
          <p>Email: 23xyz@gmail.com</p>
          <p>Phone: 8888888888</p>
          <p>QR Code: </p>
        </div>
        <div id="div2">
          <button>Edit</button>
        </div>
      </div>
    );
  }
};

export default UserContent;
