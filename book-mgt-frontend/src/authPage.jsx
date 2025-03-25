import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ type }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold text-center mb-4'>{type === 'register' ? 'Register' : 'Login'}</h2>
        {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full p-2 border rounded mb-2'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-full p-2 border rounded mb-2'
          required
        />
        <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
          {type === 'register' ? 'Sign Up' : 'Sign In'}
        </button>
        <p className='text-center mt-3 text-sm'>
          {type === 'register' ? 'Already have an account?' : "Don't have an account?"} 
          <a href={type === 'register' ? '/login' : '/register'} className='text-blue-500'> {type === 'register' ? 'Login' : 'Register'}</a>
        </p>
      </form>
    </div>
  );
}
