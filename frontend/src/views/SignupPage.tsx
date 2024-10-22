import React from 'react';
import SignupForm from '../components/forms/SignupForm';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
            Create an Account
          </h1> 
          <SignupForm />
          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to='/'
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
  );
};

export default SignupPage;
