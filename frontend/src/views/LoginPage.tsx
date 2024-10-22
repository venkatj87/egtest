import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm />
      <Link to='/signup'>Sign Up</Link>
    </div>
  );
};

export default LoginPage;