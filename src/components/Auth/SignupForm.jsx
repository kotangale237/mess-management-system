import React from 'react'
import { useForm } from 'react-hook-form'
import { data } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

const SignupForm = () => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div id='signup-form'>
      <Header />
      <div className="container">
        <h1>Mess Registration Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label>Name:</label>
            <input type="text" {...register('name', { required: true })} />
          </div>
          <div className="inputs">
            <label>Roll No.:</label>
            <input type="text" {...register('rollno', { required: true })} />
          </div>
          <div className="inputs">
            <label>Descipline:</label>
            <select {...register('discipline', { required: true })}>
              <option value="cse">CSE</option>
              <option value="ece">ECE</option>
              <option value="me">ME</option>
              <option value="sm">SM</option>
            </select>
          </div>
          <div className="inputs">
          <label>Hostel Name:</label>
          <input type="text" {...register('hostel', { required: true })} />
          </div>
          <div className="inputs">
            <label>Mess Registered:</label>
            <select {...register('mess', { required: true })}>
              <option value="mess1">Central Mess 1</option>
              <option value="mess2">Central Mess 2</option>
            </select> 
          </div>  
          <button type='submit'>Submit</button> 
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default SignupForm