import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ENV from '../../config.json';

const Signup = () => {
  const api = ENV.base_url + 'register';
  const navigate = useNavigate();

  const [user, setUser] = useState({
    storename: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    password_confirmation: '',
    role: 'owner',
  });
  const [errors, setErrors] = useState({
    storename: '',
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [success, setSuccess] = useState('');
  const [danger, setDanger] = useState('');

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, user, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Your account has been created successfully');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Map the errors to the state
        setErrors({
          storename: error.response.data.errors.storename,
          name: error.response.data.errors.name,
          email: error.response.data.errors.email,
          password: error.response.data.errors.password,
          password_confirmation: error.response.data.errors.password_confirmation,
          phone: error.response.data.errors.phone,
          role: error.response.data.errors.role,
        });
      } else {
        console.error('Error submitting user:', error);
        setDanger('Error creating account. Please try again later.');
      }
    }
  };

  return (
    <>
      <div className="bg-login">
        <div className="col-md-6 py-5">
          <div className="card">
            <div className="card-header p-5">
              <h4 className='mb-0 text-center'>Signup</h4>
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}
              {danger && (
                <div className="alert alert-danger">
                  {danger}
                </div>
              )}
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name='role' value='owner' />
                <div className="mb-3">
                  <label className="form-label">Store name</label>
                  <input type="text" className="form-control" name='storename' value={user.storename} onChange={handleChange} />
                  {errors.storename && <small className="text-white">{errors.storename}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" name='name' value={user.name} onChange={handleChange} />
                  {errors.name && <small className="text-white">{errors.name}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" name='phone' value={user.phone} onChange={handleChange} />
                  {errors.phone && <small className="text-white">{errors.phone}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" className="form-control" name='email' value={user.email} onChange={handleChange} />
                  {errors.email && <small className="text-white">{errors.email}</small>}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' value={user.password} onChange={handleChange} />
                    {errors.password && <small className="text-white">{errors.password}</small>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name='password_confirmation' value={user.password_confirmation} onChange={handleChange} />
                    {errors.password_confirmation && <small className="text-danger">{errors.password_confirmation}</small>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary rounded-0 w-100">Submit</button>
              </form>
            </div>
            <div className="card-footer">
              <p>Existing User? <Link to="/" className="text-light">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
