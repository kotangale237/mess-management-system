import React from 'react';

const UserContent = ({ content, user }) => {
  if (content === 'complaint') {
    return (
      <div id="user-content">
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
          <textarea placeholder="Write your Complaint here!" name="" id="" cols="30" rows="2"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else if (content === 'feedback') {
    return (
      <div id="user-content">
        <h2 className="text-4xl">Feedback</h2>
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
          <textarea placeholder="Write your Feedback here!" name="" id="" cols="30" rows="2"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else if (content === 'qr-code') {
    return (
      <div id="user-content">
        <h2 className="text-4xl">QR Code</h2>
        <hr />
        <div id='user-qrcode-div'>
          <img src={user?.qrcode} alt="Student QR Code" />
        </div>
      </div>
    );
  } else {
    return (
      <div id="user-info">
        <h2>User Info</h2>
        <hr />
        <div id="user-info-div">
          <p>Name: {user?.name}</p>
          <p>Roll No.: {user?.rollno}</p>
          <p>Email: {user?.email}</p>
          <p>Discipline: {user?.discipline}</p>
          <p>Registered Mess: {user?.regmess}</p>
        </div>
        <div id="user-info-actions">
          <button>Edit</button>
        </div>
      </div>
    );
  }
};

export default UserContent;
