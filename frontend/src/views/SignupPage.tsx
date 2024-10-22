import React from 'react';
import SignupForm from '../components/forms/SignupForm';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  return (
    <div>
        <h2>Sign Up</h2>
        <SignupForm />
        <Link to='/'>Login</Link>
    </div>
  );
};

export default SignupPage;
