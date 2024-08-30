import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ENV from '../../config.json';

const Login = () => {
  const api = ENV.base_url + 'login';
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      const token = response.data.token
      const email = response.data.user.email
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_email', email);
      navigate('/admin');
    } catch (error) {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-login">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header p-5">
              <h4 className='mb-0 text-center'>Login</h4>
            </div>
            <div className="card-body pt-0">
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <a href="#" className="text-light mb-3">Reset password</a>
                <button type="submit" className="btn btn-primary rounded-0 w-100">Submit</button>
              </form>
            </div>
            <div className="card-footer">
              <p>New User? <Link to="/signup" className="text-light">Create account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
