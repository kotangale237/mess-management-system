import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const ComplaintForm = () => {
  return (
    <div>
      <Header />
      <div id='complaint-form-div'>
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
      <Footer />
    </div>
  )
}

export default ComplaintForm