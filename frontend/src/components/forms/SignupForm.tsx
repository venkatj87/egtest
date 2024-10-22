import React, { useState } from 'react';
import { useFormik, FormikErrors } from 'formik';
import { userRegister } from '../../utils/api';
import { __toString } from '../../utils/helpers';
import { saveItem } from '../../utils/storage';
import { Navigate } from 'react-router-dom';

// Define an interface for the form fields
interface SignupFields {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // for navigation fallback

  const handleSignup = async (values: SignupFields) => {
    try {
      const response = await userRegister(values.email, values.name, values.password);
      if (!response.data._id) {
        throw new Error('Invalid response from the server. Please try again.');
      }
      saveItem('user', response.data);

      // Navigate to the home page after successful signup
      setIsRegistered(true);
    } catch (err: any) {
      console.error(err);

      // Handle specific error message from response or set a default error
      const errorMessage = err.response?.data?.message ? __toString(err.response.data.message) : 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

  const validate = (values: SignupFields): FormikErrors<SignupFields> => {
    const errors: FormikErrors<SignupFields> = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length < 2 || values.name.length > 15) {
      errors.name = 'Must be between 2 to 15 characters';
    }

    if (!values.password) {
      errors.password = 'Required';
    } else if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/i.test(values.password)) {
      errors.password = 'Password must contain at least 1 letter, 1 number, and 1 special character';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      handleSignup(values);
    },
  });

  // Redirect the user if they are successfully registered
  if (isRegistered) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Enter your name"
              maxLength={15}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formik.errors.name && <div className="text-red-600 mt-1">{formik.errors.name}</div>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formik.errors.email && <div className="text-red-600 mt-1">{formik.errors.email}</div>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Enter your password"
              minLength={8}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formik.errors.password && <div className="text-red-600 mt-1">{formik.errors.password}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;