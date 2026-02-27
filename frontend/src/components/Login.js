import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../services/api';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
         const API = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            "Content-Type": "application/json",
        },
        });

        const response = await API.post('/api/auth/login', { username, password });
       console.log('Login response:', response.data);
       console.log('Token received:', response.data.token ? 'Yes' : 'No');


        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({ id: response.data.user_id, username }));
          toast.success('Login successful!');
          // Trigger custom event to notify App.js
          window.dispatchEvent(new Event('tokenUpdate'));
          navigate('/tasks');
        } else {
          toast.error('Login failed. No token received.');
        }

     // const response = await login({ username, password });
    //   localStorage.setItem('token', response.token);
    //   localStorage.setItem('user', JSON.stringify({ id: response.user_id, username }));
    //   toast.success('Login successful!');
    //   navigate('/tasks');

    } catch (error) {
      toast.error('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <div className="form-container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>TaskFlow Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
          Demo: testuser / password123
        </p>
      </div>
    </div>
  );
}

export default Login;

