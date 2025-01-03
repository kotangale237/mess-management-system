import React from 'react'
import { useForm } from 'react-hook-form'
import Header from '../Header';
import Footer from '../Footer';

const LoginForm = () => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div id='login-form'>
      <Header />
      <div className="container">
        <h1>Student's Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label>Roll No.:</label>
            <input type="text" {...register('rollno', { required: true })} />
          </div>
          <div className="inputs">
            <label>Password:</label>
            <input type="password" {...register('password', { required: true })} />
          </div>
          <button type='submit'>Submit</button> 
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default LoginForm
  