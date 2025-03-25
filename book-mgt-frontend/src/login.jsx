import { useState } from 'react';
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // console.log("API URL:", apiUrl); // Debugging API URL => success

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`http://localhost:5500/api/v1/admin/loginAdmin`, { email, password },  {
  //     // const response = await axios.post(`${process.env.COMMON_URL}/loginAdmin`, { email, password },  {
  //     // const response = await axios.post(`${import.meta.env.VITE_COMMON_URL}/loginAdmin`, { email, password },  {
  //       withCredentials: true, // Important for cookies
  //       headers: { "Content-Type": "application/json" }
  //     });
  //     if (response.data.success) {
  //       navigate('/dashboard');
  //     }
  //   } catch (err) {
  //     // console.log(`${process.env.COMMON_URL}`);
  //     setError(err.response?.data?.message || 'Login Failed !!');
  //     // setError(err.response?.data?.message || 'Login failed');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log("Logging in with:", userName,email, password); // Debugging
  
      const response = await axios.post(
        `${apiUrl}/loginAdmin`,
        { email, userName, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
      setError(err.response?.data?.message || "Login Failed !!");
    }
  };
  
  return (    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">userName</label>
            <input
              type="userName"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
